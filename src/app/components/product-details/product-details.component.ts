import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { ProductsService } from '../../services/products.service';

import { Product } from '../../interfaces/products';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';

@Component({
	selector: 'app-product-details',
	standalone: true,
	imports: [RouterModule, CommonModule, ProgressSpinnerModule, TableModule],
	templateUrl: './product-details.component.html',
	styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
	route = inject(ActivatedRoute);
	productData = inject(ProductsService);

	isLoading$ = new BehaviorSubject<boolean>(true);
	id = Number(this.route.snapshot.paramMap.get('id'));
	product$: Observable<Product> = this.productData
		.getSingleProductData(this.id)
		.pipe(
			map((res) => {
				this.isLoading$.next(false);
				return res;
			})
		);
}
