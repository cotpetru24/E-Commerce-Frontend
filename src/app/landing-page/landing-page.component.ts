import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProductDto } from '../models/product.dto';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'landing-page.component',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
class LandingPageComponent {
  products: ProductDto[] = [
    {
      name: "Men's Retro Sneaker",
      description:
        "This comfortable men's sneaker features a retro design with a modern touch.",
      price: 64.99,
      imageUrl: 'products/retro-sneaker.png',
      stock: 10,
    },
    {
      name: "Men's Running Shoe",
      description:
        'Lightweight and cushioned. The perfect running shoe for your daily tune.',
      price: 89.39,
      imageUrl: 'products/running-shoe.png',
      stock: 7,
    },
    {
      name: "Men's Casual Sneaker",
      description:
        "A versatile men's casual sneaker with a minimal and stylish design.",
      price: 74.39,
      imageUrl: 'products/casual-sneaker.png',
      stock: 5,
    },
  ];
}

export { LandingPageComponent };
