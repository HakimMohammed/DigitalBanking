import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';
import {MenubarModule} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {RouterLink, RouterLinkActive} from '@angular/router';

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
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        url: '/',
      },
      {
        label: "Customers",
        icon: 'pi pi-users',
        url: '/customers',
      },
      {
        label: "Accounts",
        icon: 'pi pi-user',
        url: '/accounts',
      },
    ];
  }
}
