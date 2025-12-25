import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductDto } from '../models/product.dto';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';
import { Audience } from '../models/audience.enum';
import { ProductApiService } from '../services/api';
import { finalize } from 'rxjs';

// ============================================================================
// HTTP REQUEST EXAMPLES - ANGULAR HTTP CLIENT
// ============================================================================

// Import statements needed for HTTP requests:
// import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError, catchError, retry, tap, map, switchMap, of } from 'rxjs';

// Example API service class (would typically be in a separate file):
/*
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Base URL for your API
  private apiUrl = 'https://your-api.com/api';
  
  // Inject HttpClient in constructor
  constructor(private http: HttpClient) {}
  
  // ============================================================================
  // BASIC HTTP METHODS
  // ============================================================================
  
  // GET request - fetch data from server
  getProducts(): Observable<ProductDto[]> {
    // GET /api/products
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products`);
  }
  
  // GET request with query parameters
  getProductsByCategory(category: string): Observable<ProductDto[]> {
    // GET /api/products?category=men
    const params = new HttpParams().set('category', category);
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products`, { params });
  }
  
  // GET request with headers (e.g., for authentication)
  getProductsWithAuth(): Observable<ProductDto[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer your-token-here',
      'Content-Type': 'application/json'
    });
    
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products`, { headers });
  }
  
  // POST request - create new data
  createProduct(product: ProductDto): Observable<ProductDto> {
    // POST /api/products
    return this.http.post<ProductDto>(`${this.apiUrl}/products`, product);
  }
  
  // PUT request - update existing data
  updateProduct(id: number, product: ProductDto): Observable<ProductDto> {
    // PUT /api/products/1
    return this.http.put<ProductDto>(`${this.apiUrl}/products/${id}`, product);
  }
  
  // PATCH request - partial update
  updateProductPrice(id: number, price: number): Observable<ProductDto> {
    // PATCH /api/products/1
    return this.http.patch<ProductDto>(`${this.apiUrl}/products/${id}`, { price });
  }
  
  // DELETE request - remove data
  deleteProduct(id: number): Observable<void> {
    // DELETE /api/products/1
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
  
  // ============================================================================
  // ERROR HANDLING EXAMPLES
  // ============================================================================
  
  // GET with error handling
  getProductsWithErrorHandling(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products`).pipe(
      // Retry failed requests up to 3 times
      retry(3),
      // Handle errors
      catchError(this.handleError)
    );
  }
  
  // Custom error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error (network, etc.)
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  // ============================================================================
  // RXJS OPERATORS EXAMPLES
  // ============================================================================
  
  // Using map to transform data
  getProductNames(): Observable<string[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.map(product => product.name))
    );
  }
  
  // Using tap for side effects (logging, etc.)
  getProductsWithLogging(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products`).pipe(
      tap(products => console.log(`Fetched ${products.length} products`)),
      tap(products => {
        // You could also dispatch actions, update other services, etc.
        // this.store.dispatch(loadProductsSuccess({ products }));
      })
    );
  }
  
  // Using switchMap for dependent requests
  getProductWithDetails(id: number): Observable<any> {
    return this.http.get<ProductDto>(`${this.apiUrl}/products/${id}`).pipe(
      switchMap(product => {
        // After getting product, fetch its reviews
        return this.http.get<any[]>(`${this.apiUrl}/products/${id}/reviews`).pipe(
          map(reviews => ({ product, reviews }))
        );
      })
    );
  }
  
  // ============================================================================
  // ADVANCED PATTERNS
  // ============================================================================
  
  // Caching with shareReplay
  private productsCache$ = this.http.get<ProductDto[]>(`${this.apiUrl}/products`).pipe(
    shareReplay(1) // Cache the result and share with multiple subscribers
  );
  
  getProductsCached(): Observable<ProductDto[]> {
    return this.productsCache$;
  }
  
  // Request with timeout
  getProductsWithTimeout(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products`).pipe(
      timeout(5000), // 5 second timeout
      catchError(error => {
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Request timed out'));
        }
        return throwError(() => error);
      })
    );
  }
}
*/

// ============================================================================
// HOW TO USE HTTP IN COMPONENTS
// ============================================================================

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  newsletterEmail: string = '';

  // ============================================================================
  // FEATURED PRODUCTS DATA
  // ============================================================================
  public featuredProducts: ProductDto[] = [];
  public availableBrands: string[] = [];


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
    private router: Router
  ) {}

  ngOnInit()  {

this.getFeaturedProducts();

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
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('Product data is invalid');
          }
        },
        error: (err) => {
          console.error('Failed to load products:', err);
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

  // ============================================================================
  // Once the Product details section is implemented, redirect to the product details page
  // ============================================================================
  viewProduct(product: ProductDto) {
        this.router.navigate(['/products/details', product.id]);

  }

  addToCart(product: ProductDto) {
    this.cartService.addToCart(product, 1);
    this.toastService.success(`${product.name} added to cart!`);
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
