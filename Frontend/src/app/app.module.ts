import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {AppComponent} from './app/app.component';
import { GamesComponent } from './randomiser/games/games.component';
import { HomeComponent } from './home/home.component';
import {MtvComponent} from "./randomiser/mtv/mtv.component";
@NgModule({
	declarations: [
		AppComponent,
  		GamesComponent,
    	HomeComponent,
     	MtvComponent
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
