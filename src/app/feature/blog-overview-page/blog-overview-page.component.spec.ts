import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogOverviewPageComponent } from './blog-overview-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { RouterTestingModule } from '@angular/router/testing'; // Optional, falls Router benötigt wird

describe('BlogOverviewPageComponent', () => {
  let component: BlogOverviewPageComponent;
  let fixture: ComponentFixture<BlogOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Hinzufügen von HttpClientTestingModule
        RouterTestingModule, // Optional falls Routing genutzt wird
        BlogOverviewPageComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
