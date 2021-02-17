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
import '@polymer/app-route/app-route.js';
import './shared-styles.js';

class MyRegister extends PolymerElement {
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
	  confirmPassword: {
		  type: String,
		  value: ''
	  },
	  confirmPasswordErrorMessage: {
		  type: String,
		  value: ''
	  },
	  mainErrorMessage: {
		  type: String,
		  value: ''
	  },
	  users: {	/* gets user loginin status from my-app.js */
		  type: Object,
		  value: {},
		  notify: true
	  },
	  userLoggedInStatus: {	/* gets status from my-app.js and send back status to my-app.js after user logged in to application */
		  type: Boolean,
		  value: false
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
			<h1>Register</h1>
				<paper-input type="text" always-float-label label="Email" value="{{email}}"></paper-input>
				<template is="dom-if" if="[[emailErrorMessage]]">
					<span class="error-validation">{{emailErrorMessage}}</span>
				</template>
				<paper-input type="password" always-float-label label="Password" value="{{password}}"></paper-input>
				<template is="dom-if" if="[[passwordErrorMessage]]">
					<span class="error-validation">{{passwordErrorMessage}}</span>
				</template>
				<paper-input type="password" always-float-label label="Confirm Password" value="{{confirmPassword}}"></paper-input>
				<template is="dom-if" if="[[confirmPasswordErrorMessage]]">
					<span class="error-validation">{{confirmPasswordErrorMessage}}</span>
				</template>
				<paper-button raised class="indigo" on-click="register">Register</paper-button>
				<template is="dom-if" if="[[mainErrorMessage]]">
					<span class="error-validation">{{mainErrorMessage}}</span>
				</template>
		  </div>
      </div>
    `;
  }
  
  // register function
  register() {
	  // reset error data
	  this.emailErrorMessage = '';
	  this.passwordErrorMessage = '';
	  this.confirmPasswordErrorMessage = '';
	  this.mainErrorMessage = '';
	  
	  // validate login data
	  // email validation
	  let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	  if (reg.test(this.email) == false) 
	  {
		  this.emailErrorMessage = "Please enter valid email address";
		  return false;
	  }
	  // password validation
	  if (this.password.trim() === "") 
	  {
		  this.passwordErrorMessage = "Password is required";
		  return false;
	  }
	  // confirm password validation
	  if (this.password.trim() === "" || this.confirmPassword.trim() !== this.password.trim()) 
	  {
		  this.confirmPasswordErrorMessage = "Confirm password not matched";
		  return false;
	  }
	  
	  // filter users to check email is existed
	  let list = this.users.filter((user) => {
		  if(this.email === user.email) {
			  return true;
		  }
	  });
	  if(list.length > 0) { /* if user is existed, then show error message that email already in use */
		  this.mainErrorMessage = 'Email is already in use. Please use another email address';
	  } else { /* if user is not existed, then add new user */
		   // set user details with id
		  let userDetails = {};
		  userDetails.id = this.users.length + 1;
		  userDetails.email = this.email;
		  userDetails.password = this.password;
		  userDetails.role = "user";
		  userDetails.wallet = {"balance": 0};
		  userDetails.transactions = [];
		  
		  
		  // update appConfig.users array
		  this.users.push(userDetails);
		  // update localStorage.usersList with updated this.users - to get for future use at loading application
		  sessionStorage.setItem("usersList", window.btoa(JSON.stringify(this.users)));
		  
		  // reset data
		  this.email = '';
		  this.password = '';
		  this.confirmPassword = '';
		  this.emailErrorMessage = '';
		  this.passwordErrorMessage = '';
		  this.confirmPasswordErrorMessage = '';
		  this.mainErrorMessage = '';
		  
		  // go to login page
		  this.set('route.path', '/login');
	  }
	  
  }
}

window.customElements.define('my-register', MyRegister);
