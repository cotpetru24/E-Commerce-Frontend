import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false,
  };

  isLoading = false;
  isGoogleLoading = false;
  isGitHubLoading = false;
  isFacebookLoading = false;
  showPassword = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authApiService: AuthApiService
  ) {}

  onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;

    this.authApiService
      .login({
        email: this.loginData.email,
        password: this.loginData.password,
      })
      .subscribe({
        next: (user) => {
          if (this.authApiService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['']);
          }
        },
        error: () => {
          this.toastService.error(
            'Invalid email or password. Please try again.'
          );
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
