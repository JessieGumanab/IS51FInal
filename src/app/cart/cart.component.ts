import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { IUser } from '../login/login.component';
import { Cart } from '../cart/cart.model';
import { LocalStorageService } from '../localStorageService';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  carts: Array<Cart> = [];
  cartParams = '';
  localStorageService: LocalStorageService<Cart>;
  currentUser: IUser;

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.localStorageService = new LocalStorageService('carts');
  }

  async ngOnInit() {
    const currentUser = this.localStorageService.getItemsFromLocalStorage('user');
    if (currentUser == null) {
      this.router.navigate(['login']);

    }

    this.loadCarts();
    this.activatedRoute.params.subscribe((data: IUser) => {
      console.log('data passed from login component this component', data);
      this.currentUser = data;
    });
  }
  async loadCarts() {
    const savedCarts = this.getItemsFromLocalStorage('carts');
    if (savedCarts && savedCarts.length > 0) {
      this.carts = savedCarts;
    } else {
      this.carts = await this.loadItemsFromFile();
    }
    this.sortByID(this.carts);

  }

  async loadItemsFromFile() {
    const data = await this.http.get('assets/inventory.json').toPromise();

    return data.json();
  }

  addCart() {
    this.carts.unshift(new Cart({
      id: null,
      description: null,
      price: null,
      quantity: null,
    }));

  }

  deleteCart(index: number) {

    this.carts.splice(index, 1);
    this.saveItemsToLocalStorage(this.carts);
  }

  saveCart(cart: any) {
    let hasError = false;
    Object.keys(cart).forEach((key: any) => {
      if (cart[key] == null) {
        hasError = true;
        this.toastService.showToast('danger', 2000, `Saved Failed! property ${key} must not be null!`);
      }
    });
    if (!hasError) {
      cart.editing = false;
      this.saveItemsToLocalStorage(this.carts);
    }
  }

  saveItemsToLocalStorage(carts: Array<Cart>) {
    carts = this.sortByID(carts);
    return this.localStorageService.saveItemsToLocalStorage(carts);
    // const savedcarts = localStorage.setItem('carts', JSON.stringify(carts));
    // return savedcarts;
  }

  getItemsFromLocalStorage(key: string) {
    // const savedcarts = JSON.parse(localStorage.getItem(key));
    return this.localStorageService.getItemsFromLocalStorage();
    // return savedcarts;
  }

  sortByID(carts: Array<Cart>) {
    carts.sort((prevcart: Cart, presCart: Cart) => {

      return prevcart.id > presCart.id ? 1 : -1;
    });

    return carts;
  }
  logout() {
    // clear localStorage
    this.localStorageService.clearItemFromLocalStorage('user');
    // navigate to login page
    this.router.navigate(['']);
  }

}


