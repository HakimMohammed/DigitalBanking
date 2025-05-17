import {Component, OnInit} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Checkbox} from 'primeng/checkbox';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    InputText,
    Checkbox,
    ButtonDirective,
    Ripple,
    ReactiveFormsModule,
    Toast
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  formLogin!: FormGroup;


  constructor(private router: Router, private fb: FormBuilder, private service: AuthService, private messageService: MessageService) {
  }

  ngOnInit(): void {
        this.formLogin = this.fb.group({
          username: ['', Validators.required],
          password: ['', Validators.required],
        })
    }

  onSubmit() {
    if (this.formLogin.valid) {
      const username = this.formLogin.value.username;
      const password = this.formLogin.value.password;

      this.service.login(username, password).subscribe({
        next: (data) => {
          this.service.loadProfile(data)
          this.messageService.add({ severity: 'success', summary: 'Login successful' });
          this.router.navigateByUrl("/admin")
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Login failed' });
        }
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Invalid form', detail: 'Please fill in all required fields' });
    }
  }



}
