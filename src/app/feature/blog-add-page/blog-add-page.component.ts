import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../core/header/header.component';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';
import { NewBlogEntry } from '../../core/model/blog-entry';

@Component({
  selector: 'app-blog-add-page',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatFormField,
    MatCard,
    MatError,
    MatLabel,
    MatCardTitle,
    MatInputModule,
    MatIcon,
    MatLabel,
    MatButton,
  ],
  templateUrl: './blog-add-page.component.html',
  styleUrl: './blog-add-page.component.scss',
  standalone: true,
})
export class BlogAddPageComponent {
  blogForm: FormGroup;
  //  selectedFile: string | null = null;
  // fileError: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  blogBackendService = inject(BlogBackendService);

  constructor(private fb: FormBuilder) {
    const randomId = Math.floor(Math.random() * 1084) + 1;
    const defaultUrl = `https://picsum.photos/id/${randomId}/800/200`;
    this.imagePreview = defaultUrl;

    this.blogForm = this.fb.group({
      // file: [null],
      picUrl: [
        defaultUrl,
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([\w\-.]+)+(:\d+)?(\/[\w-]*)*\/?$/,
          ),
        ],
      ],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.blogForm.get('picUrl')?.valueChanges.subscribe((value: string) => {
      if (value) {
        this.imagePreview = value;
      }
    });
  }

  /*
      onSubmit(): void {
        if (this.blogForm.valid) {
          const formData = new FormData();
          formData.append('title', this.blogForm.get('title')?.value);
          formData.append('content', this.blogForm.get('content')?.value);
          formData.append('headerImageUrl', this.blogForm.get('picUrl')?.value);

          const file = this.blogForm.get('file')?.value;
          if (file) {
            formData.append('file', file);
          }

          this.blogBackendService.createBlogEntry(formData).subscribe({
            next: (response) => {
              console.log('Blog entry successfully created:', response);
            },
            error: (err) => {
              console.error('Error when creating the blog entry:', err);
            },
          });
        }
      }
    */

  onSubmit(): void {
    if (this.blogForm.valid) {
      const payload: NewBlogEntry = {
        title: this.blogForm.get('title')?.value,
        content: this.blogForm.get('content')?.value,
        headerImageUrl: this.blogForm.get('picUrl')?.value,
      };
      /*
              const file = this.blogForm.get('file')?.value;
                  if (file) {
                    formData.append('file', file);
                  }
            */

      this.blogBackendService.createBlogEntry(payload).subscribe({
        next: (response) => {
          console.log('Blog entry successfully created:', response);
        },
        error: (err) => {
          console.error('Error when creating the blog entry:', err);
        },
      });
    }
  }

  resetForm(): void {
    const randomId = Math.floor(Math.random() * 1084) + 1;
    const defaultUrl = `https://picsum.photos/id/${randomId}/800/200`;

    this.blogForm.reset({
      picUrl: defaultUrl,
      title: '',
      content: '',
    });
    this.imagePreview = defaultUrl; // Optional, falls ein Bildvorschau zurückgesetzt werden soll
  }

  /*
      onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          this.selectedFile = file.name;

          if (!file.type.startsWith('image/')) {
            this.fileError = 'Bitte wählen Sie eine gültige Bilddatei aus.';
            this.selectedFile = null;
            return;
          }
          // Erstellen der Bildvorschau
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = reader.result;
          };
          reader.readAsDataURL(file);
        }
      }
    */
}
