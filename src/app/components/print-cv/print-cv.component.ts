import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-print-cv',
  templateUrl: './print-cv.component.html',
  styleUrls: ['./print-cv.component.css']
})
export class PrintCvComponent implements OnInit {


  public htmlToAdd  :  any = "";
  styleSheet: string = '';


  constructor(private http :HttpClient, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.http.get('../../../assets/styles/print-pdf.css', {responseType: 'text'}).subscribe(
      styleSheet => {
        this.styleSheet = styleSheet;
      }
    )

    this.http.get('../../../assets/styles/print.html', {responseType: 'text'}).subscribe(
      html => {        
        this.htmlToAdd = html;
      }
    )
  }




 public printPDF() {

  const printArea : HTMLElement | null = document.getElementById('pdf');
  
  const printWindow = window.open("", "Print-Window")!;
  printWindow.document.write(`<html lang="en"><head><style> ${this.styleSheet} </style> </head><body></body>${printArea?.innerHTML}</html>`);

  // const htmlA = this.sanitizer.bypassSecurityTrustHtml(this.htmlToAdd);    
  printWindow.document.close();
  printWindow.focus();
  printWindow.document.title = 'Your PDF Title';
  printWindow.print();
 }

}
