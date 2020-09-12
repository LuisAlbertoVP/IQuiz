import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth_service/*';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(
    public service: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  navigate = (link: string) => this.router.navigate([link]);

  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}
