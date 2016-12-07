import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './components/main/main';
import { TimeFltersComponent } from './components/filter/filter';
import { LoadData } from './services/http.service';


@NgModule({
  declarations: [
    AppComponent,
    TimeFltersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule
  ],
  providers: [LoadData],
  bootstrap: [AppComponent]
})
export class AppModule { }
