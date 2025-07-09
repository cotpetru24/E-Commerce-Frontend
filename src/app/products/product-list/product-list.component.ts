import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductDto } from '../../models/product.dto';
import { CartService } from '../../services/cart.service';
import { TargetAudience } from '../../models/gender.enum';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  Gender = TargetAudience;

  allProducts: ProductDto[] = [
    {
      id: 1,
      name: "Men's Retro Sneaker",
      description:
        "This comfortable men's sneaker features a retro design with a modern touch.",
      price: 64.99,
      image: 'products/retro-sneaker.png',
      stock: 10,
      targetAudience: TargetAudience.Men,
      brand: 'Nike',
    },
    {
      id: 2,
      name: "Men's Running Shoe",
      description:
        'Lightweight and cushioned. The perfect running shoe for your daily tune.',
      price: 89.39,
      image: 'products/running-shoe.png',
      stock: 7,
      targetAudience: TargetAudience.Men,
      brand: 'Adidas',
    },
    {
      id: 3,
      name: "Men's Casual Sneaker",
      description:
        "A versatile men's casual sneaker with a minimal and stylish design.",
      price: 74.39,
      image: 'products/casual-sneaker.png',
      stock: 5,
      targetAudience: TargetAudience.Men,
      brand: 'Puma',
    },
    {
      id: 4,
      name: "Women's Elegant Heel",
      description: 'Elegant and comfortable heel perfect for formal occasions.',
      price: 99.99,
      image: 'products/retro-sneaker2.png',
      stock: 8,
      targetAudience: TargetAudience.Women,
      brand: 'Steve Madden',
    },
    {
      id: 5,
      name: "Children's Play Shoe",
      description: 'Durable and comfortable shoes perfect for active children.',
      price: 45.99,
      image: 'products/casual-sneaker.png',
      stock: 12,
      targetAudience: TargetAudience.Children,
      brand: 'Skechers',
    },
    {
      id: 6,
      name: "Women's Athletic Shoe",
      description:
        'High-performance athletic shoes for women who love to stay active.',
      price: 79.99,
      image: 'products/running-shoe.png',
      stock: 6,
      targetAudience: TargetAudience.Women,
      brand: 'Under Armour',
    },
    {
      id: 7,
      name: "Women's Casual Sneaker",
      description: 'Comfortable and stylish casual sneakers for everyday wear.',
      price: 69.99,
      image: 'products/casual-sneaker.png',
      stock: 15,
      targetAudience: TargetAudience.Women,
      brand: 'Converse',
    },
    {
      id: 8,
      name: "Children's School Shoe",
      description: 'Durable school shoes that can handle active children.',
      price: 39.99,
      image: 'products/retro-sneaker.png',
      stock: 20,
      targetAudience: TargetAudience.Children,
      brand: 'Clarks',
    },
  ];

  filteredProducts: ProductDto[] = [];
  availableBrands: string[] = [];

  // Filter properties
  searchTerm: string = '';
  selectedGender: TargetAudience | '' = '';
  selectedBrand: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = 'name';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    //fix the route to use gender isntead of category
    // Get gender from route params
    this.route.params.subscribe((params) => {
      const gender = params['gender'];
      if (gender) {
        this.selectedGender = gender;
      }
    });

    this.initializeProducts();
    this.extractBrands();
    this.applyFilters();
  }

  initializeProducts() {
    this.filteredProducts = [...this.allProducts];
  }

  extractBrands() {
    const brands = new Set(this.allProducts.map((product) => product.brand));
    this.availableBrands = Array.from(brands).sort();
  }

  getPageTitle(): string {
    if (this.selectedGender) {
      return `${
        this.selectedGender.charAt(0).toUpperCase() +
        this.selectedGender.slice(1)
      }'s Shoes`;
    }
    return 'All Products';
  }

  getPageSubtitle(): string {
    if (this.selectedGender) {
      return `Discover our collection of ${this.selectedGender}'s footwear`;
    }
    return 'Browse our complete collection of stylish and comfortable shoes';
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedGender = '';
    this.selectedBrand = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'name';
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allProducts];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.brand.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search)
      );
    }

    // Gender filter
    if (this.selectedGender) {
      filtered = filtered.filter(
        (product) => product.targetAudience === this.selectedGender
      );
    }

    // Brand filter
    if (this.selectedBrand) {
      filtered = filtered.filter(
        (product) => product.brand === this.selectedBrand
      );
    }

    // Price range filter
    if (this.minPrice !== null) {
      filtered = filtered.filter((product) => product.price >= this.minPrice!);
    }
    if (this.maxPrice !== null) {
      filtered = filtered.filter((product) => product.price <= this.maxPrice!);
    }

    // Sort
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
  }

  sortProducts(products: ProductDto[]): ProductDto[] {
    switch (this.sortBy) {
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case 'price':
        return products.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return products.sort((a, b) => b.price - a.price);
      case 'brand':
        return products.sort((a, b) => a.brand.localeCompare(b.brand));
      default:
        return products;
    }
  }

  quickView(product: ProductDto) {
    // Implement quick view functionality
    console.log('Quick view:', product);
  }

  addToCart(product: ProductDto) {
    // For product list, add with default size and quantity
    this.cartService.addToCart(product, 1);

    this.snackBar
      .open(`${product.name} added to cart!`, 'View Cart', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      })
      .onAction()
      .subscribe(() => {
        // Navigate to cart
        console.log('Navigate to cart');
      });
  }
}
