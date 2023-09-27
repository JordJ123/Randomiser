import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class DataService {

	constructor(private http: HttpClient) {}

	getCategoriesData(): Observable<any> {
		return this.http.get<any>(`http://localhost:3000/categories`);
	}

	getCategoryData(category: String): Observable<any> {
		return this.http.get<any>(
			`http://localhost:3000/categories/${category}`);
	}

	getGamesData(): Observable<any> {
		return this.http.get<any>(`http://localhost:3000/games`);
	}

	getSubTypeData(type: String, subtype: String): Observable<any> {
		return this.http.get<any>(
			`http://localhost:3000/${type}/${subtype}`);
	}

}
