import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { map, Observable, Subject, takeUntil } from 'rxjs';

import { ProductsService } from '../../services/products.service';

import { Product } from '../../interfaces/products';

import { FilterComponent } from '../filter/filter.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

interface Column {
	field: string;
	header: string;
}

@Component({
	selector: 'app-product-list',
	standalone: true,
	imports: [
		FormsModule,
		CommonModule,
		RouterModule,
		FilterComponent,
		ProgressSpinnerModule,
		TableModule,
		ChipModule,
		ImageModule,
		RatingModule,
		EmptyStateComponent,
		ButtonModule,
	],
	templateUrl: './product-list.component.html',
	styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
	private http = inject(HttpClient);
	private router = inject(Router);
	protected productService = inject(ProductsService);

	private destroy$ = new Subject<void>();

	noFilterResults: boolean = false;

	productsApi = 'https://dummyjson.com/products';
	productList: Product[] = [];

	product$: Observable<Product[]> = this.productService.products.pipe(
		map((list) =>
			list.map((product) => ({
				...product,
				ratingAverage:
					product.reviews?.reduce((accumulator, currentValue) => {
						accumulator += currentValue.rating;
						return accumulator;
					}, 0) / product.reviews?.length,
			}))
		)
	);

	cols: Column[] = [
		{ field: 'id', header: 'ID' },
		{ field: 'title', header: 'Title' },
		{ field: 'category', header: 'Category' },
		{ field: 'price', header: 'Price' },
		{ field: 'tags', header: 'Tags' },
		{ field: 'reviews', header: 'Avg. Review' },
	];

	ngOnInit() {
		this.product$.pipe(takeUntil(this.destroy$)).subscribe((products) => {
			this.noFilterResults = products.length > 0;
		});
	}

	onFilterChange(columns: string[]) {
		columns.forEach((column) => {
			if (this.cols.every((columns) => columns.field !== column)) {
				this.cols.push({ field: column, header: column });
			}
		});

		this.cols = this.cols.filter((column) =>
			columns.includes(column.field)
		);
	}

	navigateToAddProduct() {
		this.router.navigate(['/products/add']);
	}

	viewProduct(product: Product): void {
		this.router.navigate(['/product', product.id]);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		console.log('ProductListComponent Unsubscribed');
	}
}
