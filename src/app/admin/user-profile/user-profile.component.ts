import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { Utils } from '../../shared/utils';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUserApiService } from 'app/services/api';
import {
  AdminOrderDto,
  AdminUpdateUserProfileRequestDto,
  AdminUserDto,
} from '@dtos';
import {
  OrdersSortByEnum,
  OrderStatusEnum,
  OrderStatusMeta,
  UserRoleEnum,
  UserRoleMeta,
} from '@dtos/enums';

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
  UserRoleEnum = UserRoleEnum;
  UserRoleMeta = UserRoleMeta;
  OrderStatusEnum = OrderStatusEnum;
  OrderStatusMeta = OrderStatusMeta;
  user: AdminUserDto | null = null;
  userId: string | null = null;
  userOrders: AdminOrderDto[] = [];
  filteredOrders: AdminOrderDto[] = [];
  currentFilter: OrderStatusEnum | null = null;

  userRoles: UserRoleEnum[] = [
    UserRoleEnum.Administrator,
    UserRoleEnum.Customer,
  ];

  ordersStatusCounts = {
    processingCount: 0,
    shippedCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
  };

  editForm = {
    email: '',
    firstName: '',
    lastName: '',
    roles: UserRoleEnum.Customer,
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

    this.userOrders = [];
    this.filteredOrders = [];

    this.ordersLoading = true;
    this.subscriptions.add(
      this.adminUserApiService
        .getUserOrders(this.userId, {
          pageNumber: 1,
          pageSize: 100,
          fromDate: null,
          statusFilter: null,
          toDate: null,
        })
        .subscribe({
          next: (response) => {
            this.userOrders = response.orders;
            this.filterOrders(this.currentFilter);
            this.getOrdersStatusCounts();
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

  filterOrders(statusFilter: OrderStatusEnum | null): void {
    this.currentFilter = statusFilter;
    if (statusFilter === null) {
      this.filteredOrders = [...this.userOrders];
    } else {
      this.filteredOrders = this.userOrders.filter(
        (order) => order.status === statusFilter,
      );
    }
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/admin/orders', orderId], {
      queryParams: { from: 'user-profile' },
    });
  }

  toggleUserStatus(user: AdminUserDto): void {
    const action = user.isBlocked === true ? 'unblock' : 'block';

    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = `${
      action.charAt(0).toUpperCase() + action.slice(1)
    } User`;
    modalRef.componentInstance.message = `Are you sure you want to ${action} user: ${user.firstName} ${user.lastName}?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        const updateUserRequest: AdminUpdateUserProfileRequestDto = {
          isBlocked: !user.isBlocked,
          email: null,
          firstName: null,
          lastName: null,
          roles: null,
        };

        this.subscriptions.add(
          this.adminUserApiService
            .toggleUserStatus(user.id.toString(), updateUserRequest)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
              next: () => {
                const status = user.isBlocked ? 'unblocked' : 'blocked';
                this.toastService.success(`User ${status} successfully`);
                this.loadUserData();
              },
              error: (err) => {
                this.toastService.error('Failed to update user status');
              },
            }),
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }

  getOrdersStatusCounts(): void {
    this.ordersStatusCounts = {
      processingCount: 0,
      shippedCount: 0,
      deliveredCount: 0,
      cancelledCount: 0,
    };

    for (const order of this.userOrders) {
      switch (order.status) {
        case OrderStatusEnum.Processing:
          this.ordersStatusCounts.processingCount++;
          break;
        case OrderStatusEnum.Shipped:
          this.ordersStatusCounts.shippedCount++;
          break;
        case OrderStatusEnum.Delivered:
          this.ordersStatusCounts.deliveredCount++;
          break;
        case OrderStatusEnum.Cancelled:
          this.ordersStatusCounts.cancelledCount++;
          break;
      }
    }
  }

  getStatusClass(isBlocked: boolean): string {
    return isBlocked ? 'badge bg-danger' : 'badge bg-success';
  }

  getStatusLabel(isBlocked: boolean): string {
    return isBlocked ? 'Blocked' : 'Active';
  }
}
