import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';
import {MenubarModule} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    Ripple,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  items: MenuItem[] = [];

  username: string = "";

  handleLogout() {
    this.authService.logout();
  }



  ngOnInit() {
    this.username = this.authService.username || "";

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        url: '/admin',
      },
      {
        label: "Customers",
        icon: 'pi pi-users',
        url: '/admin/customers',
      },
      {
        label: "Accounts",
        icon: 'pi pi-user',
        url: '/admin/accounts',
      },
    ];
  }
}
