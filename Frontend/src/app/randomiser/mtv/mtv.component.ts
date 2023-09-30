import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {DataService} from '../../data.service';
import {HashSet} from "../../../hashset";

@Component({
  selector: 'app-randomiser',
  templateUrl: './mtv.component.html',
  styleUrls: ['./mtv.component.css']
})

export class MtvComponent implements OnInit {

	name = "";
	url = "";
	constructor(private activatedRoute: ActivatedRoute,
				private dataService: DataService) {}
	moviesTVShows: WatchMultimediaHashSet = new WatchMultimediaHashSet();
	chosenMovieTVShow: any = {};
	isTVShow: boolean = false;
	overallHistory = new Map();
	history: WatchMultimediaHashSet = new WatchMultimediaHashSet();

	ngOnInit(): void {
		this.url = this.activatedRoute.snapshot.params['category'];
		this.setHistory();
		this.retrieveData();
	}

	setHistory(): void {
		let json = localStorage.getItem('mtv');
		if (json) {
			this.overallHistory = new Map(JSON.parse(json));
			let array: any = this.overallHistory.get(this.url);
			array.forEach((item: TVShow) => {
				if (item instanceof Movie) {
					this.history.add(item as Movie);
				} else {
					this.history.add(item as TVShow)
				}
			})
		}
	}

	retrieveData(): void {
		this.dataService.getCategoryData(this.url).subscribe({
			next: (data) => {
				this.name = data.name;
				data.movies.forEach((movie: Movie) => {
					if (!(this.history.has(movie))) {
						this.moviesTVShows.add(movie as Movie)
					}
				});
				data.tvShows.forEach((tvShow: TVShow) => {
					if (!(this.history.has(tvShow))) {
						this.moviesTVShows.add(tvShow as TVShow)
					}
				});
			},
			error: (error) => {
				console.error('Error fetching data:', error);
			}
		});
	}

	randomise(): void {
		if (this.moviesTVShows.length() > 0) {
			this.chosenMovieTVShow = this.moviesTVShows.get(
				Math.floor(Math.random() * this.moviesTVShows.length()));
			this.isTVShow = this.chosenMovieTVShow.season;
			this.moviesTVShows.remove(this.chosenMovieTVShow);
			this.history.add(this.chosenMovieTVShow);
			let save = JSON.stringify(Array.from(this.overallHistory.set(
				this.url, this.history.toArray()).entries()));
			localStorage.setItem('mtv', save);
		} else {
			this.chosenMovieTVShow = new TVShow("n/a", 1, 1, "");
			this.isTVShow = false;
		}

	}

}

abstract class WatchMultimedia {

	title: string = "";

	constructor(title: string) {
		this.title = title;
	}

}

class Movie extends WatchMultimedia {

    override toString(): string {
		return `title is ${this.title}`;
	}

}

class TVShow extends WatchMultimedia  {

    season: number = -1;
    episode_number: number = -1;
    episode_name: string = "";

    constructor(title: string, season: number, episode_number: number,
                episode_name: string) {
        super(title)
        this.season = season;
        this.episode_number = episode_number;
        this.episode_name = episode_name;
    }

    override toString(): string {
        return `title is ${this.title}, season is ${this.season}, ` +
            `episode is ${this.episode_number}`;
    }

}

class WatchMultimediaHashSet extends HashSet {

    getKey(item: any): string {
        if (!(item.season)) {
			return new Movie(item.title).toString();
		} else {
			let tv = item as TVShow;
            return new TVShow(tv.title, tv.season, tv.episode_number,
				tv.episode_name).toString();
		}
    }

}
