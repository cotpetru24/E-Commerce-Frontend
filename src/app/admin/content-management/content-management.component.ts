import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss']
})
export class ContentManagementComponent implements OnInit {
  activeSection = 'branding';

  // Branding content
  brandingContent = {
    logoUrl: '',
    faviconUrl: '',
    websiteName: 'ShoeStore',
    tagline: 'Step into Style',
    useLogo: true
  };

  // Color scheme
  colorScheme = {
    navbarBackground: '#ffffff',
    navbarText: '#000000',
    navbarLink: '#007bff',
    footerBackground: '#343a40',
    footerText: '#ffffff',
    footerLink: '#17a2b8'
  };

  heroContent = {
    mainTitle: 'Step into Style',
    subtitle: 'Walk with Confidence',
    description: 'Discover the perfect blend of comfort and fashion. From casual sneakers to elegant formal wear, we have the shoes that match your lifestyle and personality.',
    primaryButtonText: 'Shop Now',
    secondaryButtonText: 'Explore Categories',
    backgroundImage: null
  };

  categoriesContent = [
    {
      title: "Men's Collection",
      description: "From athletic performance to business casual",
      image: null,
      itemCount: "200+ Styles"
    },
    {
      title: "Women's Collection",
      description: "Elegant designs that empower your style",
      image: null,
      itemCount: "250+ Styles"
    },
    {
      title: "Children's Collection",
      description: "Comfortable and durable for active kids",
      image: null,
      itemCount: "100+ Styles"
    }
  ];

  featuresContent = [
    {
      icon: 'bi-truck',
      title: 'Free Shipping',
      description: 'Free standard shipping on orders over $50. Fast delivery to your doorstep.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Secure Payment',
      description: '100% secure payment processing. Your data is protected with bank-level security.'
    },
    {
      icon: 'bi-arrow-repeat',
      title: 'Easy Returns',
      description: '30-day return policy. Not satisfied? Return for free, no questions asked.'
    },
    {
      icon: 'bi-headset',
      title: '24/7 Support',
      description: 'Round-the-clock customer support. We\'re here to help whenever you need us.'
    }
  ];

  testimonialsContent = [
    {
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      text: 'Amazing quality shoes! The delivery was fast and the customer service was excellent.',
      avatar: null
    },
    {
      name: 'Mike Chen',
      location: 'Los Angeles, CA',
      rating: 5,
      text: 'Great selection of shoes for all occasions. Highly recommend!',
      avatar: null
    },
    {
      name: 'Emily Davis',
      location: 'Chicago, IL',
      rating: 4,
      text: 'Love the variety and the prices are reasonable. Will definitely shop here again.',
      avatar: null
    }
  ];

  brandsContent = [
    {
      name: 'Nike',
      icon: 'bi-nike'
    },
    {
      name: 'Adidas',
      icon: 'bi-adidas'
    },
    {
      name: 'Puma',
      icon: 'bi-puma'
    },
    {
      name: 'Under Armour',
      icon: 'bi-under-armour'
    },
    {
      name: 'New Balance',
      icon: 'bi-new-balance'
    },
    {
      name: 'Converse',
      icon: 'bi-converse'
    }
  ];

  newsletterContent = {
    title: 'Stay in the Loop',
    description: 'Be the first to know about new arrivals, exclusive offers, and style tips. Join our community of fashion-forward individuals.',
    buttonText: 'Subscribe'
  };

  constructor(
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    // Simulate loading content from API
    // In real app, this would fetch from content service
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  onLogoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.brandingContent.logoUrl = e.target.result;
        this.toastService.success('Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }

  onFaviconUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.brandingContent.faviconUrl = e.target.result;
        this.toastService.success('Favicon uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }

  onImageUpload(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        
        switch (type) {
          case 'hero':
            this.heroContent.backgroundImage = imageUrl;
            break;
          case 'category':
            if (index !== undefined) {
              this.categoriesContent[index].image = imageUrl;
            }
            break;
          case 'testimonial':
            if (index !== undefined) {
              this.testimonialsContent[index].avatar = imageUrl;
            }
            break;
        }
        
        this.toastService.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }

  saveAllChanges() {
    // Simulate saving content to API
    setTimeout(() => {
      this.toastService.success('All changes saved successfully!');
    }, 1000);
  }

  previewChanges() {
    // Implement preview functionality
    this.toastService.info('Preview functionality coming soon!');
  }

  resetToDefaults() {
    if (confirm('Are you sure you want to reset all content to default values?')) {
      this.loadContent();
      this.toastService.success('Content reset to defaults!');
    }
  }

  applyColorScheme() {
    // Apply color scheme to the website
    // This would typically involve updating CSS variables or sending to backend
    this.toastService.success('Color scheme applied successfully!');
  }

  exportBrandingAssets() {
    // Export branding assets (logo, favicon, color scheme)
    this.toastService.info('Export functionality coming soon!');
  }
} 