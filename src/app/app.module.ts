import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { NgZorroAntdModule, NZ_I18N, zh_CN } from "ng-zorro-antd";
import { registerLocaleData } from "@angular/common";
import zh from "@angular/common/locales/zh";
import { RouterModule, Routes } from "@angular/router";
import { RideForecastingComponent } from "./ride-forecasting/ride-forcasting.component";
import { RideMapBoxComponent } from "./ride-forecasting/map-box/map-box.component";
import { GraphComponent } from "./ride-forecasting/graph/graph.component";

registerLocaleData(zh);

const appRoutes: Routes = [
  { path: "ride-forecasting", component: RideForecastingComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RideMapBoxComponent,
    GraphComponent,
    RideForecastingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgZorroAntdModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } 
    ),
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent],
})
export class AppModule {}
