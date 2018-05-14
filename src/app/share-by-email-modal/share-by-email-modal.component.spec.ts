import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareByEmailModalComponent } from './share-by-email-modal.component';

describe('ShareByEmailModalComponent', () => {
  let component: ShareByEmailModalComponent;
  let fixture: ComponentFixture<ShareByEmailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareByEmailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareByEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
