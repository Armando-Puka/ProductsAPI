import {
	Component,
	EventEmitter,
	inject,
	Input,
	OnDestroy,
	Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { ProductsService } from '../../services/products.service';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';

interface Column {
	field: string;
	header: string;
}

@Component({
	selector: 'app-filter',
	standalone: true,
	imports: [
		RouterModule,
		ReactiveFormsModule,
		MultiSelectModule,
		ButtonModule,
		InputNumberModule,
	],
	templateUrl: './filter.component.html',
	styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnDestroy {
	productService = inject(ProductsService);
	@Input() preselectedFilterValues: Column[] = [];
	@Output() filterChange = new EventEmitter<string[]>();

	private destroy$ = new Subject<void>();

	filterKeys: { prop: string }[] = [];

	filterGroup: FormGroup = new FormGroup({
		filter: new FormControl<string[] | null>(null),
		skip: new FormControl<number | null>(1),
		limit: new FormControl<number | null>(5),
	});

	ngOnInit() {
		this.productService
			.populatedSelectInput()
			.pipe(takeUntil(this.destroy$))
			.subscribe((data) => {
				this.filterKeys = Object.keys(data.products[0]).map((key) => ({
					prop: key,
					disabled: !!this.preselectedFilterValues.find(
						(item) => item.field === key
					),
				}));
			});

		this.filterGroup.controls['filter'].setValue(
			this.preselectedFilterValues.map((column) => column.field)
		);
	}

	onFilterProducts() {
		let filterControls = {
			limit: this.filterGroup.controls['limit'].value,
			skip: this.filterGroup.controls['skip'].value,
			filter: this.filterGroup.controls['filter'].value,
		};
		this.productService
			.filterProducts(
				filterControls.limit,
				filterControls.skip,
				filterControls.filter
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.filterChange.emit(filterControls.filter);
			});

		console.log('filterControls Object: ', filterControls);
		console.log('Limit: ', filterControls.limit);
		console.log('Skip: ', filterControls.skip);
		console.log('Filter: ', filterControls.filter);
		console.log(
			'Product Service Function: ',
			this.productService.filterProducts(
				filterControls.limit,
				filterControls.skip,
				filterControls.filter
			)
		);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		console.log('FilterComponent Unsubscribed');
	}
}
