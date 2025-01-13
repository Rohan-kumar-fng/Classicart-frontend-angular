import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) { }

  getProductList(Id: number): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(this.baseUrl+"products/search/findByCategoryId?id="+Id).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductListPagination(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
    const searchURL = this.baseUrl +  "products/search/findByCategoryId?id=" + categoryId + "&page=" + page + "&size=" + pageSize;
    return this.httpClient.get<GetResponseProducts>(searchURL).pipe(
      map(response => response) // here changes the value 
    );
  }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.baseUrl+"product-category").pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getSearchedProductList(searchText: string | null): Observable<Product[]> {
    const searchURL: string = this.baseUrl + "products/search/findByNameContaining?name=" + searchText;
    return this.httpClient.get<GetResponseProducts>(searchURL).pipe(
      map(response => response._embedded.products)
    );
  }

  getSearchedProductListPagination(page: number, pageSize: number,searchText: string | null): Observable<GetResponseProducts> {
    const searchURL: string = this.baseUrl + "products/search/findByNameContaining?name=" + searchText + "&page=" + page + "&size=" + pageSize;
    return this.httpClient.get<GetResponseProducts>(searchURL).pipe(
      map(response => response)
    );
  }

  getProductDetails(productId: number): Observable<Product>{
    const productIdURL = this.baseUrl + "products/" + productId;
    return this.httpClient.get<Product>(productIdURL);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}