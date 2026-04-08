import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

// Static lookup table for legacy URLs.  You can either populate this list
// manually or pull it from a backend API/JSON file during app initialization.
// Only a handful of examples are shown here; add the rest of your old paths
// or generate this object programmatically as part of your build.
const LEGACY_REDIRECTS: Record<string, string> = {
  '/old-page': '/product/new-slug',
  '/health-concern/sitopaladi-churna':
    '/product/tikaram-naturals-sitopaladi-churan-30-gm',
  '/health-concern/vyas-kaunch-beej-churna':
    '/product/vyas-kaunch-beej-churna-100-gm',
  '/healthybazar.com': '/',
  '/www.healthybazar.com': '/',
  '/www.healthybazar.com.': '/',
  '/undefined': '/',
  // ...add additional mappings here (see the commented list in app.routes.ts)
};

@Injectable({ providedIn: 'root' })
export class ProductRedirectGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const url = state.url; // includes leading '/'

    // don't interfere with normal product routes or root
    if (url === '/' || url.startsWith('/product/')) {
      return true;
    }

    const target = LEGACY_REDIRECTS[url];
    if (target) {
      // perform a navigation to the new path; cancel current navigation
      this.router.navigateByUrl(target);
      return false;
    }

    // simple heuristic: if the unknown path consists of a single slug segment
    // (e.g. "/himalaya-liv-52-tab-1-unit") we assume it used to be a product
    // URL and just prepend "/product" automatically.  This saves maintaining
    // an enormous list when old slugs already match the new slug format.
    const segments = url.split('/').filter((s) => s.length > 0);
    if (segments.length === 1) {
      this.router.navigateByUrl(`/product/${segments[0]}`);
      return false;
    }

    // no known redirect: allow not-found component to render
    return true;
  }
}
