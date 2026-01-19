import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';
import { ProductApiService } from '../services/api';
import { finalize } from 'rxjs';
import { CmsApiService } from '../services/api/cms-api.service';
import { CmsLandingPageDto, ProductDto } from '@dtos';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  newsletterEmail: string = '';

  public featuredProducts: ProductDto[] = [];
  public availableBrands: string[] = [];
  public landingDto?: CmsLandingPageDto | null;

  testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      text: "The quality of these shoes is incredible! I've been wearing them for months and they still look brand new. Highly recommend!",
      avatar: 'assets/avatars/avatar1.jpg',
    },
    {
      name: 'Mike Chen',
      location: 'Los Angeles, CA',
      rating: 5,
      text: 'Fast shipping and excellent customer service. The shoes fit perfectly and are super comfortable for my daily runs.',
      avatar: 'assets/avatars/avatar2.jpg',
    },
    {
      name: 'Emily Rodriguez',
      location: 'Miami, FL',
      rating: 4,
      text: 'Great selection of styles and the return process was so easy. Will definitely shop here again!',
      avatar: 'assets/avatars/avatar3.jpg',
    },
  ];

  public isLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private productApi: ProductApiService,
    private cmsService: CmsApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getFeaturedProducts();
    this.getCmsLandingDto();
  }

  getCmsLandingDto() {
    this.isLoading = true;
    this.cmsService
      .getCmsLandingPage()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          try {
            this.landingDto = response;
          } catch {
            this.toastService.error('Invalid data');
          }
        },
        error: () => {
          this.toastService.error('Error loading landing');
        },
      });
  }

  getFeaturedProducts() {
    this.isLoading = true;
    this.productApi
      .getFeaturedProducts()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          try {
            this.featuredProducts = response.products;
            this.availableBrands = response.brands;
          } catch {
            this.toastService.error('Invalid data');
          }
        },
        error: () => {
          this.toastService.error('Error loading products');
        },
      });
  }

  scrollToCategories() {
    const element = document.getElementById('categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  viewProduct(product: ProductDto) {
    this.router.navigate(['/products/details', product.id]);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  subscribeNewsletter() {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      this.toastService.success('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    } else {
      this.toastService.error('Please enter a valid email address');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
