import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";

const types = [
	{'url': "games", 'title': "Games"},
	{'url': "movies", 'title': "Movies"}
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

	constructor(private activatedRoute: ActivatedRoute,
				private dataService: DataService) {}
	type: String = "";
	options: any;

	ngOnInit(): void {
		let type = this.activatedRoute.snapshot.params['type'];
		if (type) {
			this.type = type;
		}
		this.getData();
	}

	getData(): void {
		if (this.type === "") {
			this.options = types;
		} else {
			this.dataService.getTypeData(this.type).subscribe({
				next: (data) => {
					this.options = data
				},
				error: (error) => {
					console.error('Error fetching data:', error);
				}
			});
		}
	}

}
