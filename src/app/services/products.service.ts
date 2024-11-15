import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, map, Observable, tap } from 'rxjs';

import { Product, ProductApi } from '../interfaces/products';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    http = inject(HttpClient);
    router = inject(Router);

    products = new BehaviorSubject<Product[]>([]);

    productsApi = 'https://dummyjson.com/products';

    isLoading: boolean = false;
    noSearch: boolean = false;

    getProductData(): Observable<ProductApi> {
        return this.http.get<ProductApi>(this.productsApi);
    }

    getSingleProductData(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.productsApi}/${id}`);
    }

    getCategories(): Observable<string[]> {
        return this.http
            .get<ProductApi>(`${this.productsApi}?limit=100`)
            .pipe(
                map((results) => [
                    ...new Set(
                        results.products.map((product) => product.category)
                    ),
                ])
            );
    }

    getTags(): Observable<string[]> {
        return this.http.get<ProductApi>(`${this.productsApi}?limit=100`).pipe(
            map((results) => {
                const allTags = results.products.flatMap(
                    (product) => product.tags
                );
                return Array.from(new Set(allTags));
            })
        );
    }

    populatedSelectInput(): Observable<ProductApi> {
        return this.http.get<ProductApi>(`${this.productsApi}`);
    }

    searchProduct(query: string): Observable<ProductApi> {
        this.noSearch = true;
        this.isLoading = true;
        return this.http
            .get<ProductApi>(`${this.productsApi}/search?q=${query}`)
            .pipe(
                tap((result) => {
                    this.isLoading = false;
                    this.products.next(result.products);
                })
            );
    }

    filterProducts(
        limit: number,
        skip: number,
        multiSelect: string[]
    ): Observable<ProductApi> {
        this.noSearch = true;
        this.isLoading = true;
        return this.http
            .get<ProductApi>(
                `${
                    this.productsApi
                }/?limit=${limit}&skip=${skip}&select=${multiSelect.join(',')}`
            )
            .pipe(
                tap((result) => {
                    this.isLoading = false;
                    this.products.next(result.products);
                })
            );
    }

    addProduct(newProduct: Product): Observable<Product> {
        return this.http.post<Product>(
            'https://dummyjson.com/products/add',
            newProduct,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    updateProduct(
        product: Product,
        id: number | undefined
    ): Observable<Product> {
        if (!id) {
            console.log('Product ID is required for updating');
        }

        return this.http.put<Product>(
            `https://dummyjson.com/products/${id}`,
            product,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    deleteProduct(id: number | undefined) {
        if (!id) {
            console.log('Product ID is required for deleting');
        }

        return this.http.delete<Product>(
            `https://dummyjson.com/products/${id}`
        );
    }
}
