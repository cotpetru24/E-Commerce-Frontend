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
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  isLoading = false;
  isGoogleLoading = false;
  isGitHubLoading = false;
  isFacebookLoading = false;
  showPassword = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authApiService: AuthApiService,
  ) {}

onSubmit() {
  if (!this.loginData.email || !this.loginData.password) {
    this.toastService.error('Please fill in all required fields.');
    return;
  }

  this.isLoading = true;

this.authApiService.login({
  email: this.loginData.email,
  password: this.loginData.password
})
.subscribe({
  next: (user) => {
    this.toastService.success('Login successful!');
    if (this.authApiService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/products']);
    }
  },
  error: () => {
    this.toastService.error('Invalid email or password. Please try again.');
  },
  complete: () => {
    this.isLoading = false;
  }
});

}


  signInWithGoogle() {
    this.isGoogleLoading = true;
    
    // this.authApiService.signInWithGoogle()
    //   .then((user) => {
    //     this.toastService.success(`Successfully signed in with Google!`);
    //     this.router.navigate(['/products']);
    //   })
    //   .catch((error) => {
    //     this.toastService.error('Google sign-in failed. Please try again.');
    //   })
    //   .finally(() => {
    //     this.isGoogleLoading = false;
    //   });
  }

  signInWithGitHub() {
    this.isGitHubLoading = true;
    
    // this.authService.signInWithGitHub()
    //   .then((user) => {
    //     this.toastService.success(`Successfully signed in with GitHub!`);
    //     this.router.navigate(['/products']);
    //   })
    //   .catch((error) => {
    //     this.toastService.error('GitHub sign-in failed. Please try again.');
    //   })
    //   .finally(() => {
    //     this.isGitHubLoading = false;
    //   });
  }

  signInWithFacebook() {
    this.isFacebookLoading = true;
    
    // this.authService.signInWithFacebook()
    //   .then((user) => {
    //     this.toastService.success(`Successfully signed in with Facebook!`);
    //     this.router.navigate(['/products']);
    //   })
    //   .catch((error) => {
    //     this.toastService.error('Facebook sign-in failed. Please try again.');
    //   })
    //   .finally(() => {
    //     this.isFacebookLoading = false;
    //   });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
