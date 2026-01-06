import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: false,
  };

  isLoading = false;
  isGoogleLoading = false;
  isGitHubLoading = false;
  isFacebookLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authApiService: AuthApiService
  ) {}

  onSubmit() {
    if (
      !this.registerData.firstName ||
      !this.registerData.lastName ||
      !this.registerData.email ||
      !this.registerData.password ||
      !this.registerData.confirmPassword ||
      !this.registerData.acceptTerms
    ) {
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.toastService.error('Passwords do not match.');
      return;
    }

    if (this.registerData.password.length < 8) {
      this.toastService.error('Password must be at least 8 characters long.');
      return;
    }

    this.isLoading = true;

    this.authApiService.register(this.registerData).subscribe({
      next: (user) => {
        this.toastService.success('Registered successful!');
        if (this.authApiService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: () => {
        this.toastService.error('Failed to regiter.');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
