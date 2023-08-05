import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import { FortniteComponent } from './fortnite/fortnite.component';

@NgModule({
	declarations: [
		AppComponent,
  		FortniteComponent
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		CommonModule,
		FormsModule,
		HttpClientModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
