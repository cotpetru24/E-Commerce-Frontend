import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductDto } from '../models/product.dto';
import { CartService } from '../services/cart.service';
import { TargetAudience } from '../models/gender.enum';

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
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  newsletterEmail: string = '';
  
  // ============================================================================
  // EXAMPLE: HTTP REQUEST IMPLEMENTATION
  // ============================================================================
  
  // Uncomment these lines to see HTTP implementation:
  /*
  // Properties to hold data from HTTP requests
  featuredProductsFromServer: ProductDto[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Inject the API service (uncomment when using HTTP)
  // constructor(
  //   private cartService: CartService,
  //   private snackBar: MatSnackBar,
  //   private apiService: ApiService  // Add this
  // ) {}
  
  ngOnInit(): void {
    // ============================================================================
    // EXAMPLE 1: BASIC HTTP REQUEST
    // ============================================================================
    
    // Load featured products from server
    this.loadFeaturedProductsFromServer();
    
    // ============================================================================
    // EXAMPLE 2: HTTP REQUEST WITH LOADING STATE
    // ============================================================================
    
    // this.loadProductsWithLoadingState();
    
    // ============================================================================
    // EXAMPLE 3: HTTP REQUEST WITH ERROR HANDLING
    // ============================================================================
    
    // this.loadProductsWithErrorHandling();
    
    // ============================================================================
    // EXAMPLE 4: MULTIPLE HTTP REQUESTS
    // ============================================================================
    
    // this.loadMultipleDataSources();
  }
  
  // ============================================================================
  // EXAMPLE 1: BASIC HTTP REQUEST
  // ============================================================================
  
  loadFeaturedProductsFromServer(): void {
    // Subscribe to the HTTP request
    this.apiService.getProducts().subscribe({
      // Success callback - called when data is received
      next: (products: ProductDto[]) => {
        console.log('Products loaded from server:', products);
        this.featuredProductsFromServer = products.slice(0, 4); // Get first 4 products
      },
      // Error callback - called if request fails
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products';
      },
      // Complete callback - called when request completes (success or error)
      complete: () => {
        console.log('HTTP request completed');
      }
    });
  }
  
  // ============================================================================
  // EXAMPLE 2: HTTP REQUEST WITH LOADING STATE
  // ============================================================================
  
  loadProductsWithLoadingState(): void {
    this.isLoading = true; // Show loading spinner
    this.errorMessage = ''; // Clear any previous errors
    
    this.apiService.getProducts().subscribe({
      next: (products: ProductDto[]) => {
        this.featuredProductsFromServer = products.slice(0, 4);
        this.isLoading = false; // Hide loading spinner
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.errorMessage = 'Failed to load products';
        this.isLoading = false; // Hide loading spinner
      }
    });
  }
  
  // ============================================================================
  // EXAMPLE 3: HTTP REQUEST WITH ERROR HANDLING
  // ============================================================================
  
  loadProductsWithErrorHandling(): void {
    this.isLoading = true;
    
    this.apiService.getProductsWithErrorHandling().subscribe({
      next: (products: ProductDto[]) => {
        this.featuredProductsFromServer = products.slice(0, 4);
        this.isLoading = false;
        
        // Show success message
        this.snackBar.open('Products loaded successfully!', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message;
        
        // Show error message to user
        this.snackBar.open('Failed to load products. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }
  
  // ============================================================================
  // EXAMPLE 4: MULTIPLE HTTP REQUESTS
  // ============================================================================
  
  loadMultipleDataSources(): void {
    this.isLoading = true;
    
    // Load products and testimonials simultaneously
    const productsRequest = this.apiService.getProducts();
    const testimonialsRequest = this.apiService.getTestimonials(); // Assuming this exists
    
    // Combine multiple requests
    combineLatest([productsRequest, testimonialsRequest]).subscribe({
      next: ([products, testimonials]) => {
        this.featuredProductsFromServer = products.slice(0, 4);
        this.testimonials = testimonials; // Assuming you have this property
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load data';
      }
    });
  }
  
  // ============================================================================
  // EXAMPLE 5: HTTP REQUEST WITH PARAMETERS
  // ============================================================================
  
  loadProductsByCategory(category: string): void {
    this.apiService.getProductsByCategory(category).subscribe({
      next: (products: ProductDto[]) => {
        this.featuredProductsFromServer = products;
      },
      error: (error: any) => {
        console.error('Error loading products by category:', error);
      }
    });
  }
  
  // ============================================================================
  // EXAMPLE 6: POST REQUEST (CREATING DATA)
  // ============================================================================
  
  createNewProduct(productData: Partial<ProductDto>): void {
    const newProduct: ProductDto = {
      id: 0, // Server will assign real ID
      name: productData.name || '',
      description: productData.description || '',
      price: productData.price || 0,
      image: productData.image || '',
      stock: productData.stock || 0,
      category: productData.category || 'men',
      brand: productData.brand || ''
    };
    
    this.apiService.createProduct(newProduct).subscribe({
      next: (createdProduct: ProductDto) => {
        console.log('Product created:', createdProduct);
        
        // Add to local list
        this.featuredProductsFromServer.push(createdProduct);
        
        this.snackBar.open('Product created successfully!', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        console.error('Error creating product:', error);
        this.snackBar.open('Failed to create product', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  // ============================================================================
  // EXAMPLE 7: PUT REQUEST (UPDATING DATA)
  // ============================================================================
  
  updateExistingProduct(id: number, updatedData: Partial<ProductDto>): void {
    // First get the current product
    this.apiService.getProduct(id).subscribe({
      next: (currentProduct: ProductDto) => {
        // Merge current data with updates
        const updatedProduct = { ...currentProduct, ...updatedData };
        
        // Send update request
        this.apiService.updateProduct(id, updatedProduct).subscribe({
          next: (result: ProductDto) => {
            console.log('Product updated:', result);
            
            // Update local list
            const index = this.featuredProductsFromServer.findIndex(p => p.id === id);
            if (index !== -1) {
              this.featuredProductsFromServer[index] = result;
            }
            
            this.snackBar.open('Product updated successfully!', 'Close', {
              duration: 3000
            });
          },
          error: (error: any) => {
            console.error('Error updating product:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching product for update:', error);
      }
    });
  }
  
  // ============================================================================
  // EXAMPLE 8: DELETE REQUEST
  // ============================================================================
  
  deleteProduct(id: number): void {
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        
        // Remove from local list
        this.featuredProductsFromServer = this.featuredProductsFromServer.filter(
          product => product.id !== id
        );
        
        this.snackBar.open('Product deleted successfully!', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        console.error('Error deleting product:', error);
        this.snackBar.open('Failed to delete product', 'Close', {
          duration: 3000
        });
      }
    });
  }
  */
  
  // ============================================================================
  // EXISTING CODE (KEEP THIS)
  // ============================================================================
  
  featuredProducts: ProductDto[] = [
    {
      id: 1,
      name: 'Running Pro Elite',
      brandName: 'Nike',
      audience: TargetAudience.Men,
      price: 129.99,
      originalPrice: 159.99,
      discount: 19,
      imagePath: 'products/running-shoe.png',
      description: 'Professional running shoes with advanced cushioning technology',
      rating: 4.8,
      reviewCount: 245,
      stock: 50,
      sizes: ['7', '8', '9', '10', '11', '12'],
      isNew: true
    },
    {
      id: 2,
      name: 'Casual Comfort Plus',
      brandName: 'Adidas',
      audience: TargetAudience.Women,
      price: 89.99,
      imagePath: 'products/casual-sneaker.png',
      description: 'Comfortable casual sneakers perfect for everyday wear',
      rating: 4.6,
      reviewCount: 189,
      stock: 75,
      sizes: ['6', '7', '8', '9', '10'],
      isNew: false
    },
    {
      id: 3,
      name: 'Retro Classic',
      brandName: 'Converse',
      audience: TargetAudience.Unisex,
      price: 69.99,
      originalPrice: 79.99,
      discount: 13,
      imagePath: 'products/retro-sneaker.png',
      description: 'Timeless retro sneakers with vintage appeal',
      rating: 4.7,
      reviewCount: 312,
      stock: 100,
      sizes: ['6', '7', '8', '9', '10', '11', '12'],
      isNew: false
    },
    {
      id: 4,
      name: 'Performance Max',
      brandName: 'Under Armour',
      audience: TargetAudience.Men,
      price: 149.99,
      imagePath: 'products/retro-sneaker2.png',
      description: 'Maximum performance athletic shoes for serious athletes',
      rating: 4.9,
      reviewCount: 156,
      stock: 30,
      sizes: ['8', '9', '10', '11', '12'],
      isNew: true
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      text: 'The quality of these shoes is incredible! I\'ve been wearing them for months and they still look brand new. Highly recommend!',
      avatar: 'assets/avatars/avatar1.jpg'
    },
    {
      name: 'Mike Chen',
      location: 'Los Angeles, CA',
      rating: 5,
      text: 'Fast shipping and excellent customer service. The shoes fit perfectly and are super comfortable for my daily runs.',
      avatar: 'assets/avatars/avatar2.jpg'
    },
    {
      name: 'Emily Rodriguez',
      location: 'Miami, FL',
      rating: 4,
      text: 'Great selection of styles and the return process was so easy. Will definitely shop here again!',
      avatar: 'assets/avatars/avatar3.jpg'
    }
  ];

  brands = [
    { name: 'Nike', icon: 'sports_soccer' },
    { name: 'Adidas', icon: 'fitness_center' },
    { name: 'Converse', icon: 'style' },
    { name: 'Under Armour', icon: 'sports' },
    { name: 'Puma', icon: 'directions_run' },
    { name: 'New Balance', icon: 'hiking' }
  ];

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

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
    this.snackBar.open(`Viewing ${product.name}`, 'Close', { duration: 2000 });
  }

  addToCart(product: ProductDto) {
    this.cartService.addToCart(product, 1);
    this.snackBar.open(`${product.name} added to cart!`, 'Close', { 
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  subscribeNewsletter() {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      this.snackBar.open('Thank you for subscribing to our newsletter!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.newsletterEmail = '';
    } else {
      this.snackBar.open('Please enter a valid email address', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
