import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../services/api/user-api.service';
import { StorageService } from '../../services/storage.service';
import {
  UserProfileDto,
  UpdateUserProfileRequestDto,
  ChangePasswordRequestDto,
  UserStatsDto,
} from '@dtos';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss',
})
export class UserAccountComponent implements OnInit {
  userProfile: UserProfileDto | null = null;
  userStats: UserStatsDto | null = null;
  isLoading = false;
  isEditing = true;
  isChangingPassword = false;

  editForm = {
    email: '',
    firstName: '',
    lastName: '',
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private toastService: ToastService,
    private userApiService: UserApiService,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.isLoading = true;

    const token = this.storageService.getSessionItem('accessToken');
    if (!token) {
      this.toastService.error('Please log in to view your account');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.userApiService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.editForm = {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
        };
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load user profile');
        this.isLoading = false;
      },
    });

    this.userApiService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: () => {},
    });
  }

  startEditing() {
    this.isEditing = true;
    this.isChangingPassword = false;
  }

  cancelEditing() {
    this.isEditing = false;
    if (this.userProfile) {
      this.editForm = {
        email: this.userProfile.email,
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName,
      };
    }
  }

  saveProfile() {
    if (!this.userProfile) return;

    const request: UpdateUserProfileRequestDto = {
      email: this.editForm.email,
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
    };

    this.userApiService.updateUserProfile(request).subscribe({
      next: (response) => {
        this.toastService.success('Profile updated successfully');
        this.isEditing = true;
        this.loadUserData();
      },
      error: () => {
        this.toastService.error('Failed to update profile');
      },
    });
  }

  startChangingPassword() {
    this.isChangingPassword = true;
    this.isEditing = false;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  cancelChangingPassword() {
    this.isChangingPassword = false;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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
      confirmPassword: this.passwordForm.confirmPassword,
    };

    this.userApiService.changePassword(request).subscribe({
      next: (response) => {
        this.toastService.success('Password changed successfully');
        this.isChangingPassword = false;
        this.isEditing = true;
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        };
      },
      error: () => {
        this.toastService.error('Failed to change password');
      },
    });
  }

  viewOrders() {
    this.router.navigate(['/user/orders']);
  }

  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';

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
