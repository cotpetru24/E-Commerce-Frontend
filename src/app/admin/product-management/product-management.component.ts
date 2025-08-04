import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductDto } from '../../models/product.dto';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  // Products data
  products: ProductDto[] = [];
  filteredProducts: ProductDto[] = [];
  paginatedProducts: ProductDto[] = [];
  isLoading = false;

  // Search and filters
  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
  selectedStatus = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  selectAll = false;

  // Math utility for template
  Math = Math;

  private subscriptions = new Subscription();

  constructor(
    private adminApi: AdminApiService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProducts(): void {
    this.isLoading = true;
    
    this.subscriptions.add(
      this.adminApi.getAllProducts().subscribe({
        next: (products) => {
          this.products = products;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
          this.toastService.error('Failed to load products');
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

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.brandName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.audience.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        product.audience === this.selectedCategory;
      
      const matchesBrand = !this.selectedBrand || 
        product.brandName === this.selectedBrand;
      
      const matchesStatus = !this.selectedStatus || 
        this.getStatusText(product.stock) === this.selectedStatus;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
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

  toggleSelectAll(): void {
    this.paginatedProducts.forEach(product => {
      product.selected = this.selectAll;
    });
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'text-danger fw-bold';
    if (stock < 10) return 'text-warning fw-bold';
    return 'text-success';
  }

  getStatusClass(stock: number): string {
    if (stock === 0) return 'badge bg-danger';
    if (stock < 10) return 'badge bg-warning';
    return 'badge bg-success';
  }

  getStatusText(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'Active';
  }

  editProduct(product: ProductDto): void {
    this.router.navigate(['/admin/edit-product', product.id]);
  }

  viewProduct(product: ProductDto): void {
    // Navigate to product detail view
    this.router.navigate(['/products', product.id]);
  }

  deleteProduct(product: ProductDto): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.subscriptions.add(
        this.adminApi.deleteProduct(product.id).subscribe({
          next: () => {
            this.toastService.success('Product deleted successfully');
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.toastService.error('Failed to delete product');
          }
        })
      );
    }
  }

  bulkDelete(): void {
    const selectedProducts = this.paginatedProducts.filter(p => p.selected);
    if (selectedProducts.length === 0) {
      this.toastService.warning('Please select products to delete');
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
      // Implement bulk delete logic
      this.toastService.info('Bulk delete functionality coming soon!');
    }
  }

  exportProducts(): void {
    // Implement export functionality
    this.toastService.info('Export functionality coming soon!');
  }
}
