import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  template: `
    <div class="container-fluid">
      <app-header></app-header>
      <router-outlet></router-outlet>
    </div>
  `
})
export class PrincipalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
