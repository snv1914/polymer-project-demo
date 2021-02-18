/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
 
 /**
 * appConfig variable - set static data. Contains static users list, services, transactions data at application is loaded.
 */
var appConfig = {
	"appTitle": "Services System",
	"appHeaderName": "Payment Services",
	"services": {
		"mobile": {
			"title": "mobile",
			"providers": ["airtel", "jio", "bsnl"]
		},
		"dth": {
			"title": "dth",
			"providers": ["Airtel Digital TV", "Dish TV", "Sun Direct"]
		},
		"electricity": {
			"title": "electricity",
			"providers": ["CESS Ltd", "TSNPDCL", "TSSPDCL"]
		}
	},
	"users": [{
			"id": 1,
			"email": "admin@gmail.com",
			"password": "password",
			"role": "admin",
			"wallet": {
				"balance": 0
			}
		},
		{
			"id": 2,
			"email": "user1@gmail.com",
			"password": "password",
			"role": "user",
			"wallet": {
				"balance": 0
			}
		},
		{
			"id": 3,
			"email": "user2@gmail.com",
			"password": "password",
			"role": "user",
			"wallet": {
				"balance": 0
			}
		},
		{
			"id": 4,
			"email": "user3@gmail.com",
			"password": "password",
			"role": "user",
			"wallet": {
				"balance": 0
			}
		},
		{
			"id": 5,
			"email": "user4@gmail.com",
			"password": "password",
			"role": "user",
			"wallet": {
				"balance": 0
			}
		}
	],
	"transactions": []
}

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import './my-icons.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
	constructor() {
		super();

		// get/set users list from/to sessionStorage on load
		if (sessionStorage.usersList) {
			// if usersList exists, then replacing this.appConfig.users data with sessionStorage data (getting from sessionStorage.usersList)
			this.appConfig.users = JSON.parse(window.atob(sessionStorage.getItem("usersList")));
		} else {
			// at default if usersList item not exists, setting this.appConfig.users data to sessionStorage.usersList to get for future use
			sessionStorage.setItem("usersList", window.btoa(JSON.stringify(this.appConfig.users)));
		}

		// get/set users transactions from/to sessionStorage on load
		if (sessionStorage.transactions) {
			// if transactions exists, then replacing this.appConfig.transactions data with sessionStorage data (getting from sessionStorage.transactions)
			this.appConfig.transactions = JSON.parse(window.atob(sessionStorage.getItem("transactions")));
		} else {
			// at default if transactions item not exists, setting this.appConfig.transactions data to sessionStorage.transactions to get for future use
			sessionStorage.setItem("transactions", window.btoa(JSON.stringify(this.appConfig.transactions)));
		}

		// get userdata from session storage if user is logged into application
		this.userLoggedInStatus = false;
		if (sessionStorage.user) {
			this.loggedInUserDetails = JSON.parse(window.atob(sessionStorage.user));
			// map and get updated user data from sessionStorage
			if (sessionStorage.usersList) {
				let userData = this.appConfig.users.filter((user) => {
					if (user.email === this.loggedInUserDetails.email) {
						this.loggedInUserDetails = user;
						this.userLoggedInStatus = true;
					}
				});
			}
		}
	}

	static get template() {
		return html`
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
		
		.header-user-info {
		  width: 100%;
		  font-size: 12px;
		  padding: 15px;
		}
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>{{appConfig.appTitle}}</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <template is="dom-if" if="[[!loggedInUserDetails.email]]">
				<a name="login" href="[[rootPath]]login">Login</a>
				<a name="register" href="[[rootPath]]register">Register</a>
			</template>
			<template is="dom-if" if="[[loggedInUserDetails.email]]">
				<div class="header-user-info">
					Email: {{loggedInUserDetails.email}}
					<br/>
					Wallet balance: Rs. {{loggedInUserDetails.wallet.balance}}
				</div>

				<a name="transactions" href="[[rootPath]]transactions">Transactions</a>
				<a name="dashboard" href="[[rootPath]]dashboard">Dashboard</a>
				<a name="wallet" href="[[rootPath]]wallet">Wallet</a>
				<a name="profile" href="[[rootPath]]profile">Profile</a>
				<template is="dom-if" if="[[currentRunningService.service]]">
					<a name="payment" href="[[rootPath]]payment">Payment</a>
				</template>
				<!--
				<a name="dth" href="[[rootPath]]dth">Dth</a>
				<a name="mobile" href="[[rootPath]]mobile">Mobile</a>
				<a name="electricity" href="[[rootPath]]electricity">Electricity</a>
				-->
				<button on-click="logout">Logout</button>
			</template>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">{{appConfig.appHeaderName}}</div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <my-login users="{{appConfig.users}}" user-logged-in-status="{{userLoggedInStatus}}" logged-in-user-details="{{loggedInUserDetails}}" name="login"></my-login>
            <my-register users="{{appConfig.users}}" name="register"></my-register>
            <my-transactions user-transactions="{{userTransactions}}" name="transactions"></my-transactions>
            <my-wallet users="{{appConfig.users}}" logged-in-user-details="{{loggedInUserDetails}}" name="wallet"></my-wallet>
            <my-profile logged-in-user-details="{{loggedInUserDetails}}" name="profile"></my-profile>
            <my-dashboard name="dashboard"></my-dashboard>
            <my-payment transactions="{{appConfig.transactions}}" users="{{appConfig.users}}" current-running-service="{{currentRunningService}}" logged-in-user-details="{{loggedInUserDetails}}" name="payment"></my-payment>
            <my-dth current-running-service="{{currentRunningService}}" services="{{appConfig.services}}" name="dth"></my-dth>
            <my-mobile current-running-service="{{currentRunningService}}" services="{{appConfig.services}}" name="mobile"></my-mobile>
            <my-electricity current-running-service="{{currentRunningService}}" services="{{appConfig.services}}" name="electricity"></my-electricity>
            <my-view404 name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
	}

	static get properties() {
		return {
			page: {
				type: String,
				reflectToAttribute: true,
				observer: '_pageChanged'
			},
			appConfig: {
				type: Object,
				value: appConfig
			},
			userTransactions: {
				type: Array,
				value: []
			},
			userLoggedInStatus: {
				type: Boolean,
				value: false
			},
			loggedInUserDetails: {
				type: Object,
				value: {}
			},
			currentRunningService: {
				type: Object,
				value: {}
			},
			routeData: Object,
			subroute: Object
		};
	}

	static get observers() {
		return [
			'_routePageChanged(routeData.page)'
		];
	}

	_routePageChanged(page) {
		// Show the corresponding page according to the route.
		//
		// If no page was found in the route data, page will be an empty string.
		// Show 'login' in that case. And if the page doesn't exist, show 'view404'.
		if (!page) {
			this.page = 'login';
		} else if (['login', 'register', 'transactions', 'wallet', 'profile', 'dashboard', 'payment', 'dth', 'mobile', 'electricity'].indexOf(page) !== -1) {
			this.page = page;
		} else {
			this.page = 'view404';
		}

		// Close a non-persistent drawer when the page & route are changed.
		if (!this.$.drawer.persistent) {
			this.$.drawer.close();
		}
	}

	_pageChanged(page) {
		// if user logged in and page value is login or register then load dashboard page 
		// else user not logged in, then loading other pages(other than login, register) has tobe redirected to login page
		if (this.userLoggedInStatus) {
			if (page === 'login' || page === 'register') {
				this.set('route.path', '/dashboard');
			}
		} else {
			if (page !== 'login' && page !== 'register') {
				this.set('route.path', '/login');
			}
		}

		// if transactions menu is clicked then execute getUserTransactions() function to get only currentuser(logged in user) transactions
		if (page === 'transactions') {
			this.getUserTransactions();
		}

		// Import the page component on demand.
		//
		// Note: `polymer build` doesn't like string concatenation in the import
		// statement, so break it up.
		switch (page) {
			case 'login':
				import('./my-login.js');
				break;
			case 'register':
				import('./my-register.js');
				break;
			case 'transactions':
				import('./my-transactions.js');
				break;
			case 'wallet':
				import('./my-wallet.js');
				break;
			case 'profile':
				import('./my-profile.js');
				break;
			case 'dashboard':
				import('./my-dashboard.js');
				break;
			case 'payment':
				import('./my-payment.js');
				break;
			case 'dth':
				import('./my-dth.js');
				break;
			case 'mobile':
				import('./my-mobile.js');
				break;
			case 'electricity':
				import('./my-electricity.js');
				break;
			case 'view404':
				import('./my-view404.js');
				break;
		}
	}


	// get currentuser transactions and set to this.userTransactions property
	getUserTransactions() {
		this.userTransactions = this.appConfig.transactions.filter((transaction) => {
			if (transaction.userId === this.loggedInUserDetails.id) {
				return true;
			}
		}); // filter current user transactions from this.appConfig.transactions array
		// console.log(this.userTransactions);
	}

	// logout
	logout() {
		this.loggedInUserDetails = {};
		this.userLoggedInStatus = false;
		sessionStorage.removeItem("user");
		this.set('route.path', '/login');
	}


}

window.customElements.define('my-app', MyApp);