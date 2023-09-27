import {Component, OnInit, ElementRef, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {DataService} from '../../data.service';

const MAP_WIDTH = 300000
const MAP_HEIGHT = 300000

@Component({
  selector: 'app-randomiser',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})

export class GamesComponent implements OnInit {

	title = "";
	constructor(private activatedRoute: ActivatedRoute,
				private elementRef: ElementRef,
				private renderer: Renderer2,
				private dataService: DataService) {}
	map_left = 0;
	map_bottom = 0;
	locations: any;
	namedLocations: any = [];
	unnamedLocations: any = [];
	locationsLength = 0;
	namedLocationsLength = 0;
	unnamedLocationsLength = 0;
	chosenLocation: any = {};
	mapSrc = "";
	hasCoordinates = false;

	ngOnInit(): void {
		this.retrieveData();
		const map = this.elementRef.nativeElement.querySelector('.map');
		const mapStyle = getComputedStyle(map);
		const mapWidth = parseFloat(mapStyle.width);
		const ping = this.elementRef.nativeElement.querySelector('.ping');
		const pingStyle = getComputedStyle(ping);
		const leftPixel = parseFloat(pingStyle.left);
		const leftPercentage = (leftPixel / mapWidth);
		const bottomPixel = parseFloat(pingStyle.bottom);
		const bottomPercentage = (bottomPixel / mapWidth);
		this.map_left = MAP_WIDTH * leftPercentage;
		this.map_bottom = MAP_HEIGHT * bottomPercentage;
	}

	retrieveData(): void {
		const game = this.activatedRoute.snapshot.params['game']
		this.dataService.getSubTypeData("games", game).subscribe({
			next: (data) => {
				this.title = data.title;
				this.locations = data.locations;
				this.locationsLength = this.locations.length;
				for (const location in this.locations) {
					if (this.locations[location].isNamed === 1) {
						this.namedLocations.push(this.locations[location]);
						this.namedLocationsLength = this.namedLocations.length;
					} else {
						this.unnamedLocations.push(this.locations[location]);
						this.unnamedLocationsLength = this.unnamedLocations.length;
					}
				}
				this.mapSrc = `http://localhost:3000/images/maps/${game}.jpg`;
				this.hasCoordinates = this.locations[0].x != null;
			},
			error: (error) => {
				console.error('Error fetching data:', error);
			}
		});
	}

	randomise(named: boolean, unnamed: boolean): void {
		let locations;
		let length;
		if (named && unnamed) {
			locations = this.locations;
			length = this.locationsLength;
		} else if (named) {
			locations = this.namedLocations;
			length = this.namedLocationsLength;
		} else if (unnamed) {
			locations = this.unnamedLocations;
			length = this.unnamedLocationsLength;
		} else {
			return;
		}
		this.chosenLocation = locations[Math.floor(Math.random() * length)];
		if (this.hasCoordinates) {
			let bottom = ((this.chosenLocation.location.x + this.map_bottom)
				/ MAP_HEIGHT) * 100
			let left = ((this.chosenLocation.location.y + this.map_left)
				/ MAP_WIDTH) * 100
			const myElement = this.elementRef.nativeElement.querySelector('.ping');
			this.renderer.setStyle(myElement, 'bottom', bottom+'%');
			this.renderer.setStyle(myElement, 'left', left+'%');
		}
	}

	blank(): void {}

}
