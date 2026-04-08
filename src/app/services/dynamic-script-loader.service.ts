import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { environment } from "../../environments/environment";

interface Scripts {
    tag: 'script' | 'link',
    name: string;
    src?: string;
    href?: string;
    innerScript?: string;
    attr?: { name: string, value?: string }[]
}

export const ScriptStore: Scripts[] | any = [
    {
        tag: "script", name: 'paytmjs', src: `${environment.paytmHost}merchantpgpui/checkoutjs/merchants/${environment.mid}.js`, attr: [
            { name: 'crossorigin', value: 'anonymous' },
        ]
    },
    {
        tag: "script", name: 'g-login', src: 'https://apis.google.com/js/platform.js', attr: [
            { name: 'async', value: '' },
            { name: 'defer', value: '' },
        ]
    },
    // {
    //     tag: "script", name: 'gtag', src: "https://www.googletagmanager.com/gtag/js?id=AW-564095127", attr: [
    //         { name: 'async', value: '' }
    //     ]
    // },
    // {
    //     tag: "script", name: 'gtm', innerScript: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    //     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    //     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    //     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    //     })(window,document,'script','dataLayer','GTM-PHQWSXZ');`
    // },
    {
        tag: "script", name: 'html2pdf', src: '/assets/js/html2pdf.bundle.min.js', attr: []
    },
    {
        tag: 'link', name: 'bootstrapmd', href: '/assets/angular-bootstrap-md/bootstrap.min.css', attr: [
            , { name: 'rel', value: "stylesheet" }
        ]
    },

];

@Injectable({
    providedIn: 'root'
})
export class DynamicScriptLoaderService {

    private scripts: any = {};

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                tag: script.tag,
                src: script.src,
                href: script.href,
                innerScript: script.innerScript,
                attr: script.attr || []
            };
        });
    }

    load(...scripts: string[]) {
        const promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }

    private loadScript(name: string) {
        return new Promise((resolve, reject) => {
            if (!this.scripts[name].loaded) {
                //load script
                let script = this.document.createElement(this.scripts[name].tag);

                if (this.scripts[name].tag == 'script') {
                    script.type = 'text/javascript';
                }

                if (this.scripts[name].src || this.scripts[name].href) {

                    if (this.scripts[name].src) script.src = this.scripts[name].src;
                    if (this.scripts[name].href) script.href = this.scripts[name].href;

                    this.scripts[name].attr.forEach((el: any) => {
                        script.setAttribute(el.name, el.value)
                    });
                    if (script['readyState']) {  //IE
                        script['onreadystatechange'] = () => {
                            if (script['readyState'] === "loaded" || script['readyState'] === "complete") {
                                script['onreadystatechange'] = null;
                                this.scripts[name].loaded = true;
                                resolve({ script: name, loaded: true, status: 'Loaded' });
                            }
                        };
                    } else {  //Others
                        script.onload = () => {
                            this.scripts[name].loaded = true;
                            resolve({ script: name, loaded: true, status: 'Loaded' });
                        };
                    }
                    script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
                } else if (this.scripts[name].innerScript) {
                    script.appendChild(this.document.createTextNode(this.scripts[name].innerScript));
                    this.scripts[name].loaded = true;
                    resolve({ script: name, loaded: true, status: 'Loaded' });
                }

                this.document.getElementsByTagName('head')[0].appendChild(script);
            } else {
                resolve({ script: name, loaded: true, status: 'Already Loaded' });
            }
        });
    }
}