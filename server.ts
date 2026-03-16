// Import dotenv in an ESM context
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { Request, Response } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import http from 'http';
import https from 'https';
import bootstrap from './src/main.server';
import { environment } from './src/environments/environment';
import { REQUEST, RESPONSE } from './src/app/services/express.service';
import { redirects } from './redirects';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.get('/robots.txt', (req, res, next) => {
    let reqUrl = environment.apiUrl + 'robots.txt';
    const _URL = new URL(reqUrl)

    console.log('[_URL.port]', _URL.port)
    const options = {
      hostname: _URL.hostname,
      port: _URL.port || (_URL.protocol == 'http:' ? 80 : 443),
      path: _URL.pathname,
      // method: 'GET',

      headers: {
        apikey: environment.apikey,
      }
    };
    console.log('[options]', options);
    try {
      (reqUrl.indexOf('https://') == 0 ? https : http).get(options, (resp) => {
        var body = ''
        resp.on('data', function (data) {
          body += data;
        });

        resp.on('end', function () {
          console.log('[resp robots.txt]', resp.statusCode)
          if (resp.statusCode == 200) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.send(body);
          } else next();
        });
      }).on('error', (e) => {
        console.log('[error]', e)
        next();
      });

    } catch (e) {
      console.log('[robots e]', e);

    }
  });

  

  server.get('/sitemap*.xml', (req, res, next) => {
    let { url } = req;
    let index = url.indexOf('-');
    let endpoint = 'healthy-bazar.xml';
    if (index != -1) {
      endpoint = url.substr(index + 1);
    }
    let reqUrl = 'https://api.healthybazar.com/generated/' + endpoint;
    (reqUrl.indexOf('https://') == 0 ? https : http).get(reqUrl, (resp) => {
      var body = ''
      resp.on('data', function (data) {
        body += data;
      });

      resp.on('end', function () {
        if (resp.statusCode == 200) {
          res.setHeader('Content-Type', 'text/xml; charset=utf-8');
          res.send(body);
        } else next();
      });
    }).on('error', (e) => {
      next();
    });
  });

server.get('/test-redirect', (req, res) => {
  console.log('Manual redirect hit');
  res.redirect(301, '/target');
});

  server.get('/sitemap*.xml', (req, res, next) => {
      const rawPath = decodeURIComponent(req.path);
      const path = rawPath.replace(/\/+$/, '').toLowerCase();

      if (!redirects[path]) {
        console.log('No redirect for:', path)
      }
      console.log(`[REDIRECT] ${req.originalUrl} -> ${redirects[path]}`);
      if (req.method === 'GET' && redirects[path] && path !== redirects[path]) {
        return res.redirect(301, redirects[path])
      } else {
         return next()
      }
  });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));



  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    console.log("SSR")
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST, useValue: req }
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 8082;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
