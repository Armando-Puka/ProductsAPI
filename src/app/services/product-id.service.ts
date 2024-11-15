import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductIdService {
    private productIdSource = new Subject<number | null>();
    productId$ = this.productIdSource.asObservable();

    setProductId(id: number) {
        this.productIdSource.next(id);
    }
}
