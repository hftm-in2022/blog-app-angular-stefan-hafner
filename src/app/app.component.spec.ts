// app.component.spec.ts oder die Testdatei für AppComponent
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BlogBackendService } from './core/service/blogBackend/blog-backend.service'; // Beispielhaft

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Weitere Module oder Standalone-Imports, falls notwendig
      ],
      providers: [
        provideHttpClient(), // HttpClient bereitstellen
        BlogBackendService, // Falls der Service auch direkt benötigt wird
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Weitere Tests ...
});
