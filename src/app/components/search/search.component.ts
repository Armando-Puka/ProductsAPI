import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ProductsService } from '../../services/products.service';

import { ProductApi } from '../../interfaces/products';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
	selector: 'app-search',
	standalone: true,
	imports: [
		RouterModule,
		ButtonModule,
		InputTextModule,
		IconFieldModule,
		InputIconModule,
	],
	templateUrl: './search.component.html',
	styleUrl: './search.component.scss',
})
export class SearchComponent implements OnDestroy {
	route = inject(ActivatedRoute);
	router = inject(Router);
	productService = inject(ProductsService);

	private destroy$ = new Subject<void>();

	searchResult: undefined | ProductApi;

	submitSearch(query: string) {
		console.log(query);
		this.productService
			.searchProduct(query)
			.pipe(takeUntil(this.destroy$))
			.subscribe();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		console.log('SearchComponent Unsubscribed');
	}
}
