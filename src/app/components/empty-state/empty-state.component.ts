import { Component, inject, Input } from '@angular/core';

import { ProductsService } from '../../services/products.service';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
	selector: 'app-empty-state',
	standalone: true,
	imports: [ProgressSpinnerModule],
	templateUrl: './empty-state.component.html',
	styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
	protected productService = inject(ProductsService);

	@Input() message: string = '';
}
