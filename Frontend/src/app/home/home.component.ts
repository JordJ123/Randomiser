import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";

const options = [
	{'url': "games", 'name': "Games"},
	{'url': "movies-and-tv-shows", 'name': "Movies & TV Shows"}
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	constructor(private activatedRoute: ActivatedRoute,
				private dataService: DataService) {}
	currentOption: String = "";
	options: any;

	ngOnInit(): void {
		let option = this.activatedRoute.snapshot.params['option'];
		if (option) {
			this.currentOption = option;
		}
		this.retrieveData();
	}

	retrieveData(): void {
		if (this.currentOption === "") {
			this.options = options;
		} else {
			switch (this.currentOption) {
				case "games":
					this.dataService.getGamesData().subscribe({
						next: (data) => {
							this.options = data
						},
						error: (error) => {
							console.error('Error fetching data:', error);
						}
					});
					break;
				case "movies-and-tv-shows":
					this.dataService.getCategoriesData().subscribe({
						next: (data) => {
							this.options = data
						},
						error: (error) => {
							console.error('Error fetching data:', error);
						}
					});
					break;
			}
		}
	}

}
