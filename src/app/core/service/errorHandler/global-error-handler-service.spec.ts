import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler-service';

describe('GlobalErrorHandlerServicee', () => {
  let service: GlobalErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
