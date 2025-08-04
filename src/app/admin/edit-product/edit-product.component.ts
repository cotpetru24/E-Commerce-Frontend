import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productData: any = null;
  productId: string = '';

  newSpec = {
    name: '',
    value: ''
  };

  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.params['id'];
    this.loadProductData();
  }

  loadProductData() {
    // Simulate loading product data from API
    setTimeout(() => {
      this.productData = {
        id: this.productId,
        name: 'Sample Running Shoe',
        brand: 'Nike',
        price: 129.99,
        stock: 50,
        category: 'running',
        gender: 'unisex',
        description: 'High-performance running shoe with advanced cushioning technology.',
        specifications: [
          { name: 'Material', value: 'Mesh and synthetic' },
          { name: 'Sole', value: 'Rubber outsole' },
          { name: 'Weight', value: '280g' }
        ],
        images: [
          'assets/products/running-shoe.png'
        ],
        isActive: true,
        isFeatured: false,
        views: 1250,
        sales: 45
      };
    }, 1000);
  }

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
      // Mock product update logic
      this.toastService.success('Product updated successfully!');
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

  deleteProduct() {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
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
