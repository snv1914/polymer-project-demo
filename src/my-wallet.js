/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/*
Login component - used to authenticate user and proceeds through application
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class MyWallet extends PolymerElement {
  static get properties() {
    return {
	  amount: {
		  type: Number
	  },
	  amountErrorMessage: {
		  type: String,
		  value: ''
	  },
	  users: {	/* gets user loginin status from my-app.js */
		  type: Object,
		  value: {},
		  notify: true
	  },
	  loggedInUserDetails: { /* gets loggedin user details from my-app.js */
		  type: Object,
		  value: {},
		  notify: true
	  }
    };
  }
  
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>
	  
	  <app-location route="{{route}}"></app-location>

      <div class="form-container">
		  <div class="card">
			<h1>MyWallet</h1>
			<paper-input type="text" always-float-label label="Amount" value="{{amount}}"></paper-input>
			<template is="dom-if" if="[[amountErrorMessage]]">
				<span class="error-validation">{{amountErrorMessage}}</span>
			</template>
			<paper-button raised class="indigo" on-click="addBalance">Add balance</paper-button>
			Wallet balance: {{loggedInUserDetails.wallet.balance}}
		  </div>
      </div>
    `;
  }
  
  // add balance to wallet
	addBalance() {
		// reset error data
		this.amountErrorMessage = '';
		
		// amount validation
		let numbers = /^[-+]?[0-9]+$/;
		if(this.amount.trim() === "" || !this.amount.match(numbers)) {
			this.amountErrorMessage = 'Please enter amount';
			return false;
		}
		
		// checks if user is logged in(using this.loggedInUserDetails) and adds amount to logged in user object and updates this.users and sessionStorage.usersList data
		if(this.loggedInUserDetails) {
			// update user data with wallet balance and save to sessionStorage
			let updatedUsersData = this.users.map((user) => {
				// checks the user is logged in user from array and updates wallet balance to that user
				if(user.email === this.loggedInUserDetails.email) {
					user.wallet.balance = parseInt(user.wallet.balance) + parseInt(this.amount);
					// this.loggedInUserDetails = user;	// updates user at my-app.js
					this.loggedInUserDetails.wallet.balance = user.wallet.balance;	// updates user at my-app.js
					// this.set('loggedInUserDetails.wallet.balance', user.wallet.balance);
					this.notifyPath('loggedInUserDetails.wallet.balance');
				}
				return user;
			});
			// replaces with updated data into this.users
			this.users = updatedUsersData;
			// updates sessionStorage.usersList
			sessionStorage.setItem("usersList", window.btoa(JSON.stringify(this.users)));
			
			// reset data
			this.amount = '';
		} else {
			// continue to login page
			this.set('route.path', '/login');
		}
	}
  

}

window.customElements.define('my-wallet', MyWallet);
