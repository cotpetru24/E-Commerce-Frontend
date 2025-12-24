import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import {
  AdminBrandDto,
  AdminProductAudienceDto,
  AdminProductDto,
  AdminProductFeatureDto,
  ProductDto,
} from '../../models';
import { error } from 'console';
import { number } from 'zod';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  productData: AdminProductDto | null = null;
  productId!: number;
  brands: AdminBrandDto[] = [];
  productAudience: AdminProductAudienceDto[] = [];

  discountText = '';
  priceText = '';

  newSpec: AdminProductFeatureDto = {
    id: 0,
    sortOrder: 0,
    featureText: '',
  };

  isLoading = false;
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private adminApiService: AdminApiService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.toastService.error('Invalid product ID');
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.toastService.error('Invalid product ID');
      return;
    }

    this.productId = id;
    this. initialiseData();
    // this.getProductBrands();
    // this.loadProductData();
  }

initialiseData() {
    this.getProductAudience();
    this.getProductBrands();
    this.loadProductData();
}

  getProductBrands() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService.getProductBrands().subscribe({
        next: (response) => {
          this.brands = response;
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
          // this.loadProductData();
        },
      })
    );
  }


  loadProductData() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService.getProductById(this.productId).subscribe({
        next: (response) => {
          this.productData = response;

          this.priceText = this.productData.price?.toFixed(2) ?? '';
          this.discountText =
            this.productData.discountPercentage?.toFixed(2) ?? '';

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching product data:', error);
          this.toastService.error('Failed to load product data.');
          this.isLoading = false;
        },
      })
    );
  }

  onSubmit() {
    this.isLoading = true;

    this.productData!.price = Number(this.priceText);
    this.productData!.discountPercentage = Number(this.discountText);
    this.subscriptions.add(
      this.adminApiService
        .updateProduct(this.productId, this.productData!)
        .subscribe({
          next: (response) => {
            this.toastService.success('Product updated successfully.');
            this.isLoading = false;
            this.loadProductData();
          },
          error: (error) => {
            console.error('Error fetching product data:', error);
            this.toastService.error('Failed to load product data.');
            this.isLoading = false;
          },
        })
    );

    this.loadProductData();
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
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // this.productData.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    // this.productData.images.splice(index, 1);
  }

  deleteProduct() {
    if (
      confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        this.toastService.success('Product deleted successfully!');
        this.router.navigate(['/admin']);
        this.isLoading = false;
      }, 1500);
    }
  }
}
