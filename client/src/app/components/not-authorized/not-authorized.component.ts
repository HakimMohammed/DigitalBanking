import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  imports: [Button, RouterModule],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.css',
  standalone: true,
})
export class NotAuthorizedComponent {

}
