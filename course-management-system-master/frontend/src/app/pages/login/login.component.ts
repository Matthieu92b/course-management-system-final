import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h1><app-icon name="dashboard" [size]="20"></app-icon> Course Management</h1>
        <p class="login-subtitle">Sign in to continue</p>

        <form (ngSubmit)="submit()">
          <div>
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required autocomplete="username" placeholder="you@example.com">
          </div>
          <div>
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required autocomplete="current-password">
          </div>
          <button class="btn btn-primary login-submit" type="submit" [disabled]="submitting">
            {{ submitting ? 'Signing in…' : 'Sign in' }}
          </button>
          <p class="error" *ngIf="error">{{ error }}</p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  submitting = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  submit() {
    this.error = '';
    this.submitting = true;
    this.api.login(this.email, this.password).subscribe({
      next: user => {
        this.submitting = false;
        this.auth.setCurrentUser(user);
        this.toast.success(`Welcome, ${user.firstName}!`);
        this.router.navigateByUrl(user.role?.toUpperCase() === 'ADMIN' ? '/dashboard' : '/schedule');
      },
      error: err => {
        this.submitting = false;
        this.error = err.error?.message ?? 'Invalid email or password';
      }
    });
  }
}
