import { TestBed } from '@angular/core/testing';

import { ApiSimpsonsService } from './api-simpsons.service';

describe('ApiSimpsonsService', () => {
  let service: ApiSimpsonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSimpsonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
