import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	constructor(private dataService: DataService) {}
	games: any;

	ngOnInit(): void {
		this.getData();
	}

	getData(): void {
		this.dataService.getGamesData().subscribe({
			next: (data) => {
				this.games = data
			},
			error: (error) => {
				console.error('Error fetching data:', error);
			}
		});
	}

}
