import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { Utils } from '../../shared/utils';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUserApiService } from 'app/services/api';
import { AdminOrderDto, AdminUserDto, UserRole } from '@dtos';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  isLoading = false;
  isEditing = false;
  isChangingPassword = false;
  showPassword = false;
  ordersLoading = false;
  UserRole = UserRole;
  user: AdminUserDto | null = null;
  userId: string | null = null;
  userOrders: AdminOrderDto[] = [];
  filteredOrders: AdminOrderDto[] = [];
  currentFilter = 'all';

  editForm = {
    email: '',
    firstName: '',
    lastName: '',
    roles: UserRole.Customer,
  };

  passwordForm = {
    newPassword: '',
    confirmPassword: '',
  };

  private subscriptions = new Subscription();

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private adminUserApiService: AdminUserApiService,
    private toastService: ToastService,
    public utils: Utils,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        this.userId = params['id'];
        if (this.userId) {
          this.loadUserData();
          this.loadUserOrders();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.subscriptions.add(
      this.adminUserApiService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.user = user;
          if (this.user) {
            this.user.roles = this.utils.normaliseUserRoles(this.user.roles);
          }
          this.editForm = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: this.user.roles[0],
          };
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load user data');
          this.isLoading = false;
        },
      }),
    );
  }

  loadUserOrders(): void {
    if (!this.userId) return;

    this.ordersLoading = true;
    this.subscriptions.add(
      this.adminUserApiService
        .getUserOrders(this.userId, {
          pageNumber: 1,
          pageSize: 100,
        })
        .subscribe({
          next: (response) => {
            this.userOrders = response.orders;
            this.filterOrders(this.currentFilter);
            this.ordersLoading = false;
          },
          error: () => {
            this.ordersLoading = false;
            this.toastService.error('Failed to load user orders');
          },
        }),
    );
  }

  startEditing(): void {
    this.isEditing = true;
    this.isChangingPassword = false;
  }

  cancelEditing(): void {
    this.isEditing = false;
    if (this.user) {
      this.editForm = {
        email: this.user.email,
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        roles: this.user.roles[0],
      };
    }
  }

  saveProfile(): void {
    if (!this.user || !this.userId) return;

    const updateData = {
      email: this.editForm.email,
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      roles: this.utils.serializeUserRoles([this.editForm.roles]),
    };

    this.subscriptions.add(
      this.adminUserApiService.updateUser(this.userId, updateData).subscribe({
        next: () => {
          this.toastService.success('User profile updated successfully');
          this.isEditing = false;
          this.loadUserData();
        },
        error: () => {
          this.toastService.error('Failed to update user profile');
        },
      }),
    );
  }

  startChangingPassword(): void {
    this.isChangingPassword = true;
    this.isEditing = false;
    this.passwordForm = {
      newPassword: '',
      confirmPassword: '',
    };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  cancelChangingPassword(): void {
    this.isChangingPassword = false;
    this.passwordForm = {
      newPassword: '',
      confirmPassword: '',
    };
  }

  savePassword(): void {
    if (!this.userId) return;

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    const passwordData = {
      newPassword: this.passwordForm.newPassword,
    };

    this.subscriptions.add(
      this.adminUserApiService
        .updateUserPassword(this.userId, passwordData)
        .subscribe({
          next: () => {
            this.toastService.success('Password updated successfully');
            this.isChangingPassword = false;
            this.passwordForm = {
              newPassword: '',
              confirmPassword: '',
            };
          },
          error: () => {
            this.toastService.error('Failed to update password');
          },
        }),
    );
  }

  filterOrders(filter: string): void {
    this.currentFilter = filter;
    if (filter === 'all') {
      this.filteredOrders = [...this.userOrders];
    } else {
      this.filteredOrders = this.userOrders.filter((order) => {
        const status = order.orderStatusName?.toLowerCase();
        switch (filter) {
          case 'delivered':
            return status === 'delivered';
          case 'shipped':
            return status === 'shipped';
          case 'processing':
            return status === 'processing';
          case 'cancelled':
            return status === 'cancelled';
          default:
            return true;
        }
      });
    }
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/admin/orders', orderId], {
      queryParams: { from: 'user-profile' },
    });
  }

  toggleUserStatus(user: AdminUserDto): void {
    const action = user.isBlocked ? 'unblock' : 'block';

    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = `${
      action.charAt(0).toUpperCase() + action.slice(1)
    } User`;
    modalRef.componentInstance.message = `Are you sure you want to ${action} user: ${user.firstName} ${user.lastName}?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        this.subscriptions.add(
          this.adminUserApiService
            .toggleUserStatus(user.id.toString(), {
              isBlocked: !user.isBlocked,
            })
            .subscribe({
              next: () => {
                const status = user.isBlocked ? 'unblocked' : 'blocked';
                this.toastService.success(`User ${status} successfully`);

                this.loadUserData();
                this.isLoading = false;
              },
              error: (err) => {
                this.toastService.error('Failed to update user status');
              },
            }),
        );
      }
    });
  }

  getStatusBadgeClass(status?: string): string {
    if (!status) {
      return 'badge bg-secondary';
    }
    switch (status) {
      case 'Pending':
      case 'pending':
        return 'badge bg-warning';
      case 'Processing':
      case 'processing':
        return 'badge bg-info';
      case 'Shipped':
      case 'shipped':
        return 'badge bg-primary';
      case 'Delivered':
      case 'delivered':
        return 'badge bg-success';
      case 'Cancelled':
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusClass(): string {
    return this.user?.isBlocked === true
      ? 'badge bg-danger'
      : 'badge bg-success';
  }

  getStatusText(): string {
    return this.user?.isBlocked === true ? 'Blocked' : 'Active';
  }

  getIsBlocked(): boolean {
    return this.user?.isBlocked || false;
  }

  getRoleClass(): string {
    let userRole = '';
    for (let role of this.user?.roles || []) {
      switch (role) {
        case UserRole.Administrator:
          userRole = 'badge bg-danger';
          break;
        case UserRole.Customer:
          userRole = 'badge bg-info';
          break;
        default:
          userRole = 'badge bg-info';
          break;
      }
    }
    return userRole;
  }

  getRoleText(): string {
    let roleText = '';
    for (let role of this.user?.roles || []) {
      switch (role) {
        case UserRole.Administrator:
          roleText = 'Administrator';
          break;
        case UserRole.Customer:
          roleText = 'Customer';
          break;
        default:
          roleText = 'Customer';
          break;
      }
    }
    return roleText;
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }

  getProcessingCount(): number {
    return this.userOrders.filter(
      (order) => order.orderStatusName?.toLowerCase() === 'processing',
    ).length;
  }

  getShippedCount(): number {
    return this.userOrders.filter(
      (order) => order.orderStatusName?.toLowerCase() === 'shipped',
    ).length;
  }

  getDeliveredCount(): number {
    return this.userOrders.filter(
      (order) => order.orderStatusName?.toLowerCase() === 'delivered',
    ).length;
  }

  getCancelledCount(): number {
    return this.userOrders.filter(
      (order) => order.orderStatusName?.toLowerCase() === 'cancelled',
    ).length;
  }
}
