import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  userProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    avatar: null,
    joinDate: new Date('2023-01-15'),
    lastPasswordChange: new Date('2023-06-20'),
    twoFactorEnabled: false
  };

  accountStats = {
    totalOrders: 12,
    completedOrders: 8,
    pendingOrders: 2,
    wishlistItems: 5
  };

  recentOrders = [
    {
      orderId: 'ORD-2024-001',
      orderDate: new Date('2024-01-15'),
      status: 'Delivered',
      total: 129.99
    },
    {
      orderId: 'ORD-2024-002',
      orderDate: new Date('2024-01-10'),
      status: 'Processing',
      total: 89.50
    },
    {
      orderId: 'ORD-2024-003',
      orderDate: new Date('2024-01-05'),
      status: 'Shipped',
      total: 199.99
    }
  ];

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Simulate loading user data from API
    // In real app, this would fetch from user service
  }

  editProfile() {
    this.router.navigate(['/account/edit-profile']);
  }

  editProfilePicture() {
    // Implement profile picture upload functionality
    this.toastService.info('Profile picture upload functionality coming soon!');
  }

  changePassword() {
    this.router.navigate(['/account/change-password']);
  }

  toggleTwoFactor() {
    this.userProfile.twoFactorEnabled = !this.userProfile.twoFactorEnabled;
    this.toastService.success(
      `Two-factor authentication ${this.userProfile.twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`
    );
  }

  viewOrder(orderId: string) {
    this.router.navigate(['/account/orders', orderId]);
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      // Implement logout logic
      this.toastService.success('Logged out successfully!');
      this.router.navigate(['/login']);
    }
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