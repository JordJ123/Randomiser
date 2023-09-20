import {Component, OnInit, ElementRef, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {DataService} from '../../data.service';

@Component({
  selector: 'app-randomiser',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})

export class MoviesComponent implements OnInit {

	name = "";
	constructor(private activatedRoute: ActivatedRoute,
				private dataService: DataService) {}
	movies: any;
	moviesLength = 0;
	chosenMovie: any = {};

	ngOnInit(): void {
		this.getData();
	}

	getData(): void {
		const subtype = this.activatedRoute.snapshot.params['subtype']
		this.dataService.getSubTypeData("movies", subtype).subscribe({
			next: (data) => {
				this.name = data.name;
				this.movies = data.movies;
				this.moviesLength = this.movies.length;
			},
			error: (error) => {
				console.error('Error fetching data:', error);
			}
		});
	}

	randomise(): void {
		let movies = this.movies;
		let length = this.moviesLength;
		this.chosenMovie = movies[Math.floor(Math.random() * length)];
	}

	blank(): void {}

}
