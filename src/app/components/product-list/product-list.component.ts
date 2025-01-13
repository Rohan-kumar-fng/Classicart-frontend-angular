import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number | undefined = 1;
  previousCategoryId: number | undefined = 1;
  searchMode: boolean = false;
  searchText: string | null = '';

  // Add new varibale to support pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  
  constructor(private productService: ProductService, private route: ActivatedRoute) { } // Here Activated Route is used for routing

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleListProduct(); // Whenever changes or route being clicked as it is subscribed
    })
    // this.listProducts();
  }

  handleListProduct(){
    const searchMode: boolean = this.route.snapshot.paramMap.has('keyword');
    if(searchMode){
      this.searchListProducts();
    } else{
      this.listProducts();
    }
  }

  listProducts() {

    // check if "id" parameter is availbable
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
    if(hasCategoryId){
      // get the category Id and retrive that data
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id')); // I typecast String into number
      // this.currentCategory = +this.route.snapshot.paramMap.get('id'); // Also use this
    } else{
      // taking the default category id
      this.currentCategoryId = 1;
    }

    // Check if we are changingnt the category id from the side bar, we can reset the pageto 1
    if(this.previousCategoryId !== this.currentCategoryId){
      this.thePageNumber = 1;
    }

    console.log("Current Category ID = " + this.currentCategoryId + " Curretn PAge = " + this.thePageNumber);

    this.previousCategoryId = this.currentCategoryId;
    this.productService.getProductListPagination(this.thePageNumber-1,this.thePageSize,this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    )
  }

  searchListProducts(){
    this.searchText = this.route.snapshot.paramMap.get('keyword');

    console.log("Searched Text is = " + this.searchText + " Curretn PAge = " + this.thePageNumber);
    this.productService.getSearchedProductListPagination(this.thePageNumber-1,this.thePageSize,this.searchText).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    )
  }

}
