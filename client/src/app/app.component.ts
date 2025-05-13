import { Component } from '@angular/core';
import {NavbarComponent} from './components/navbar/navbar.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import {RouterOutlet} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Digital Banking App';
}
