import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../services/api/user-api.service';
import { UserProfileDto, UpdateUserProfileRequestDto, ChangePasswordRequestDto, UserStatsDto } from '../../models/user.dto';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  userProfile: UserProfileDto | null = null;
  userStats: UserStatsDto | null = null;
  isLoading = false;
  isEditing = false;
  isChangingPassword = false;

  // Form data
  editForm = {
    email: '',
    firstName: '',
    lastName: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private toastService: ToastService,
    private userApiService: UserApiService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.isLoading = true;
    
    // Check if user is logged in
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      this.toastService.error('Please log in to view your account');
      this.router.navigate(['/auth/login']);
      return;
    }

    // Load user profile and stats in parallel
    this.userApiService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.editForm = {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.toastService.error('Failed to load user profile');
        this.isLoading = false;
      }
    });

    this.userApiService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
        // Don't show error for stats as it's not critical
      }
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    // Reset form to original values
    if (this.userProfile) {
      this.editForm = {
        email: this.userProfile.email,
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName
      };
    }
  }

  saveProfile() {
    if (!this.userProfile) return;

    const request: UpdateUserProfileRequestDto = {
      email: this.editForm.email,
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName
    };

    this.userApiService.updateUserProfile(request).subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.isEditing = false;
        this.loadUserData(); // Reload to get updated data
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.toastService.error('Failed to update profile');
      }
    });
  }

  startChangingPassword() {
    this.isChangingPassword = true;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  cancelChangingPassword() {
    this.isChangingPassword = false;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  savePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toastService.error('New passwords do not match');
      return;
    }

    const request: ChangePasswordRequestDto = {
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword,
      confirmPassword: this.passwordForm.confirmPassword
    };

    this.userApiService.changePassword(request).subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.isChangingPassword = false;
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.toastService.error('Failed to change password');
      }
    });
  }

  viewOrders() {
    this.router.navigate(['/user/orders']);
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success';
      case 'shipped':
        return 'bg-info';
      case 'processing':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
} 