import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productData = {
    name: '',
    brand: '',
    price: null as number | null,
    stock: null as number | null,
    category: '',
    gender: '',
    description: '',
    specifications: [] as Array<{name: string, value: string}>,
    images: [] as string[],
    isActive: true,
    isFeatured: false
  };

  newSpec = {
    name: '',
    value: ''
  };

  isLoading = false;

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit() {
    if (!this.productData.name || !this.productData.price || 
        !this.productData.stock || !this.productData.category || 
        !this.productData.description) {
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      // Mock product creation logic
      this.toastService.success('Product added successfully!');
      this.router.navigate(['/admin']);
      this.isLoading = false;
    }, 2000);
  }

  addSpecification() {
    if (this.newSpec.name && this.newSpec.value) {
      this.productData.specifications.push({
        name: this.newSpec.name,
        value: this.newSpec.value
      });
      this.newSpec.name = '';
      this.newSpec.value = '';
    }
  }

  removeSpecification(index: number) {
    this.productData.specifications.splice(index, 1);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.productData.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.productData.images.splice(index, 1);
  }

  saveDraft() {
    // Save form data to localStorage or send to API
    localStorage.setItem('productDraft', JSON.stringify(this.productData));
    this.toastService.info('Draft saved successfully!');
  }
}
