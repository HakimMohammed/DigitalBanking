import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {API_URL} from '../../../../environement/environment';
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  roles: any;
  username: string | undefined;
  accessToken!: string;

  constructor(private http: HttpClient, private router: Router) { }

  public login(username: string, password: string) {
    let params = new HttpParams();
    params = params.append('username', username);
    params = params.append('password', password);

    let options = {
      headers : new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }
    return this.http.post(API_URL + 'auth/login', params, options);
  }

  public loadProfile(data: any) {
    this.accessToken = data['access-token'];
    this.isAuthenticated = true;

    let decodeJWt: any = jwtDecode(this.accessToken);
    this.username = decodeJWt.sub;
    this.roles = decodeJWt.scope;
    window.localStorage.setItem('jwt-token', this.accessToken);
  }

  public logout() {
    this.username = "";
    this.isAuthenticated = false;
    this.roles = [];
    this.accessToken = "";
    window.localStorage.removeItem('jwt-token');

    this.router.navigate(["/login"])
  }

  public isAdmin() {
    return this.roles.includes('ADMIN');
  }

  loadTokenFromStorage() {
    const token : string | null = window.localStorage.getItem('jwt-token');

    if (token) {
      this.loadProfile({"access-token": token});
      this.router.navigate(['/admin'])
    }

  }
}
