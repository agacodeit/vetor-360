import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ImageUploadService } from './image-upload.service';

describe('ImageUploadService', () => {
  let service: ImageUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImageUploadService,
        provideHttpClient()
      ]
    });
    service = TestBed.inject(ImageUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
