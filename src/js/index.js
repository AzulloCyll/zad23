import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue/dist/vue';
import { v4 as uuidv4 } from 'uuid';
import { setCookie, deleteCookie, getCookie } from './cookies';

new Vue({
  el: '#app',
  data() {
    return {
      newProductName: '',
      newProductNameErrorDisplay: false,
      products: [
        {
          id: '0',
          name: 'Marchewka',
          purchaseStatus: true,
          price: 10.55,
        },
        {
          id: '13',
          name: 'Bataty',
          purchaseStatus: true,
          price: 0.99,
        },
        {
          id: '12',
          name: 'Pietruszka',
          purchaseStatus: false,
          price: 7.0,
        },
        {
          id: '125',
          name: 'Banany',
          purchaseStatus: true,
          price: 3.21,
        },
      ],
      filteredProducts: [],
      filterStatus: 'all',
      productsPurchasedCount: 0,
      sumProductsPurchased: 0,
      sortByProductNameValue: 'def',
      sortByProductPriceValue: 'def',
      searchPhrase: '',
      user: '',
      loginStatus: false,
      activeItem: 'all',
    };
  },
  created() {
    const username = getCookie('username');

    if (username) {
      this.loginStatus = true;

      this.filteredProducts = this.products.slice();

      localStorage.setItem(this.user, JSON.stringify(this.products));

      this.purchasedProducts();
    }
  },
  methods: {
    addNewProduct() {
      if (this.newProductName.length > 0) {
        const id = uuidv4();

        this.products.push({
          id: id,
          name: this.newProductName,
          purchaseStatus: true,
          price: 5.03,
        });

        this.newProductName = '';

        this.purchasedProducts();
      }
    },
    removeProduct(currentProduct, $event) {
      console.log(currentProduct, $event);

      this.products = this.products.filter(
        (product) => product.id != currentProduct.id,
      );

      if (currentProduct.purchaseStatus) {
        this.productsPurchasedCount--;

        this.manageSumPrice(currentProduct, false);

        console.log('this.sumProductsPurchased', this.sumProductsPurchased);
      }

      this.filterByStatus(this.filterStatus);

      localStorage.setItem(this.user, JSON.stringify(this.products));
    },
    changeValueNewProductName() {
      this.newProductNameErrorDisplay = !this.newProductName.length > 0;
    },
    manageSumPrice(currentProduct, param) {
      const currentProductPrice = currentProduct.price * 100;
      this.sumProductsPurchased = this.sumProductsPurchased * 100;
      if (param) {
        this.sumProductsPurchased += currentProductPrice;
      } else {
        this.sumProductsPurchased -= currentProductPrice;
      }
      this.sumProductsPurchased = this.sumProductsPurchased / 100;
    },
    updatePurchaseStatus(currentProduct, $event) {
      console.log(currentProduct, $event);

      this.products.find((product) => {
        if (product.id === currentProduct.id) {
          if (product.purchaseStatus) {
            this.productsPurchasedCount++;

            this.manageSumPrice(currentProduct, true);
          } else {
            this.productsPurchasedCount--;

            this.manageSumPrice(currentProduct, false);
          }
        }
      });

      localStorage.setItem(this.user, JSON.stringify(this.products));
    },
    purchasedProducts() {
      this.productsPurchasedCount = 0;
      this.sumProductsPurchased = 0;

      this.products.forEach((product) => {
        if (product.purchaseStatus) {
          this.productsPurchasedCount++;

          this.sumProductsPurchased += product.price;
        }
      });

      this.sumProductsPurchased = this.sumProductsPurchased.toFixed(2);

      localStorage.setItem(this.user, JSON.stringify(this.products));
    },
    updateProductPrice(currentProduct) {
      this.purchasedProducts();
    },


    // Sekcja logowania
    logIn() {
      setCookie('username', this.user);
      this.loginStatus = true;
      this.filteredProducts = this.products.slice();
      this.purchasedProducts();
      localStorage.setItem(this.user, JSON.stringify(this.products));
    },
    logOut() {
      deleteCookie('username');
      this.loginStatus = false;
    },

    // Filtrowanie
    filterByStatus(purchaseStatus) {
      this.filterStatus = purchaseStatus;

      switch (this.filterStatus) {
        case 'all':
          this.filteredProducts = this.products;
          break;
        case 'purchased':
          this.isActive2 = !this.isActive2;
          this.filteredProducts = this.products.filter(
            (product) => product.purchaseStatus,
          );
          break;
        case 'tobuy':
          this.isActive3 = !this.isActive3;
          this.filteredProducts = this.products.filter(
            (product) => !product.purchaseStatus,
          );
          break;
      }
    },
    searchByProductName() {
      this.filterStatus = 'all';

      if (this.searchPhrase.length > 0) {
        this.filteredProducts = this.products.filter((product) => {
          if (product.name.includes(this.searchPhrase)) {
            return product;
          }
        });
      } else {
        this.filteredProducts = this.products;
      }
    },

    //sortowanie
    sortByProductName(event) {
      this.sortByProductNameValue = event.currentTarget.value;

      switch (this.sortByProductNameValue) {
        case 'asc':
          this.filteredProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
          break;

        case 'desc':
          this.filteredProducts.sort((a, b) => (a.name < b.name ? 1 : -1));
          break;

        case 'def':
          this.filteredProducts = this.products.slice();
          break;
      }
    },
    sortByProductPrice(e) {
      this.sortByProductPriceValue = e.currentTarget.value;

      switch (this.sortByProductPriceValue) {
        case 'asc':
          this.filteredProducts.sort((a, b) => (a.price > b.price ? 1 : -1));
          break;

        case 'desc':
          this.filteredProducts.sort((a, b) => (a.price < b.price ? 1 : -1));
          break;

        case 'def':
          this.filteredProducts = this.products.slice(); //??
          break;
      }
    },
    isActive(currentTab) {
      return this.activeItem === currentTab;
    },
    setActive(currentTab) {
      this.activeItem = currentTab;
    },
  },
});
