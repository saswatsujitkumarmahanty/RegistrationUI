import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/service';
import { getAvatar, setAvatar, removeAvatar } from '../../core/utilities/storage.utilities';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./account.css'],
})
export class Account implements OnInit {
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
  
  accountForm!: FormGroup;
  userId: string | null = '';
  successMessage: string = '';
  errorMessage: string = '';
  currentUserName: string = '';
  dropdownOpen: boolean = false;
  isSubmitting = false;

   avatarUrl: string | null = null;
  private pendingAvatarUrl: string | null | undefined = undefined;
  hasPendingAvatarChange = false;
  isUploadingAvatar = false;
  avatarError = '';

  private readonly maxUploadBytes = 8 * 1024 * 1024;
  private readonly outputSize = 256;

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private service: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');

    const currentName = localStorage.getItem('userName') || 'User';
    this.currentUserName = currentName;

    this.avatarUrl = getAvatar(this.userId);

    this.accountForm = this.fb.group({
      name: [currentName, [Validators.required, Validators.minLength(2)]],
    });
  }

  get initials(): string {
    const name = this.currentUserName?.trim();
    if (!name) return '?';
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  get nameField() {
    return this.accountForm.get('name');
  }
 
  get fieldValid(): boolean {
    return !!this.nameField && this.nameField.valid && this.nameField.dirty;
  }

  get displayAvatarUrl(): string | null {
    return this.hasPendingAvatarChange ? (this.pendingAvatarUrl ?? null) : this.avatarUrl;
  }
 
  private get nameChanged(): boolean {
    return this.accountForm.dirty && this.nameField?.value !== this.currentUserName;
  }
 
  get hasChanges(): boolean {
    return this.nameChanged || this.hasPendingAvatarChange;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    this.dropdownOpen = false;
    this.service.logout();
  }

  triggerAvatarPicker(): void {
    this.avatarError = '';
    this.avatarInput?.nativeElement.click();
  }
 
  async onAvatarSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
 
    this.avatarError = '';
    if (!file.type.startsWith('image/')) {
      this.avatarError = 'Please choose an image file (JPG, PNG, GIF, or WEBP).';
      return;
    }
 
    if (file.size > this.maxUploadBytes) {
      this.avatarError = 'That image is too large. Please choose one under 8MB.';
      return;
    }
 
    if (!this.userId) {
      this.avatarError = 'Your session appears to be invalid. Please log in again.';
      return;
    }
 
    this.isUploadingAvatar = true;
 
    try {
      const resized = await this.resizeImageToSquareDataUrl(file, this.outputSize);
      this.pendingAvatarUrl = resized;
      this.hasPendingAvatarChange = true;
    } catch (err) {
      console.error('Avatar processing failed:', err);
      this.avatarError = 'Could not process that image. Please try a different file.';
    } finally {
      this.isUploadingAvatar = false;
    }
  }
 
  removeAvatarPhoto(): void {
    this.avatarError = '';
    this.pendingAvatarUrl = null;
    this.hasPendingAvatarChange = this.avatarUrl !== null;
  }
 
  private resizeImageToSquareDataUrl(file: File, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Could not read image data.'));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas not supported.'));
            return;
          }
 
          const sourceSize = Math.min(img.width, img.height);
          const sx = (img.width - sourceSize) / 2;
          const sy = (img.height - sourceSize) / 2;
 
          ctx.drawImage(img, sx, sy, sourceSize, sourceSize, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private commitPendingAvatar(): void {
    if (!this.userId || !this.hasPendingAvatarChange) return;
    if (this.pendingAvatarUrl) {
      setAvatar(this.userId, this.pendingAvatarUrl);
      this.avatarUrl = this.pendingAvatarUrl;
      this.service.avatarUrl$.next(this.pendingAvatarUrl);
    } 
    else {
      removeAvatar(this.userId);
      this.avatarUrl = null;
      this.service.avatarUrl$.next(null);
    }
    this.pendingAvatarUrl = undefined;
    this.hasPendingAvatarChange = false;
  }

  onSubmit() {
    this.errorMessage = '';
 
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }
    
    if (!this.userId) {
      this.errorMessage = 'Your session appears to be invalid. Please log in again.';
      this.service.logout();
      return;
    }

    const avatarWasPending = this.hasPendingAvatarChange;

    if (avatarWasPending) {
      this.commitPendingAvatar();
    }

    if (!this.nameChanged) {
      this.successMessage = 'Profile photo updated.';
      setTimeout(() => (this.successMessage = ''), 3000);
      return;
    }
    const newName = this.accountForm.value.name;
    this.isSubmitting = true;
 
    this.service.updateUserName(this.userId, newName).subscribe({
      next: (res: any) => {
        localStorage.setItem('userName', newName);
        this.currentUserName = newName;
        this.service.userName$.next(newName);
        this.isSubmitting = false;
        this.accountForm.markAsPristine();
        this.successMessage = avatarWasPending ? 'Profile updated.' : 'Name updated successfully.';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err: any) => {
        console.error('Update failed:', err);
        this.isSubmitting = false;
        this.errorMessage = avatarWasPending
          ? 'Photo saved, but the name update failed. Please try again.'
          : 'Failed to update name. Please try again.';
        },
      });
    }
  }