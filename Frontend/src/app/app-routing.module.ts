import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamesComponent } from './randomiser/games/games.component';
import { HomeComponent } from "./home/home.component";
import {MoviesComponent} from "./randomiser/movies/movies.component";

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: ':type', component: HomeComponent },
	{ path: 'games/:subtype', component: GamesComponent },
	{ path: 'movies/:subtype', component: MoviesComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
