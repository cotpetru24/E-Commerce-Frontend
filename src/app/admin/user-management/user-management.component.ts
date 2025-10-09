import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../services/api/admin-api.service';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';

interface UserStats {
  total: number;
  active: number;
  blocked: number;
  newThisMonth: number;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  // Users data
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  isLoading = false;

  // Search and filters
  searchTerm = '';
  selectedStatus = '';
  selectedRole = '';
  sortBy = 'date-desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Statistics
  userStats: UserStats = {
    total: 0,
    active: 0,
    blocked: 0,
    newThisMonth: 0
  };

  // Math utility for template
  Math = Math;

  private subscriptions = new Subscription();

  constructor(
    private adminApi: AdminApiService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUsers(): void {
    this.isLoading = true;
    
    this.subscriptions.add(
      this.adminApi.getAllUsers().subscribe({
        next: (response) => {
          this.users = response.users;
          this.applyFilters();
          this.calculateStats();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
          this.toastService.error('Failed to load users');
        }
      })
    );
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || 
        this.getStatusText(user.isBlocked) === this.selectedStatus;
      
      const matchesRole = !this.selectedRole || 
        user.role === this.selectedRole;
      
      return matchesSearch && matchesStatus && matchesRole;
    });

    this.sortUsers();
    this.updatePagination();
  }

  sortUsers(): void {
    this.filteredUsers.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'name-desc':
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        default:
          return 0;
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  calculateStats(): void {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    this.userStats = {
      total: this.users.length,
      active: this.users.filter(u => !u.isBlocked).length,
      blocked: this.users.filter(u => u.isBlocked).length,
      newThisMonth: this.users.filter(u => new Date(u.createdAt) >= startOfMonth).length
    };
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin': return 'badge bg-danger';
      case 'moderator': return 'badge bg-warning';
      case 'customer': return 'badge bg-primary';
      default: return 'badge bg-secondary';
    }
  }

  getStatusClass(isBlocked: boolean): string {
    return isBlocked ? 'badge bg-danger' : 'badge bg-success';
  }

  getStatusText(isBlocked: boolean): string {
    return isBlocked ? 'Blocked' : 'Active';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  getTimeAgo(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  viewUser(user: User): void {
    // Navigate to user detail view
    this.router.navigate(['/admin/users', user.id]);
  }

  editUser(user: User): void {
    // Navigate to user edit form
    this.router.navigate(['/admin/edit-user', user.id]);
  }

  toggleUserStatus(user: User): void {
    const action = user.isBlocked ? 'unblock' : 'block';
    const message = user.isBlocked ? 
      `Unblock user ${user.firstName} ${user.lastName}?` : 
      `Block user ${user.firstName} ${user.lastName}?`;

    if (confirm(message)) {
      this.subscriptions.add(
        this.adminApi.toggleUserStatus(user.id.toString(), !user.isBlocked).subscribe({
          next: () => {
            const status = user.isBlocked ? 'unblocked' : 'blocked';
            this.toastService.success(`User ${status} successfully`);
            this.loadUsers();
          },
          error: (error: any) => {
            console.error('Error toggling user status:', error);
            this.toastService.error('Failed to update user status');
          }
        })
      );
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
      this.subscriptions.add(
        this.adminApi.deleteUser(user.id.toString()).subscribe({
          next: () => {
            this.toastService.success('User deleted successfully');
            this.loadUsers();
          },
          error: (error: any) => {
            console.error('Error deleting user:', error);
            this.toastService.error('Failed to delete user');
          }
        })
      );
    }
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  exportUsers(): void {
    // Implement export functionality
    this.toastService.info('Export functionality coming soon!');
  }
} 