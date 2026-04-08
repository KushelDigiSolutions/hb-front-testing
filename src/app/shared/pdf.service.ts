import { Injectable, NgZone } from '@angular/core';
import { DynamicScriptLoaderService } from '../services/dynamic-script-loader.service';
// import { SpinnerService } from '../components/spinner/spinner.service';


declare var html2pdf: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
    private scriptLoader: DynamicScriptLoaderService,
    private ngZone: NgZone,
  ) { }

  downloadPDF(htmlSelector: any, filename: any) {
    let { scrollX, scrollY } = window;
    if (scrollX != 0 || scrollY != 0) {
      window.scroll(0, 0);
    }

    // this.spinner.show();
    document.body.classList.add('downloading-pdf');
    setTimeout(() => {
      this.scriptLoader.load('html2pdf').then(() => {
        let node = document.querySelector(htmlSelector);
        var opt = {
          margin: 0,
          filename,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { letterRendering: true, scale: 4, useCORS: true },
          jsPDF: { unit: "mm", format: 'letter', orientation: "portrait" },
        };

        html2pdf()
          .from(node)
          .set(opt)
          .save()
          .then(() => {
            this.ngZone.run(() => {
              // this.spinner.hide();
              window.scroll(scrollX, scrollY);
              document.body.classList.remove('downloading-pdf');
            })
          })
          .catch((err: any) => {
            this.ngZone.run(() => {
              // this.spinner.hide();
              document.body.classList.remove('downloading-pdf');
            })
          });
      }).catch((e: any) => {
        console.error('[Custom Error html2pdf]', e);
      });

    }, scrollX != 0 || scrollY != 0 ? 500 : 10);
  }

}
