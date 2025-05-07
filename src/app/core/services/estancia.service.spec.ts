import { TestBed } from '@angular/core/testing';

import { EstanciaService } from './estancia.service';

describe('EstanciaService', () => {
  let service: EstanciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstanciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
