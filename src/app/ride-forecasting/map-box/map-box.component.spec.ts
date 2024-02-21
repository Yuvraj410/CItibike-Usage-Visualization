import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RideMapBoxComponent } from "./map-box.component";

describe("MapBoxComponent", () => {
  let component: RideMapBoxComponent;
  let fixture: ComponentFixture<RideMapBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RideMapBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RideMapBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
