import {Component, OnInit, ElementRef, Renderer2} from '@angular/core';
import {DataService} from '../data.service';

const MAP_WIDTH = 300000
const MAP_HEIGHT = 300000

@Component({
  selector: 'app-fortnite',
  templateUrl: './fortnite.component.html',
  styleUrls: ['./fortnite.component.css']
})
export class FortniteComponent implements OnInit {

	constructor(private dataService: DataService,
				private elementRef: ElementRef,
				private renderer: Renderer2) {}
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

	ngOnInit(): void {
		this.getData();
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

	getData(): void {
		this.dataService.getFortniteData()
			.subscribe(
				(data) => {
					this.locations = data.data.pois;
					this.locationsLength = this.locations.length;
					for (const location in this.locations) {
						if (this.locations[location].id.indexOf("UnNamed") !== -1) {
							this.unnamedLocations.push(this.locations[location]);
							this.unnamedLocationsLength = this.unnamedLocations.length;
						} else {
							this.namedLocations.push(this.locations[location]);
							this.namedLocationsLength = this.namedLocations.length;
						}
					}
					this.mapSrc = data.data.images.pois;
				},
				(error) => {
					console.error('Error fetching data:', error);
				}
			);
	}

	button(named: boolean, unnamed: boolean): void {
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
		// do {
		// 	this.chosenLocation = locations[Math.floor(Math.random() * length)];
		// } while (this.chosenLocation.name != "RUMBLE RUINS");
		this.chosenLocation = locations[Math.floor(Math.random() * length)];
		let bottom = ((this.chosenLocation.location.x + this.map_bottom)
			/ MAP_HEIGHT) * 100
		let left = ((this.chosenLocation.location.y + this.map_left)
			/ MAP_WIDTH) * 100
		const myElement = this.elementRef.nativeElement.querySelector('.ping');
		this.renderer.setStyle(myElement, 'bottom', bottom+'%');
		this.renderer.setStyle(myElement, 'left', left+'%');
	}

	blank(): void {}

}
