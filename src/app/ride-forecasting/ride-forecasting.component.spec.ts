import { TestBed, async } from "@angular/core/testing";
import { RideForecastingComponent } from "./ride-forcasting.component";

describe("RideForecastingComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RideForecastingComponent],
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(RideForecastingComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Citi-Bike'`, () => {
    const fixture = TestBed.createComponent(RideForecastingComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("Citi-Bike");
  });

  it("should render title in a h1 tag", () => {
    const fixture = TestBed.createComponent(RideForecastingComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain(
      ""
    );
  });
});
