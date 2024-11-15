import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { ProductsService } from '../../services/products.service';
import { ProductIdService } from '../../services/product-id.service';

import { Product } from '../../interfaces/products';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

interface AutoCompleteCompleteEvent {
	originalEvent: Event;
	query: string;
}

@Component({
	selector: 'app-new-product',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FloatLabelModule,
		InputTextModule,
		InputTextareaModule,
		DropdownModule,
		InputNumberModule,
		AutoCompleteModule,
		ButtonModule,
	],
	templateUrl: './new-product.component.html',
	styleUrl: './new-product.component.scss',
})
export class NewProductComponent implements OnInit, OnDestroy {
	productService = inject(ProductsService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	productIdSource = inject(ProductIdService);

	private destroy$ = new Subject<void>();

	productId: number | undefined;

	suggestions: { name: string; value: string }[] = [];
	productTags: string[] = [];
	filteredTags: string[] = [];

	productForm: FormGroup = new FormGroup({
		title: new FormControl<string | null>(null, Validators.required),
		description: new FormControl<string | null>(null, Validators.required),
		category: new FormControl<string | null>(null, Validators.required),
		price: new FormControl<number | null>(null, [
			Validators.required,
			Validators.min(1),
		]),
		discountPercentage: new FormControl<number | null>(null, [
			Validators.required,
			Validators.min(0),
		]),
		stock: new FormControl<number | null>(null, [
			Validators.required,
			Validators.min(1),
			Validators.max(100)
		]),
		tags: new FormControl<string[] | null>(null, Validators.required),
		sku: new FormControl<string | null>(null, [
			Validators.required,
			Validators.pattern('^[A-Z0-9]+$'),
		]),
	});

	ngOnInit(): void {
		this.productService
			.getCategories()
			.pipe(takeUntil(this.destroy$))
			.subscribe((categories) => {
				this.suggestions = categories.map((category) => ({
					name: category
						.replace(/-/, ' ')
						.replace(/\b\w/g, (cate) => cate.toUpperCase()),
					value: category,
				}));
			});

		this.productService
			.getTags()
			.pipe(takeUntil(this.destroy$))
			.subscribe((tags) => {
				this.productTags = tags;
			});

		this.productId = Number(this.route.snapshot.paramMap.get('id'));

		if (this.productId) {
			this.productService
				.getSingleProductData(Number(this.productId))
				.pipe(takeUntil(this.destroy$))
				.subscribe((product) => {
					this.populateForm(product);
				});
			this.productIdSource.setProductId(this.productId);
		}
	}

	populateForm(product: Product) {
		this.productForm.patchValue({
			title: product.title,
			description: product.description,
			category: product.category,
			price: product.price,
			discountPercentage: product.discountPercentage,
			stock: product.stock,
			tags: product.tags,
			sku: product.sku,
		});
	}

	searchTags(event: any) {
		const query = event.query.toLowerCase();
		this.filteredTags = this.productTags.filter((tag) =>
			tag.toLowerCase().includes(query)
		);
	}

	addNewProduct() {
		if (this.productForm.valid) {
			const newProduct: Product = {
				...this.productForm.value,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			console.log('Console Log: ', newProduct);
			this.productService
				.addProduct(newProduct)
				.pipe(takeUntil(this.destroy$))
				.subscribe((response) => {
					console.log('Subscription: ', response);
				});
			this.productForm.reset();
			this.router.navigate(['']);
		} else {
			this.productForm.markAllAsTouched();
			console.log('All field are required');
			return;
		}
	}

	updateProduct() {
		if (
			this.productForm.valid &&
			this.productId !== null &&
			this.productId !== undefined
		) {
			const updatedPost = {
				...this.productForm.value,
				id: this.productId,
			};
			console.log('Updated Post: ', updatedPost);
			this.productService
				.updateProduct(updatedPost, this.productId)
				.pipe(takeUntil(this.destroy$))
				.subscribe((response) => {
					console.log('Update Post Subscription: ', response);
				});

			this.router.navigate(['']);
		} else if (this.productForm.invalid) {
			this.productForm.markAllAsTouched();
			console.log('All fields are required.');
			return;
		}
	}

	deleteProduct() {
		this.productService.deleteProduct(this.productId);
		this.router.navigate(['']);
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
		console.log('NewProductComponent Unsubscribed');
	}
}
