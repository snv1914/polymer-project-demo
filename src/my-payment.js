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
Payment component - used to make payment of dth/mobile/electricity services
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class MyPayment extends PolymerElement {
	static get properties() {
		return {
			mainErrorMessage: {
				type: String,
				value: ''
			},
			users: {
				/* gets users from my-app.js */
				type: Object,
				value: {},
				notify: true
			},
			transactions: {
				/* gets transactions from my-app.js */
				type: Array,
				value: [],
				notify: true
			},
			loggedInUserDetails: {
				/* gets loggedin user details from my-app.js */
				type: Object,
				value: {},
				notify: true
			},
			currentRunningService: {
				/* gets current running service from my-app.js */
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
			<h1>MyPayment</h1>
			
		  
			<paper-input type="text" always-float-label label="Service" disabled="disabled" value="[[currentRunningService.service]]"></paper-input>
			<paper-input type="text" always-float-label label="Service provider" disabled="disabled" value="[[currentRunningService.serviceProvider]]"></paper-input>
			<paper-input type="text" always-float-label label="Id" disabled="disabled" value="[[currentRunningService.serviceUniqueId]]"></paper-input>
			<paper-input type="text" always-float-label label="Amount" disabled="disabled" value="[[currentRunningService.amount]]"></paper-input>
			<template is="dom-if" if="[[currentRunningService.service]]">
				<paper-button raised class="indigo" on-click="payToService">Make payment</paper-button>
			</template>
			<template is="dom-if" if="[[mainErrorMessage]]">
				<span class="error-validation">{{mainErrorMessage}}</span>
			</template>
		  </div>
      </div>
    `;
	}


	// deduct balance
	deductBalance(amount) {
		if (this.loggedInUserDetails.wallet.balance >= amount) {
			this.loggedInUserDetails.wallet.balance -= amount;
			this.notifyPath('loggedInUserDetails.wallet.balance');
			return true;
		} else {
			return false;
		}
	}

	// update user balance based on payment
	updateBalance(amount) {
		// checks if user is logged in(using this.loggedInUserDetails) and adds amount to logged in user object and updates this.users and sessionStorage.usersList data
		if (this.loggedInUserDetails) {
			// update user data with wallet balance and save to sessionStorage
			let updatedUsersData = this.users.map((user) => {
				// checks the user is logged in user from array and updates wallet balance to that user
				if (user.email === this.loggedInUserDetails.email) {
					user.wallet.balance = parseInt(amount);
					// this.loggedInUserDetails.wallet.balance = user.wallet.balance;	// updates user at my-app.js
					// this.notifyPath('loggedInUserDetails.wallet.balance');
				}
				return user;
			});
			// replaces with updated data into this.users
			this.users = updatedUsersData;
			// updates sessionStorage.usersList
			sessionStorage.setItem("usersList", window.btoa(JSON.stringify(this.users)));
			// this.wallet.balance = this.wallet.balance + amount;
			// return {"status": 1, "message": "Amount updated to wallet"};
		} else {
			// return {"status": 0, "message": "Please login to continue"};
			this.mainErrorMessage = "Please login to continue";
		}
	}

	// payment service
	payToService() {
		// reset error messages:
		this.mainErrorMessage = '';
		/*
		if(parseInt(this.currentRunningService.amount) <= this.loggedInUserDetails.wallet.balance) {
			  
		  } else {
			  this.mainErrorMessage = 'Insufficient balance. Please add amount to wallet';
			  return false;
		  }
		  */

		/*
		amount, service, provider, userId, serviceUniqueId
		*/
		const service = this.currentRunningService.service;
		const provider = this.currentRunningService.serviceProvider;
		const serviceUniqueId = this.currentRunningService.serviceUniqueId;
		const amount = this.currentRunningService.amount;
		const userId = this.loggedInUserDetails.id;
		if (this.deductBalance(amount)) {
			// update transactions
			/*=======================================*/
			// update transactions array
			this.transactions.push({
				"id": this.transactions.length,
				"service": service,
				"provider": provider,
				"userId": userId,
				"serviceUniqueId": serviceUniqueId,
				"amount": amount
			});
			// update sessionStorage.transactions array
			sessionStorage.setItem("transactions", window.btoa(JSON.stringify(this.transactions)));
			/*=======================================*/

			// update current user balance amount to this.users array and also save to sessionStorage
			/*=======================================*/
			this.updateBalance(this.loggedInUserDetails.wallet.balance);
			/*=======================================*/

			// console.log("Payment done");
			this.currentRunningService = {}; // clear currentRunningService data after payment
			// continue to dashboard page
			this.set('route.path', '/dashboard');
		} else {
			this.mainErrorMessage = "Insufficient balance. Please add amount to wallet";
		}
	}

}

window.customElements.define('my-payment', MyPayment);