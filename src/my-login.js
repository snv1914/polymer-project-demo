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
import {} from '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-route/app-route.js';
import './shared-styles.js';

class MyLogin extends PolymerElement {
	static get properties() {
		return {
			email: {
				type: String,
				value: ''
			},
			emailErrorMessage: {
				type: String,
				value: ''
			},
			password: {
				type: String,
				value: ''
			},
			passwordErrorMessage: {
				type: String,
				value: ''
			},
			mainErrorMessage: {
				type: String,
				value: ''
			},
			users: {
				/* gets users list from my-app.js to verify user existed or not */
				type: Object,
				value: {}
			},
			userLoggedInStatus: {
				/* gets status from my-app.js and send back status to my-app.js after user logged in to application */
				type: Boolean,
				value: false,
				notify: true
			},
			loggedInUserDetails: {
				/* gets loggedin user details from my-app.js and send back loggedin user details to my-app.js after user logged in to application */
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
			<h1>Login</h1>
			<paper-input type="text" always-float-label label="Email" value="{{email}}"></paper-input>
			<template is="dom-if" if="[[emailErrorMessage]]">
				<span class="error-validation">{{emailErrorMessage}}</span>
			</template>
			<paper-input type="password" always-float-label label="Password" value="{{password}}"></paper-input>
			<template is="dom-if" if="[[passwordErrorMessage]]">
				<span class="error-validation">{{passwordErrorMessage}}</span>
			</template>
			<paper-button raised class="indigo" on-click="login">Login</paper-button>
			<template is="dom-if" if="[[mainErrorMessage]]">
				<span class="error-validation">{{mainErrorMessage}}</span>
			</template>
		  </div>
      </div>
    `;
	}

	// login function
	login() {
		// reset error data
		this.emailErrorMessage = '';
		this.passwordErrorMessage = '';
		this.mainErrorMessage = '';

		// validate login data
		// email validation
		let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (reg.test(this.email) == false) {
			this.emailErrorMessage = "Please enter valid email address";
			return false;
		}
		// password validation
		if (this.password.trim() === "") {
			this.passwordErrorMessage = "Password is required";
			return false;
		}

		// filter user based on users data
		let user = this.users.filter((user) => {
			if (this.email === user.email && this.password === user.password) {
				return true;
			}
		});
		if (user.length > 0) {
			/* if user is existed, then set user details and login status and then save to sessionStorage */
			this.userLoggedInStatus = true;
			this.loggedInUserDetails = user[0];
			sessionStorage.setItem("user", window.btoa(JSON.stringify(this.loggedInUserDetails)));

			// reset data
			this.email = '';
			this.password = '';
			this.emailErrorMessage = '';
			this.passwordErrorMessage = '';
			this.mainErrorMessage = '';

			// go to dashboard page
			this.set('route.path', '/dashboard');
		} else {
			/* if user is not existed, then show error message */
			this.mainErrorMessage = 'Please check your credentials';
		}

	}
}

window.customElements.define('my-login', MyLogin);