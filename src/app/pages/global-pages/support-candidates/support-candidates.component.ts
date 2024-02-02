import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-support-candidates',
  templateUrl: './support-candidates.component.html',
  styleUrls: ['./support-candidates.component.css']
})
export class SupportCandidatesComponent implements OnInit {

  constructor(
    private readonly meta: Meta,
    private readonly title: Title,
   
  ) { }

  ngOnInit(): void {
  }

}
