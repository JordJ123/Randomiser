import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FortniteComponent } from './fortnite/fortnite.component';

const routes: Routes = [
	{ path: 'fortnite', component: FortniteComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
