import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss'
})
export class UserOrdersComponent implements OnInit {
  currentFilter = 'all';
  selectedOrder: any = null;
  
  allOrders = [
    {
      orderId: 'ORD-2024-001',
      orderDate: new Date('2024-01-15'),
      itemCount: 2,
      total: 129.99,
      status: 'Delivered',
      trackingNumber: 'TRK123456789',
      currentStep: 4,
      estimatedDelivery: new Date('2024-01-18'),
      trackingEvents: [
        {
          status: 'ordered',
          title: 'Order Placed',
          description: 'Your order has been successfully placed',
          timestamp: new Date('2024-01-15 10:30:00')
        },
        {
          status: 'processing',
          title: 'Order Processing',
          description: 'Your order is being prepared for shipment',
          timestamp: new Date('2024-01-15 14:20:00')
        },
        {
          status: 'shipped',
          title: 'Order Shipped',
          description: 'Your order has been shipped',
          timestamp: new Date('2024-01-16 09:15:00')
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Your package is out for delivery',
          timestamp: new Date('2024-01-18 08:00:00')
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Your package has been delivered',
          timestamp: new Date('2024-01-18 14:30:00')
        }
      ]
    },
    {
      orderId: 'ORD-2024-002',
      orderDate: new Date('2024-01-10'),
      itemCount: 1,
      total: 89.50,
      status: 'Processing',
      trackingNumber: null,
      currentStep: 1,
      estimatedDelivery: new Date('2024-01-15'),
      trackingEvents: [
        {
          status: 'ordered',
          title: 'Order Placed',
          description: 'Your order has been successfully placed',
          timestamp: new Date('2024-01-10 16:45:00')
        },
        {
          status: 'processing',
          title: 'Order Processing',
          description: 'Your order is being prepared for shipment',
          timestamp: new Date('2024-01-11 11:20:00')
        }
      ]
    },
    {
      orderId: 'ORD-2024-003',
      orderDate: new Date('2024-01-05'),
      itemCount: 3,
      total: 199.99,
      status: 'Shipped',
      trackingNumber: 'TRK987654321',
      currentStep: 3,
      estimatedDelivery: new Date('2024-01-12'),
      trackingEvents: [
        {
          status: 'ordered',
          title: 'Order Placed',
          description: 'Your order has been successfully placed',
          timestamp: new Date('2024-01-05 13:15:00')
        },
        {
          status: 'processing',
          title: 'Order Processing',
          description: 'Your order is being prepared for shipment',
          timestamp: new Date('2024-01-06 10:30:00')
        },
        {
          status: 'shipped',
          title: 'Order Shipped',
          description: 'Your order has been shipped',
          timestamp: new Date('2024-01-08 14:45:00')
        }
      ]
    }
  ];

  filteredOrders = [...this.allOrders];

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    // Simulate loading orders from API
    // In real app, this would fetch from order service
  }

  filterOrders(filter: string) {
    this.currentFilter = filter;
    
    if (filter === 'all') {
      this.filteredOrders = [...this.allOrders];
    } else {
      this.filteredOrders = this.allOrders.filter(order => 
        order.status.toLowerCase() === filter
      );
    }
  }

  trackOrder(order: any) {
    this.selectedOrder = order;
    // Show tracking modal using Bootstrap
    const modal = new (window as any).bootstrap.Modal(document.getElementById('trackingModal'));
    modal.show();
  }

  viewOrderDetails(orderId: string) {
    this.router.navigate(['/account/orders', orderId]);
  }

  reorder(order: any) {
    // Implement reorder functionality
    this.toastService.success('Items added to cart for reorder!');
    this.router.navigate(['/cart']);
  }

  cancelOrder(order: any) {
    if (confirm('Are you sure you want to cancel this order?')) {
      // Implement cancel order functionality
      this.toastService.success('Order cancelled successfully!');
      this.loadOrders(); // Reload orders
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success';
      case 'shipped':
        return 'bg-info';
      case 'processing':
        return 'bg-warning';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getTimelineIcon(status: string): string {
    switch (status) {
      case 'ordered':
        return 'bi-cart-check';
      case 'processing':
        return 'bi-gear';
      case 'shipped':
        return 'bi-truck';
      case 'out_for_delivery':
        return 'bi-box-seam';
      case 'delivered':
        return 'bi-check-circle';
      default:
        return 'bi-circle';
    }
  }
} 