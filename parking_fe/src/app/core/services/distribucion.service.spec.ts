import { TestBed } from '@angular/core/testing';

import { DistribucionService } from './distribucion.service';

describe('DistribucionService', () => {
  let service: DistribucionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistribucionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
