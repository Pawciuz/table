import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTableRowComponent } from './edit-table-row.component';

describe('EditTableRowComponent', () => {
  let component: EditTableRowComponent;
  let fixture: ComponentFixture<EditTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTableRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
