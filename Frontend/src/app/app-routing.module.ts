import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RandomiserComponent } from './game/randomiser.component';
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: ':type', component: HomeComponent },
	{ path: ':type/:subtype', component: RandomiserComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
