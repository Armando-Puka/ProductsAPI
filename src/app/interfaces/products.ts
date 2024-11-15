export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    stock: number;
    tags: string[];
    sku: string;
    reviews: { rating: number }[];
    ratingAverage: number;
}

export interface ProductApi {
    products: Product[];
    skip: number;
    total: number;
    limit: number;
}
