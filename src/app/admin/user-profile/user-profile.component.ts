import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../services/utils.service';
import { AdminOrderDto } from '../../models/order.dto';
import { AdminUser } from '../../services/api/admin-api.service';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRole } from '../../models';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // User data
  user: AdminUser | null = null;
  userId: string | null = null;
  isLoading = false;
  isEditing = false;
  isChangingPassword = false;
  showPassword = false;

  UserRole = UserRole;
  selectedRole: UserRole | null = null;


  // Orders data
  userOrders: AdminOrderDto[] = [];
  filteredOrders: AdminOrderDto[] = [];
  ordersLoading = false;
  currentFilter = 'all';
  selectedOrder: AdminOrderDto | null = null;

  // Form data
  editForm = {
    email: '',
    firstName: '',
    lastName: '',
    roles:UserRole.Customer
  };

  passwordForm = {
    newPassword: '',
    confirmPassword: ''
  };

  private subscriptions = new Subscription();

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private adminApiService: AdminApiService,
    private toastService: ToastService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.userId = params['id'];
        if (this.userId) {
          this.loadUserData();
          this.loadUserOrders();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.user = user;
          if (this.user) {
            this.user.roles = [
              user.roles[0] === 'Administrator'
                ? UserRole.Administrator
                : UserRole.Customer
            ];
          }
          this.editForm = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles[0] === 'Administrator' ? UserRole.Administrator : UserRole.Customer
          };
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load user data');
          this.isLoading = false;
        }
      })
    );
  }

  loadUserOrders(): void {
    if (!this.userId) return;

    this.ordersLoading = true;
    this.subscriptions.add(
      this.adminApiService.getUserOrders(this.userId, {
        pageNumber: 1,
        pageSize: 100
      }).subscribe({
        next: (response) => {
          this.userOrders = response.orders;
          this.filterOrders(this.currentFilter);
          this.ordersLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load user orders');
          this.ordersLoading = false;
        }
      })
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
          roles: this.user.roles[0]
        };
    }
  }

  saveProfile(): void {
    if (!this.user || !this.userId) return;

    const updateData = {
      email: this.editForm.email,
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      roles: this.editForm.roles === UserRole.Customer ? ['Customer'] : ['Administrator']
    };

    this.subscriptions.add(
      this.adminApiService.updateUser(this.userId, updateData).subscribe({
        next: () => {
          this.toastService.success('User profile updated successfully');
          this.isEditing = false;
          this.loadUserData();
        },
        error: () => {
          this.toastService.error('Failed to update user profile');
        }
      })
    );
  }

  startChangingPassword(): void {
    this.isChangingPassword = true;
    this.isEditing = false;
    this.passwordForm = {
      newPassword: '',
      confirmPassword: ''
    };
  }

  togglePassword(): void{
    this.showPassword = !this.showPassword;
  }

  cancelChangingPassword(): void {
    this.isChangingPassword = false;
    this.passwordForm = {
      newPassword: '',
      confirmPassword: ''
    };
  }

  savePassword(): void {
    if (!this.userId) return;

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    const passwordData = {
      newPassword: this.passwordForm.newPassword
    };

    this.subscriptions.add(
      this.adminApiService.updateUserPassword(this.userId, passwordData).subscribe({
        next: () => {
          this.toastService.success('Password updated successfully');
          this.isChangingPassword = false;
          this.passwordForm = {
            newPassword: '',
            confirmPassword: ''
          };
        },
        error: () => {
          this.toastService.error('Failed to update password');
        }
      })
    );
  }

  filterOrders(filter: string): void {
    this.currentFilter = filter;
    if (filter === 'all') {
      this.filteredOrders = [...this.userOrders];
    } else {
      this.filteredOrders = this.userOrders.filter(order => {
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
    this.router.navigate(['/admin/orders', orderId],
      { queryParams: {from: 'user-profile'}}
    );
  }

  toggleUserStatus(user: AdminUser): void {
    const action = user.isBlocked ? 'unblock' : 'block';

    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = `${
      action.charAt(0).toUpperCase() + action.slice(1)
    } User`;
    modalRef.componentInstance.message = `Are you sure you want to ${action} user: ${user.firstName} ${user.lastName}?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result) => {
      if (result === true) {
        this.isLoading = true;

        this.subscriptions.add(
          this.adminApiService
            .toggleUserStatus(user.id.toString(), !user.isBlocked, user.roles)
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
            })
        );
      }
    });
  }

  formatDate(date: string | Date): string {
    return this.utilsService.formatDate(date);
  }

  getTimeAgo(date: string | Date): string {
    return this.utilsService.getTimeAgo(date);
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

  getStatusClass(isBlocked: boolean): string {
    return isBlocked ? 'badge bg-danger' : 'badge bg-success';
  }

  getStatusText(isBlocked: boolean): string {
    return isBlocked ? 'Blocked' : 'Active';
  }

  getIsBlocked(): boolean {
    return this.user?.isBlocked || false;
  }

  getRoleClass(roles: UserRole[] | string[]): string {
    let userRole = '';
    for (let role of roles) {
      switch (role) {
        case UserRole.Administrator:
        case 'Administrator':
          userRole = 'badge bg-danger';
          break;
        case UserRole.Customer:
        case 'Customer':
          userRole = 'badge bg-info';
          break;
        default:
          userRole = 'badge bg-info';
          break;
      }
    }
    return userRole;
  }


  goBack(): void {
    this.router.navigate(['/admin/users']);
  }

  getProcessingCount(): number {
    return this.userOrders.filter(order => 
      order.orderStatusName?.toLowerCase() === 'processing'
    ).length;
  }

  getShippedCount(): number {
    return this.userOrders.filter(order => 
      order.orderStatusName?.toLowerCase() === 'shipped'
    ).length;
  }

  getDeliveredCount(): number {
    return this.userOrders.filter(order => 
      order.orderStatusName?.toLowerCase() === 'delivered'
    ).length;
  }

  getCancelledCount(): number {
    return this.userOrders.filter(order => 
      order.orderStatusName?.toLowerCase() === 'cancelled'
    ).length;
  }
}
