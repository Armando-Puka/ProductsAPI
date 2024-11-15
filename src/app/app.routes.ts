import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchComponent } from './components/search/search.component';
import { NewProductComponent } from './components/new-product/new-product.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'products/add', component: NewProductComponent },
    { path: 'product/:id', component: NewProductComponent },
    { path: '**', redirectTo: '' },
];

// export const AppRoutingModule = RouterModule.forRoot(routes);
