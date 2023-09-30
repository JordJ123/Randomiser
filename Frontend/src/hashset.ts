import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export abstract class HashSet {

	private items: Map<string, any> = new Map();

	get(index: number): any {
		return this.toArray()[index];
	}

	add(item: any) {
		const key = this.getKey(item);
		console.log(key)
		this.items.set(key, item);
	}

	remove(item: any) {
		const key = this.getKey(item);
		this.items.delete(key)
	}

	has(item: any): boolean {
		const key = this.getKey(item);
		return this.items.has(key);
	}

	length(): number {
		return this.items.size;
	}

	toArray(): any[] {
		return Array.from(this.items.values());
	}

	abstract getKey(item: any): string;

}
