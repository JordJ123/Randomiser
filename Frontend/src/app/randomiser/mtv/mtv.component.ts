import {Component, OnInit, ElementRef, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {DataService} from '../../data.service';

@Component({
  selector: 'app-randomiser',
  templateUrl: './mtv.component.html',
  styleUrls: ['./mtv.component.css']
})

export class MtvComponent implements OnInit {

	name = "";
	constructor(private activatedRoute: ActivatedRoute,
				private dataService: DataService) {}
	moviesTVShows: any;
	moviesTVShowsLength = 0;
	chosenMovieTVShow: any = {};
	isTVShow: boolean = false;

	ngOnInit(): void {
		this.retrieveData();
	}

	retrieveData(): void {
		const category = this.activatedRoute.snapshot.params['category']
		this.dataService.getCategoryData(category).subscribe({
			next: (data) => {
				this.name = data.name;
				this.moviesTVShows = data.movies.concat(data.tvShows);
				console.log(this.moviesTVShows)
				this.moviesTVShowsLength = this.moviesTVShows.length;
			},
			error: (error) => {
				console.error('Error fetching data:', error);
			}
		});
	}

	randomise(): void {
		let moviesTVShows = this.moviesTVShows;
		let length = this.moviesTVShowsLength;
		this.chosenMovieTVShow = moviesTVShows[
			Math.floor(Math.random() * length)];
		this.isTVShow = !!this.chosenMovieTVShow.season;
	}

	blank(): void {}

}
