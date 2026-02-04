import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { BarcodeScannerModalComponent } from '../barcode-scanner-modal/barcode-scanner-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from '../../shared/utils';
import { AdminProductApiService } from 'app/services/api';
import {
  AdminProductDto,
  GetProductsAdminRequestDto,
  GetProductsAdminResponseDto,
  ProductImageDto,
} from '@dtos';
import {
  AdminProductsSortByEnum,
  AdminProductStockStatusEnum,
  AdminProductStockStatusMeta,
  AudienceEnum,
  AudienceMeta,
  ProductStatusEmun,
  SortDirectionEnum,
} from '@dtos/enums';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  isLoading = false;
  Math = Math;
  AudienceEnum = AudienceEnum;
  AudienceMeta = AudienceMeta;
  AdminProductStockStatusMeta = AdminProductStockStatusMeta;
  response?: GetProductsAdminResponseDto;
  searchTerm = '';
  selectedCategory: AudienceEnum | null = null;
  selectedBrand: string | null = null;
  isActive: boolean | null = null;
  selectedStock: AdminProductStockStatusEnum | null = null;
  sortBy = 'date-desc';
  sortField: AdminProductsSortByEnum = AdminProductsSortByEnum.DateCreated;
  currentPage = 1;
  itemsPerPage = 10;

  audienceOptions: AudienceEnum[] = [
    AudienceEnum.Men,
    AudienceEnum.Women,
    AudienceEnum.Children,
    AudienceEnum.Unisex,
  ];

  productStatus: ProductStatusEmun[] = [
    ProductStatusEmun.Active,
    ProductStatusEmun.Inactive,
  ];

  productStockStatus: AdminProductStockStatusEnum[] = [
    AdminProductStockStatusEnum.LowStock,
    AdminProductStockStatusEnum.HighStock,
    AdminProductStockStatusEnum.InStock,
    AdminProductStockStatusEnum.OutOfStock,
  ];

  private subscriptions = new Subscription();

  constructor(
    private adminProductApi: AdminProductApiService,
    private router: Router,
    private toastService: ToastService,
    private modalService: NgbModal,
    private utils: Utils,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProducts(): void {
    this.isLoading = true;

    const [sortByField, sortDir] = this.sortBy.split('-');

    switch (sortByField) {
      case 'name':
        this.sortField = AdminProductsSortByEnum.Name;
        break;
      case 'stock':
        this.sortField = AdminProductsSortByEnum.Stock;
        break;
      case 'date':
      default:
        this.sortField = AdminProductsSortByEnum.DateCreated;
        break;
    }

    const getProductsAdminRequest: GetProductsAdminRequestDto = {
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      searchTerm: this.searchTerm,
      isActive: this.isActive,
      productCategory: this.selectedCategory,
      productBrand: this.selectedBrand,
      productStockStatus: this.selectedStock,
      sortDirection:
        sortDir === 'asc'
          ? SortDirectionEnum.Ascending
          : SortDirectionEnum.Descending,
      sortBy: this.sortField,
    };

    this.subscriptions.add(
      this.adminProductApi.getProducts(getProductsAdminRequest).subscribe({
        next: (response) => {
          this.response = response;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.toastService.error('Failed to load products');
        },
      }),
    );
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  updatePagination(): void {
    if (!this.isLoading) {
      this.loadProducts();
      this.utils.scrollToTop();
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= (this.response?.totalPages ?? 1)) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(
      1,
      (this.response?.pageNumber ?? 0) - Math.floor(maxVisible / 2),
    );
    let end = Math.min(this.response?.totalPages ?? 0, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStockStatus(stock: number): AdminProductStockStatusEnum {
    if (stock <= 0) {
      return AdminProductStockStatusEnum.OutOfStock;
    }
    if (stock < 10) {
      return AdminProductStockStatusEnum.LowStock;
    }
    if (stock > 50) {
      return AdminProductStockStatusEnum.HighStock;
    }
    return AdminProductStockStatusEnum.InStock;
  }

  editProduct(product: AdminProductDto): void {
    this.router.navigate(['/admin/edit-product', product.id]);
  }

  viewProduct(product: AdminProductDto): void {
    this.router.navigate(['/products/details', product.id], {
      queryParams: { from: 'product-management' },
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.selectedBrand = null;
    this.isActive = null;
    this.selectedStock = null;
    this.sortBy = 'date-desc';

    this.loadProducts();
  }

  deleteProduct(product: AdminProductDto): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Delete Product';
    modalRef.componentInstance.message = `Are you sure you want to delete "${product.name}"?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        this.subscriptions.add(
          this.adminProductApi.deleteProduct(product.id).subscribe({
            next: () => {
              this.toastService.success('Product deleted successfully');
              this.isLoading = false;
              this.loadProducts();
            },
            error: () => {
              this.isLoading = false;
              this.toastService.error('Failed to delete product');
            },
          }),
        );
      }
    });
  }

  openBarcodeScannerForSearch() {
    const modalRef = this.modalService.open(BarcodeScannerModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.result.then(
      (barcode: string) => {
        if (barcode) {
          this.searchTerm = barcode;
          this.currentPage = 1;
          this.loadProducts();
          this.toastService.success(`Searching for barcode: ${barcode}`);
        }
      },
      () => {
        // Dismissed modal
      },
    );
  }

  getPrimaryImage(images: ProductImageDto[]): string {
    let primaryImage = images?.find((img) => img.isPrimary);
    return primaryImage
      ? primaryImage.imagePath
      : 'products/image-coming-soon.png';
  }
}
