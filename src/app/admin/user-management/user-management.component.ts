import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUserApiService } from 'app/services/api';
import { Utils } from 'app/shared/utils';
import {
  AdminUserDto,
  AdminUpdateUserProfileRequestDto,
  AdminUsersStatsDto,
  GetAllUsersRequestDto,
} from '@dtos';
import {
  AdminUsersSortByEnum,
  SortDirectionEnum,
  UserRoleEnum,
  UserRoleMeta,
} from '@dtos/enums';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  UserRole = UserRoleEnum;
  UserRoleMeta = UserRoleMeta;
  Math = Math;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalQueryCount = 0;
  searchTerm = '';
  sortBy = 'date-desc';
  isLoading = false;
  isTogglingBlock = false;
  isBlocked: boolean | null = null;
  selectedRole: UserRoleEnum | null = null;
  sortDirection: SortDirectionEnum | null = SortDirectionEnum.Descending;
  users: AdminUserDto[] = [];
  filteredUsers: AdminUserDto[] = [];
  paginatedUsers: AdminUserDto[] = [];

  adminUsersStats: AdminUsersStatsDto = {
    totalUsersCount: 0,
    totalActiveUsersCount: 0,
    totalBlockedUsersCount: 0,
    totalNewUsersCountThisMonth: 0,
  };

  private subscriptions = new Subscription();

  constructor(
    private adminUserApiService: AdminUserApiService,
    private router: Router,
    private toastService: ToastService,
    private modalService: NgbModal,
    public utils: Utils,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUsers(): void {
    this.isLoading = true;

    const [sortByField, sortDir] = this.sortBy.split('-');

    const getAllUsersRequest: GetAllUsersRequestDto = {
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      searchTerm: this.searchTerm,
      isBlocked: this.isBlocked,
      userRole: this.selectedRole,
      sortBy:
        sortByField === 'name'
          ? AdminUsersSortByEnum.Name
          : AdminUsersSortByEnum.DateCreated,
      sortDirection:
        sortDir === 'asc'
          ? SortDirectionEnum.Ascending
          : SortDirectionEnum.Descending,
    };

    this.subscriptions.add(
      this.adminUserApiService
        .getUsers(getAllUsersRequest)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (response) => {
            this.users = response.users;
            this.adminUsersStats = response.adminUsersStats;
            this.totalPages = response.totalPages;
            this.totalQueryCount = response.totalQueryCount;
          },
          error: (error) => {
            console.error('Error loading users:', error);
            this.toastService.error('Failed to load users');
          },
        }),
    );
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  updatePagination(): void {
    if (!this.isLoading) {
      this.loadUsers();
    }
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

  viewUser(user: AdminUserDto): void {
    this.router.navigate(['/admin/users', user.id]);
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
        this.isTogglingBlock = true;

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
            .pipe(finalize(() => (this.isTogglingBlock = false)))
            .subscribe({
              next: () => {
                const status = user.isBlocked ? 'unblocked' : 'blocked';
                this.toastService.success(`User ${status} successfully`);

                this.loadUsers();
              },
              error: (err) => {
                this.toastService.error('Failed to update user status');
              },
            }),
        );
      }
    });
  }

  deleteUser(user: AdminUserDto): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Delete User';
    modalRef.componentInstance.message = `Are you sure you want to delete user: ${user.firstName} ${user.lastName}?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        this.subscriptions.add(
          this.adminUserApiService.deleteUser(user.id.toString()).subscribe({
            next: () => {
              this.toastService.success('User deleted successfully');
              this.loadUsers();
              this.isLoading = false;
            },
            error: () => {
              this.toastService.error('Failed to delete user');
              this.isLoading = false;
            },
          }),
        );
      }
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.isBlocked = null;
    this.selectedRole = null;
    this.sortBy = 'date-desc';
    this.sortDirection = SortDirectionEnum.Descending;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.loadUsers();
  }

  getStatusClass(isBlocked: boolean): string {
    return isBlocked ? 'badge bg-danger' : 'badge bg-success';
  }

  getStatusLabel(isBlocked: boolean): string {
    return isBlocked ? 'Blocked' : 'Active';
  }
}
