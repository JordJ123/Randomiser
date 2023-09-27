import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamesComponent } from './randomiser/games/games.component';
import { HomeComponent } from "./home/home.component";
import {MtvComponent} from "./randomiser/mtv/mtv.component";

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: ':option', component: HomeComponent },
	{ path: 'games/:game', component: GamesComponent },
	{ path: 'movies-and-tv-shows/:category', component: MtvComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
