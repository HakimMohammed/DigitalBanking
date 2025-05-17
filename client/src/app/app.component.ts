import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit {

  constructor(private authService:  AuthService) {
  }

  ngOnInit(): void {
      this.authService.loadTokenFromStorage();
  }
  title = 'Digital Banking App';


}
