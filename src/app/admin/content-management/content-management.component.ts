import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../services/api/admin-api.service';
import { CmsApiService } from '../../services/api/cms-api.service';
import { ToastService } from '../../services/toast.service';
import { CmsProfileDto, CmsStoredProfileDto } from '../../models/cms.dto';
import { finalize } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';

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


  // Branding content
  // brandingContent = {
  //   useLogo: true,
  // };

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
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadStoredProfiles();
  }

  loadStoredProfiles() {
    this.isLoading = true;
    this.cmsApiService
      .getCmsProfilesAsync()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          try {
            this.storedProfiles = response;
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
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
      .getCmsProfileByIdAsync(profile.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          try {
            this.profile = response;
            this.populateContentFromProfile(response);
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
      });
  }

  populateContentFromProfile(profile: CmsProfileDto) {
this.profile = profile;

// this.profile = {
//   id:profile.id,
//   profileName:profile.profileName,
//   createdAt: profile.createdAt,
//   isActive:profile.isActive,

//   lastUpdated:profile.lastUpdated,
//   websiteName: profile.websiteName,
//     tagline: profile.tagline,
//     logoBase64: profile.logoBase64,
//     faviconBase64: profile.faviconBase64,

//     navbarBgColor: profile.navbarBgColor,
//     navbarTextColor: profile.navbarTextColor,
//     navbarLinkColor: profile.navbarLinkColor,

//     footerBgColor: profile.footerBgColor,
//     footerTextColor: profile.footerTextColor,
//     footerLinkColor: profile.footerLinkColor,

//     heroTitle: profile.heroTitle,
//     heroSubtitle: profile.heroSubtitle,
//     heroDescription: profile.heroDescription,
//     heroPrimaryButtonText: profile.heroPrimaryButtonText,
//     heroSecondaryButtonText: profile.heroSecondaryButtonText,
//     heroBackgroundImageBase64: profile.heroBackgroundImageBase64,

//     newsletterTitle: profile.newsletterTitle,
//     newsletterDescription: profile.newsletterDescription,
//     newsletterButtonText: profile.newsletterButtonText,

//     features: profile.features,
//     categories: profile.categories,
// }


    // Populate categories
    this.profile!.categories = profile.categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      description: cat.description,
      image: cat.imageBase64 || '',
      itemCount: cat.itemTagline || '',
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
    // if (!this.buildProfileFromContent()) {
    //   return;
    // }
    this.isLoading = true;
    this.cmsApiService
      .createCmsProfileAsync(this.profile!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
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
      });
  }

  // buildProfileFromContent(): boolean {
  //   const profileName =
  //     this.profileName || this.brandingContent.websiteName || 'New Profile';

  //   if (!this.profile) {
  //     // Create a new profile object
  //     this.profile = {
  //       id: 0,
  //       profileName: profileName,
  //       isActive: false,
  //       websiteName: this.brandingContent.websiteName,
  //       tagline: this.brandingContent.tagline,
  //       logoBase64: this.brandingContent.logoUrl || '',
  //       faviconBase64: this.brandingContent.faviconUrl || '',
  //       navbarBgColor: this.colorScheme.navbarBackground,
  //       navbarTextColor: this.colorScheme.navbarText,
  //       navbarLinkColor: this.colorScheme.navbarLink,
  //       footerBgColor: this.colorScheme.footerBackground,
  //       footerTextColor: this.colorScheme.footerText,
  //       footerLinkColor: this.colorScheme.footerLink,
  //       heroTitle: this.heroContent.mainTitle,
  //       heroSubtitle: this.heroContent.subtitle,
  //       heroDescription: this.heroContent.description,
  //       heroPrimaryButtonText: this.heroContent.primaryButtonText,
  //       heroSecondaryButtonText: this.heroContent.secondaryButtonText,
  //       heroBackgroundImageBase64: this.heroContent.backgroundImage || '',
  //       features: this.featuresContent.map((feat, index) => ({
  //         id: (feat as any).id || 0,
  //         iconClass: feat.icon,
  //         title: feat.title,
  //         description: feat.description,
  //         sortOrder: (feat as any).sortOrder || index,
  //       })),
  //       categories: this.categoriesContent.map((cat, index) => ({
  //         id: (cat as any).id || 0,
  //         title: cat.title,
  //         description: cat.description,
  //         imageBase64: cat.image || '',
  //         itemCountText: cat.itemCount,
  //         sortOrder: (cat as any).sortOrder || index,
  //       })),
  //       lastUpdated: new Date(),
  //       createdAt: new Date(),
  //     };
  //   } else {
  //     // Update existing profile
  //     this.profile.profileName = profileName;
  //     this.profile.websiteName = this.brandingContent.websiteName;
  //     this.profile.tagline = this.brandingContent.tagline;
  //     this.profile.logoBase64 = this.brandingContent.logoUrl || '';
  //     this.profile.faviconBase64 = this.brandingContent.faviconUrl || '';
  //     this.profile.navbarBgColor = this.colorScheme.navbarBackground;
  //     this.profile.navbarTextColor = this.colorScheme.navbarText;
  //     this.profile.navbarLinkColor = this.colorScheme.navbarLink;
  //     this.profile.footerBgColor = this.colorScheme.footerBackground;
  //     this.profile.footerTextColor = this.colorScheme.footerText;
  //     this.profile.footerLinkColor = this.colorScheme.footerLink;
  //     this.profile.heroTitle = this.heroContent.mainTitle;
  //     this.profile.heroSubtitle = this.heroContent.subtitle;
  //     this.profile.heroDescription = this.heroContent.description;
  //     this.profile.heroPrimaryButtonText = this.heroContent.primaryButtonText;
  //     this.profile.heroSecondaryButtonText =
  //       this.heroContent.secondaryButtonText;
  //     this.profile.heroBackgroundImageBase64 =
  //       this.heroContent.backgroundImage || '';
  //     this.profile.features = this.featuresContent.map((feat, index) => ({
  //       id: (feat as any).id || 0,
  //       iconClass: feat.icon,
  //       title: feat.title,
  //       description: feat.description,
  //       sortOrder: (feat as any).sortOrder || index,
  //     }));
  //     this.profile.categories = this.categoriesContent.map((cat, index) => ({
  //       id: (cat as any).id || 0,
  //       title: cat.title,
  //       description: cat.description,
  //       imageBase64: cat.image || '',
  //       itemCountText: cat.itemCount,
  //       sortOrder: (cat as any).sortOrder || index,
  //     }));
  //     this.profile.lastUpdated = new Date();
  //   }
  //   return true;
  // }

  activateCmsProfile(profile: CmsStoredProfileDto) {
    this.isLoading = true;
    this.cmsApiService
      .activateCmsProfileAsync(profile.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          try {
            this.profile = response;

            //update localStorage.cmsProfile then
            this.toastService.success('CMS profile activated successfully');
            this.loadStoredProfiles();
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
      });
  }

  updateCmsProfile() {
    if (!this.profile || !this.selectedProfileId) {
      this.toastService.error('Please select a profile to update');
      return;
    }
    // if (!this.buildProfileFromContent()) {
    //   return;
    // }
    this.isLoading = true;
    this.cmsApiService
      .updateCmsProfileAsync(this.profile!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          try {
            this.profile = response;
            this.toastService.success('CMS profile updated successfully');
            this.loadStoredProfiles();
          } catch (err) {
            console.error('Validation failed', err);
            this.toastService.error('CMS profile data is invalid');
          }
        },
      });
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

    modalRef.result.then((result) => {
      if (result === true) {
        this.isLoading = true;

        this.cmsApiService.deleteCmsProfileAsync(profile.id).subscribe({
          next: () => {
            this.toastService.success('Profile deleted successfully');
            this.isLoading = false;
            if (this.selectedProfileId === profile.id) {
              this.selectedProfileId = null;
              this.profile = this.createEmptyCmsProfileDto();
              this.isEditingMode = false;
            }
            this.loadStoredProfiles();
          },
          error: (error) => {
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
      id:0,
      title: 'New Category',
      description: '',
      imageBase64: '',
      itemTagline: '',
      sortOrder:0
    });
  }

  deleteCategory(index: number) {
    if (this.profile!.categories.length > index) {
      this.profile?.categories.splice(index, 1);
    }
  }

  addFeature() {
    this.profile?.features.push({
      id:0,
      iconClass: 'bi-star',
      title: 'New Feature',
      description: '',
      sortOrder:0
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
    this.profile = this.createEmptyCmsProfileDto()
  }

  previewChanges() {
    // Implement preview functionality
    this.toastService.info('Preview functionality coming soon!');
  }




createEmptyCmsProfileDto(): CmsProfileDto {
  const now = new Date();

  return {
    id: 0,
    profileName: '',
    isActive: false,

    websiteName: '',
    tagline: '',
    logoBase64: '',
    faviconBase64: '',

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

    newsletterTitle: '',
    newsletterDescription: '',
    newsletterButtonText: '',

    showLogoInHeader:false,

    features: [],
    categories: [],

    lastUpdated: now,
    createdAt: now,
  };
}




}
