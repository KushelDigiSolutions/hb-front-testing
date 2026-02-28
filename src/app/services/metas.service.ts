import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';


export interface SeoMetaTags {
  title?: string,
  ogTitle?: string,
  description?: string,
  ogDescription?: string,
  keywords?: string,
  image?: string | any
}

@Injectable({
  providedIn: 'root'
})
export class MetasService {
  private SCHEMA_ID = 'json-ld-schema';
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private title: Title,
    private meta: Meta,
    private api: ApiService,
  ) { }

  setTitle(titleName: any) {
    this.title.setTitle(titleName);
  }

  setTags(tags: any) {
    this.meta.addTags(tags)
  }

  setNoIndexTag() {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  removeNoIndexTag() {
    this.meta.removeTag("name='robots'")
  }

  setLinkTag(attrs: any) {
    try {
      let link: HTMLLinkElement = this.document.createElement('link');
      for (let key in attrs) {
        link.setAttribute(key, attrs[key]);
        this.document.head.appendChild(link);
      }
    } catch (e) { }
  }

  setMetaTags(metas: SeoMetaTags, appendSiteNameOnTitle: boolean = true) {
    const title = metas.title ? metas.title + (appendSiteNameOnTitle ? ' | HealthyBazar' : '') : 'HealthyBazar';
    let ogTitle;
    if (metas.ogTitle) ogTitle = metas.ogTitle + (appendSiteNameOnTitle ? ' | HealthyBazar' : '');

    const image = metas.image || environment.imageUrl + 'hb-social-image.png';

    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: ogTitle || title });
    this.meta.updateTag({ name: 'twitter:title', content: ogTitle || title });

    if (metas.description) {
      let desc = this.removeHTMLTags(metas.description)
      let ogDesc = this.removeHTMLTags(metas.ogDescription || '')

      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ property: 'og:description', content: ogDesc || desc });
      this.meta.updateTag({ name: 'twitter:description', content: ogDesc || desc });
    } else {
      this.meta.removeTag("name='description'")
      this.meta.removeTag("property='og:description'")
      this.meta.removeTag("name='twitter:description'")
    }
    if (metas.keywords) {
      this.meta.updateTag({ name: 'keywords', content: metas.keywords });
    } else {
      this.meta.removeTag("name='keywords'")
    }
    this.meta.updateTag({ name: 'image', content: image });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.removeLinkTags(['[rel="image_src"]'])

    this.setLinkTag({ rel: 'image_src', href: image });
  }

  setCanonical(url: string) {
    this.meta.updateTag({ property: 'og:url', content: url });

    this.removeLinkTags(['[rel="canonical"]', '[rel="alternate"]']);
    this.setLinkTag({ rel: 'canonical', href: url });
    // this.setLinkTag({ rel: 'alternate', href: url, hreflang: 'en-IN' });
  }

  removeLinkTags(selectors: string[]) {
    selectors.forEach(selector => {
      let elem = this.document.querySelector(selector);
      elem && elem.remove();
    })
  }

  removeHTMLTags(htmlString: any): string {
    return (htmlString || '').replace(/<[^>]*>?/gm, '')
  }

  setPageMeta(name: string, fallbackTitle?: string) {
    this.api.get<{ success: boolean, data: any }>('metacontents/detail?name=' + name).subscribe((res: any) => {
      let { data, success } = res
      if (success) {
        let { metaTitle, metaDescription } = data || {};
        this.setMetaTags({
          title: metaTitle || fallbackTitle,
          description: metaDescription,
        })
      }
    }, (err: HttpErrorResponse) => {

    })
  }


  removePreviousSchema() {
    const scripts = this.document.head.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }

  // private removePreviousSchema() {
  //   const existing = this.document.getElementById(this.SCHEMA_ID);
  //   if (existing) {
  //     existing.remove();
  //   }
  // }

  addBlogSchema(imageUrl:any, description:any, title:any, authorName:any, publishedDate:any, url:any) {
    this.removePreviousSchema();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "image": imageUrl,
      "author": {
        "@type": "Person",
        "name": authorName
      },
      "publisher": {
        "@type": "Organization",
        "name": "HealthyBazar",
        "logo": {
          "@type": "ImageObject",
          "url": "https://healthybazar.com/assets/images/navbar-images/logo.svg"
        }
      },
      "url": "https://healthybazar.com/lifestyle-tips"+url,
      "datePublished": publishedDate,
      //"dateModified": "2025-04-10",
      "description": description    
      // ... more product data
    });
    this.document.head.appendChild(script);
  }

  setHomeAndAboutUsSchema(){
    this.removePreviousSchema();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://healthybazar.com/#website",
          "url": "https://healthybazar.com/",
          "name": "HealthyBazar",
          "description": "Buy Ayurvedic medicine online and embrace natural healing. Elevate your well-being with trusted AYUSH medicines & consultations available at HealthyBazar.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://healthybazar.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://healthybazar.com/#organization",
          "name": "HealthyBazar",
          "url": "https://www.healthybazar.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://healthybazar.com/assets/images/navbar-images/logo.svg"
          },
          "sameAs": [
            "https://www.facebook.com/healthybazar/",
            "https://www.instagram.com/healthybazar",
            "https://www.youtube.com/channel/UCR5FTS-wm9YgMY1yzLyE9SQ/"
          ]
        }
      ]
    });
    this.document.head.appendChild(script);
  }


  setProductSchema(imageUrl:any, description:any, price:any, brand:any, name:any, url:any){
    this.removePreviousSchema();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": name,
      "image": [
        imageUrl
      ],
      "description": description,
      //"sku": "PRODUCT-SKU",
      "brand": {
        "@type": "Brand",
        "name": brand
      },
      "offers": {
        "@type": "Offer",
        "url": url,
        "priceCurrency": "INR",
        "price": price.minPrice,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": 5,
        "reviewCount": 1
      }
    });
    this.document.head.appendChild(script);
  }

  setBreadCrumb(subCategory2 :any, subCategory2Url:any, subCategory3:any, subCategory3Url: any){
    //this.removePreviousSchema();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": environment.appHost
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": subCategory2,
          "item": subCategory2Url
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": subCategory3,
          "item": subCategory3Url
        }
      ]
    });
    this.document.head.appendChild(script);
  }
}
