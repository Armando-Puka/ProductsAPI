import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { ProductsService } from '../../services/products.service';
import { ProductIdService } from '../../services/product-id.service';

import { SearchComponent } from '../search/search.component';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [
		RouterModule,
		ReactiveFormsModule,
		AutoCompleteModule,
		ButtonModule,
		SearchComponent,
	],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
	route = inject(ActivatedRoute);
	router = inject(Router);
	productService = inject(ProductsService);
	productIdService = inject(ProductIdService);

	private destroy$ = new Subject<void>();

	productId: number | null = null;

	ngOnInit(): void {
		this.productIdService.productId$
			.pipe(takeUntil(this.destroy$))
			.subscribe((id) => {
				this.productId = id;
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		console.log('HeaderComponent Unsubscribed');
	}
}
