import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CmsApiService } from '../../services/api';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { CmsStateService } from '../../services/cmsStateService';
import { CmsProfileDto, CmsStoredProfileDto, CmsNavAndFooterDto } from '@dtos';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss'],
})
export class ContentManagementComponent implements OnInit {
  activeSection = 'branding';

  storedProfiles: CmsStoredProfileDto[] = [];
  profile: CmsProfileDto = this.createEmptyCmsProfileDto();
  selectedProfileId: number | null = null;
  isLoading: boolean = false;
  profileName: string = '';
  isProfilesCardCollapsed: boolean = false;
  isEditingMode: boolean = false;

  testimonialsContent = [
    {
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      text: 'Amazing quality shoes! The delivery was fast and the customer service was excellent.',
      avatar: null,
    },
    {
      name: 'Mike Chen',
      location: 'Los Angeles, CA',
      rating: 5,
      text: 'Great selection of shoes for all occasions. Highly recommend!',
      avatar: null,
    },
    {
      name: 'Emily Davis',
      location: 'Chicago, IL',
      rating: 4,
      text: 'Love the variety and the prices are reasonable. Will definitely shop here again.',
      avatar: null,
    },
  ];

  constructor(
    private toastService: ToastService,
    private cmsApiService: CmsApiService,
    private modalService: NgbModal,
    private cmsStateService: CmsStateService
  ) {}

  ngOnInit() {
    this.loadStoredProfiles();
  }

  loadStoredProfiles() {
    this.isLoading = true;
    this.cmsApiService
      .getCmsProfiles()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: CmsStoredProfileDto[]) => {
          try {
            this.storedProfiles = response;
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
        error: (error: any) => {
          this.toastService.error('Failed to load CMS profiles');
        },
      });
  }

  selectProfile(profile: CmsStoredProfileDto) {
    this.selectedProfileId = profile.id;
    this.isEditingMode = true;
    this.isProfilesCardCollapsed = true;
    this.getProfileById(profile);
  }

  getProfileById(profile: CmsStoredProfileDto) {
    this.isLoading = true;
    this.cmsApiService
      .getCmsProfileById(profile.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: CmsProfileDto) => {
          try {
            this.profile = response;
            this.populateContentFromProfile(response);
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
        error: (error: any) => {
          this.toastService.error('Failed to load CMS profile');
        },
      });
  }

  populateContentFromProfile(profile: CmsProfileDto) {
    this.profile = profile;
    // this.profile.categories = [...this.profile.categories];

    // Populate categories
    this.profile!.categories = profile.categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      description: cat.description,
      imageBase64: cat.imageBase64 || '',
      itemTagline: cat.itemTagline || '',
      sortOrder: cat.sortOrder,
    }));

    // Populate features
    this.profile!.features = profile.features.map((feat) => ({
      id: feat.id,
      iconClass: feat.iconClass,
      title: feat.title,
      description: feat.description,
      sortOrder: feat.sortOrder,
    }));
  }

  createNewProfile() {
    // Reset to default values
    this.selectedProfileId = null;
    this.profileName = '';
    this.isEditingMode = true;
    this.isProfilesCardCollapsed = true;
    this.profile = this.createEmptyCmsProfileDto();
  }

  createCmsProfile() {
    this.isLoading = true;
    this.cmsApiService
      .createCmsProfile(this.profile!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: CmsProfileDto) => {
          try {
            this.profile = response;
            this.selectedProfileId = response.id;
            this.isEditingMode = true;
            this.toastService.success('CMS profile created successfully');
            this.loadStoredProfiles();
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
        error: (error: any) => {
          this.toastService.error('Failed to create CMS profile');
        },
      });
  }

  activateCmsProfile(profile: CmsStoredProfileDto) {
    this.isLoading = true;
    this.cmsApiService
      .activateCmsProfile(profile.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: CmsProfileDto) => {
          try {
            this.profile = response;
            this.cmsApiService.getCmsNavAndFooter().subscribe({
              next: (cms: CmsNavAndFooterDto) => {
                localStorage.removeItem('cmsProfile');
                localStorage.setItem('cmsProfile', JSON.stringify(cms));
                this.cmsStateService.setProfile(cms);
                this.applyTheme(cms);

                this.cmsStateService.setPageTitle(cms.websiteName);
                this.cmsStateService.setFavicon(cms.favicon);
              },
              error: (error: any) => {
                console.error('Failed to load CMS nav and footer', error);
              },
            });
            this.toastService.success('CMS profile activated successfully');
            this.loadStoredProfiles();
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
        error: (error: any) => {
          this.toastService.error('Failed to activate CMS profile');
        },
      });
  }

  private applyTheme(cms: CmsNavAndFooterDto): void {
    const root = document.documentElement;

    root.style.setProperty('--navbar-bg-color', cms.navbarBgColor);
    root.style.setProperty('--navbar-link-color', cms.navbarLinkColor);
    root.style.setProperty('--navbar-text-color', cms.navbarTextColor);

    root.style.setProperty('--footer-bg-color', cms.footerBgColor);
    root.style.setProperty('--footer-link-color', cms.footerLinkColor);
    root.style.setProperty('--footer-text-color', cms.footerTextColor);
  }

  updateCmsProfile() {
    if (!this.profile || !this.selectedProfileId) {
      this.toastService.error('Please select a profile to update');
      return;
    }
    this.isLoading = true;
    this.cmsApiService
      .updateCmsProfile(this.profile!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: CmsProfileDto) => {
          try {
            this.profile = response;

            if (response.isActive) {
              this.cmsApiService.getCmsNavAndFooter().subscribe({
                next: (cms: CmsNavAndFooterDto) => {
                  localStorage.removeItem('cmsProfile');
                  localStorage.setItem('cmsProfile', JSON.stringify(cms));
                  this.cmsStateService.setProfile(cms);
                  this.applyTheme(cms);

                  this.cmsStateService.setPageTitle(cms.websiteName);
                  this.cmsStateService.setFavicon(cms.favicon);
                },
                error: (error: any) => {
                  console.error('Failed to load CMS nav and footer', error);
                },
              });
            }

            this.profile = this.createEmptyCmsProfileDto();
            this.isEditingMode = false;
            this.isProfilesCardCollapsed = false;
            this.toastService.success('CMS profile updated successfully');
            this.loadStoredProfiles();
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
        error: (error: any) => {
          this.toastService.error('Failed to update CMS profile');
        },
      });
  }

  saveCmsProfileAs() {
    if (!this.profile || !this.selectedProfileId) {
      this.toastService.error('Please select a profile to update');
      return;
    }
    this.isLoading = true;

    this.profile.id = 0;

    this.profile!.categories = this.profile.categories.map((cat) => ({
      id: 0,
      title: cat.title,
      description: cat.description,
      imageBase64: cat.imageBase64 || '',
      itemTagline: cat.itemTagline || '',
      sortOrder: cat.sortOrder,
    }));

    this.profile!.features = this.profile.features.map((feat) => ({
      id: 0,
      iconClass: feat.iconClass,
      title: feat.title,
      description: feat.description,
      sortOrder: feat.sortOrder,
    }));

    this.cmsApiService
      .createCmsProfile(this.profile!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: CmsProfileDto) => {
          try {
            this.profile = response;
            this.selectedProfileId = response.id;
            this.isEditingMode = false;
            this.isProfilesCardCollapsed = false;
            this.toastService.success('CMS profile created successfully');
            this.loadStoredProfiles();
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
        error: (error: any) => {
          this.toastService.error('Failed to save CMS profile');
        },
      });
  }

  //   trackByCategoryId(index: number, category: any) {
  //   return category.id;
  // }

  private fileToBase64(event: Event, assign: (base64: string) => void) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => assign((reader.result as string).split(',')[1]);
    // reader.onload = () =>
    // assign(reader.result as string);

    reader.readAsDataURL(input.files[0]);
  }

  onLogoSelected(event: Event) {
    this.fileToBase64(event, (b64) => (this.profile!.logoBase64 = b64));
  }

  onFaviconSelected(event: Event) {
    this.fileToBase64(event, (b64) => (this.profile!.faviconBase64 = b64));
  }

  onCategoryImageSelected(event: Event, index: number) {
    this.fileToBase64(
      event,
      (b64) => (this.profile!.categories[index].imageBase64 = b64)
    );
  }

  onHeroImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.profile!.heroBackgroundImageBase64 = base64;
    };

    reader.readAsDataURL(file);
  }

  canDeleteProfile(profile: CmsStoredProfileDto): boolean {
    // Cannot delete if it's the last profile
    if (this.storedProfiles.length <= 1) {
      return false;
    }
    // Cannot delete if it's the active profile
    if (profile.isActive) {
      return false;
    }
    return true;
  }

  deleteProfile(profile: CmsStoredProfileDto) {
    if (!this.canDeleteProfile(profile)) {
      if (this.storedProfiles.length <= 1) {
        this.toastService.error(
          'Cannot delete the last profile. At least one profile must exist.'
        );
      } else if (profile.isActive) {
        this.toastService.error(
          'Cannot delete the active profile. Please set another profile as active first.'
        );
      }
      return;
    }

    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Confirm Deletion';
    modalRef.componentInstance.message = `Are you sure you want to delete the profile "${profile.profileName}"?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        this.cmsApiService.deleteCmsProfile(profile.id).subscribe({
          next: (response: boolean) => {
            this.toastService.success('Profile deleted successfully');
            this.isLoading = false;
            if (this.selectedProfileId === profile.id) {
              this.selectedProfileId = null;
              this.profile = this.createEmptyCmsProfileDto();
              this.isEditingMode = false;
            }
            this.loadStoredProfiles();
          },
          error: (error: any) => {
            this.isLoading = false;
            console.error('Error deleting profile:', error);
            this.toastService.error('Failed to delete profile');
          },
        });
      }
    });
  }

  expandProfilesCard() {
    this.isProfilesCardCollapsed = false;
  }

  collapseProfilesCard() {
    this.isProfilesCardCollapsed = true;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  onLogoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.brandingContent.logoUrl = e.target.result;
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
        // this.brandingContent.faviconUrl = e.target.result;
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
            // this.heroContent.backgroundImage = imageUrl;
            break;
          case 'category':
            if (index !== undefined) {
              // this.categoriesContent[index].image = imageUrl;
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

  addCategory() {
    this.profile?.categories.push({
      id: 0,
      title: 'New Category',
      description: '',
      imageBase64: '',
      itemTagline: '',
      sortOrder: 0,
    });
  }

  deleteCategory(index: number) {
    if (this.profile!.categories.length > index) {
      this.profile?.categories.splice(index, 1);
    }
  }

  addFeature() {
    this.profile?.features.push({
      id: 0,
      iconClass: 'bi-star',
      title: 'New Feature',
      description: '',
      sortOrder: 0,
    });
  }

  deleteFeature(index: number) {
    if (this.profile!.features.length > index) {
      this.profile!.features.splice(index, 1);
    }
  }

  cancelEditing() {
    this.isEditingMode = false;
    this.selectedProfileId = null;
    // this.profile = null;
    this.profileName = '';
    this.isProfilesCardCollapsed = false;
    this.profile = this.createEmptyCmsProfileDto();
  }

  previewChanges() {
    // Implement preview functionality
    this.toastService.info('Preview functionality coming soon!');
  }

  createEmptyCmsProfileDto(): CmsProfileDto {
    return {
      id: 0,
      profileName: '',
      isActive: false,

      websiteName: '',
      tagline: '',
      logoBase64: '',
      faviconBase64: '',
      showLogoInHeader: false,

      navbarBgColor: '',
      navbarTextColor: '',
      navbarLinkColor: '',

      footerBgColor: '',
      footerTextColor: '',
      footerLinkColor: '',

      heroTitle: '',
      heroSubtitle: '',
      heroDescription: '',
      heroPrimaryButtonText: '',
      heroSecondaryButtonText: '',
      heroBackgroundImageBase64: '',

      features: [],
      categories: [],
    };
  }
}
