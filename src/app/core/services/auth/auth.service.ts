import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServerService } from '../server/server.service';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthStatus, IUser } from '../../interfaces/auth.interface';
import { WebSocketService } from '../ws/web-socket.service';
import { NotificationService } from '../notification/notification.service';
import { map, filter, scan } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api: string = 'api/v1/auth';
  authenticated: boolean = false;
  authStatusSubject: BehaviorSubject<AuthStatus>;
  token: string = '';
  user: IUser | null;
  private _error: string;
  constructor(
    private service: ServerService,
    private wsService: WebSocketService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem(this.token)) as IUser;
    this.authenticated = Boolean(this.token && this.user);
    if (this.authenticated) {
      this.wsService.connect();
      this.notificationService.pullNotifications();
    }
    this.authStatusSubject = new BehaviorSubject({
      loggedIn: this.authenticated,
      id: this.user?._id ?? '',
    } as AuthStatus);
    this.router.events
    .pipe(filter(event => event instanceof NavigationStart))
    .subscribe(() => { 
      this._error = ''
    });
  }

  async register(form: FormGroup) {
    return await this.resolveSubmission(form, 'register');
  }

  async login(form: FormGroup) {
    return await this.resolveSubmission(form, 'login');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(this.token);
    this.token = '';
    this.user = null;
    this.authenticated = false;
    this.wsService.closeConnection();
    this.authStatusSubject.next({ loggedIn: this.authenticated });
  }

  async resolveSubmission(form: FormGroup, action: string) {
    let formData: FormData;
    if (action == 'register') {
      formData = new FormData();
      Object.keys(form.value).forEach((key) => {
        if (form.value[key]) {
          formData.append(key, form.value[key]);
        }
      });
    } else {
      formData = form.value;
    }
    const res = await this.service.post(`${this.api}/${action}`, formData);
    if (res && res.success) {
      this.authenticated = true;
      this.token = res.data;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem(res.data.token, JSON.stringify(res.data.user));
      this.wsService.connect();
      this.authStatusSubject.next({
        loggedIn: this.authenticated,
        id: res.data.user._id,
      });
    }
    if (res && !res.success && res.error) { 
      console.log(res)
      this._error = res.error };
    return res;
  }

  get error() {
    return this._error;
  }

  clearError() {
    this._error = '';
  }
}
