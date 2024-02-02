import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policies',
  templateUrl: './privacy-policies.component.html',
  styleUrls: ['./privacy-policies.component.css']
})
export class PrivacyPoliciesComponent implements OnInit {

  constructor(
    private readonly meta: Meta,
    private readonly title: Title,   
  ) { }

  ngOnInit(): void {
  }

}
