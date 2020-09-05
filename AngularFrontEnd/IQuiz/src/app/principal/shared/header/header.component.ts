import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth_service/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  isMenuCollapsed = true;

  constructor(
    public service: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}
