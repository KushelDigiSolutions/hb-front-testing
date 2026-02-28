import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHealthConcernComponent } from './share-health-concern.component';

describe('ShareHealthConcernComponent', () => {
  let component: ShareHealthConcernComponent;
  let fixture: ComponentFixture<ShareHealthConcernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareHealthConcernComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareHealthConcernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
