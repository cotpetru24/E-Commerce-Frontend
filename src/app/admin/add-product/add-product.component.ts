import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import {
  AdminBrandDto,
  AdminProductAudienceDto,
  AdminProductDto,
  AdminProductFeatureDto,
} from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  productData: AdminProductDto = this.createEmptyProduct();

  discountText = '';
  priceText = '';

  brands: AdminBrandDto[] = [];
  productAudience: AdminProductAudienceDto[] = [];

  newSpec: AdminProductFeatureDto = {
    id: 0,
    sortOrder: 0,
    featureText: '',
  };

  isLoading = false;
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private adminApiService: AdminApiService
  ) {}

  ngOnInit(): void {
    this.getProductBrands();
    this.getProductAudience();
  }

  getProductBrands() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService.getProductBrands().subscribe({
        next: (response) => {
          this.brands = response;
          this.isLoading = false;
          // this.loadProductData();
        },
      })
    );
  }

  getProductAudience() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService.getProductAudience().subscribe({
        next: (response) => {
          this.productAudience = response;
          this.isLoading = false;
          // this.loadProductData();
        },
      })
    );
  }

  onSubmit() {
    if (
      !this.productData.name ||
      !this.productData.price ||
      !this.productData.stock ||
      !this.productData.audienceId ||
      !this.productData.brandId ||
      !this.productData.description ||
      this.productData.productFeatures?.length === 0
    ) {
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;

    this.productData.price = Number(this.priceText);
    this.productData.discountPercentage = Number(this.discountText);
    
    this.subscriptions.add(
      this.adminApiService.createProduct(this.productData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.success('Product added successfully!');
          this.router.navigate(['/admin/product-management']);
        },
          error: (error) => {
            console.error('Error fetching product data:', error);
            this.toastService.error('Failed to load product data.');
            this.isLoading = false;
          },
        })
    );
  }

  addSpecification() {
    if (this.newSpec.sortOrder && this.newSpec.featureText) {
      this.productData?.productFeatures?.push({
        id: 0,
        featureText: this.newSpec.featureText,
        sortOrder: this.newSpec.sortOrder,
      });
      this.newSpec.sortOrder = 0;
      this.newSpec.featureText = '';
    }
  }

  allowDecimalOnly(event: KeyboardEvent) {
    const allowed = /[0-9.]/;
    if (!allowed.test(event.key)) {
      event.preventDefault();
    }

    if (
      event.key === '.' &&
      (event.target as HTMLInputElement).value.includes('.')
    ) {
      event.preventDefault();
    }
  }

  normalizeDiscount() {
    const value = Number(this.discountText);
    if (!isNaN(value)) {
      this.discountText = value.toFixed(2);
      this.productData!.discountPercentage = value;
    } else {
      this.discountText = '';
    }
  }

  normalizePrice() {
    const value = Number(this.priceText);
    if (!isNaN(value)) {
      this.priceText = value.toFixed(2);
      this.productData!.price = value;
    } else {
      this.priceText = '';
    }
  }

  removeSpecification(index: number) {
    this.productData?.productFeatures?.splice(index, 1);
  }

  onFileSelected(event: any) {
    // const files = event.target.files;
    // if (files) {
    //   for (let i = 0; i < files.length; i++) {
    //     const file = files[i];
    //     const reader = new FileReader();
    //     reader.onload = (e: any) => {
    //       this.productData.images.push(e.target.result);
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // }
  }

  removeImage(index: number) {
    // this.productData.images.splice(index, 1);
  }

  saveDraft() {
    // Save form data to localStorage or send to API
    localStorage.setItem('productDraft', JSON.stringify(this.productData));
    this.toastService.info('Draft saved successfully!');
  }

  private createEmptyProduct(): AdminProductDto {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
      originalPrice: undefined,
      imagePath: '',
      stock: 0,
      audienceId: 0,
      brandName: '',
      brandId: 0,
      rating: undefined,
      reviewCount: undefined,
      sizes: [],
      productFeatures: [],
      isNew: false,
      discountPercentage: 0,
      selected: false,
      isActive: true,
    };
  }
}
