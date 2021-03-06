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
Electricity component - used to pay electricity bills
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class MyElectricity extends PolymerElement {
	static get properties() {
		return {
			services: {
				/* gets payment services data */
				type: Object,
				value: {}
			},
			service: {
				type: String,
				value: 'electricity'
			},
			serviceErrorMessage: {
				type: String,
				value: ''
			},
			serviceProvider: {
				type: String,
				value: ''
			},
			serviceProviderErrorMessage: {
				type: String,
				value: ''
			},
			serviceUniqueId: {
				type: String,
				value: ''
			},
			serviceUniqueIdErrorMessage: {
				type: String,
				value: ''
			},
			amount: {
				type: Number,
				value: ''
			},
			amountErrorMessage: {
				type: String,
				value: ''
			},
			mainErrorMessage: {
				type: String,
				value: ''
			},
			currentRunningService: {
				/* notifies current running service to my-app.js */
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
			<h1>Electricity Bill Payment</h1>
			
			<paper-dropdown-menu class="full-width" label="Service provider" value="{{serviceProvider}}">
			<paper-listbox slot="dropdown-content" selected="0">
			  <template is="dom-repeat" items="{{services.electricity.providers}}">
			  <paper-item>{{item}}</paper-item>
			  </template>
			</paper-listbox>
		  </paper-dropdown-menu>
		  
			<paper-input type="text" always-float-label label="Bill Id" value="{{serviceUniqueId}}"></paper-input>
			<template is="dom-if" if="[[serviceUniqueIdErrorMessage]]">
				<span class="error-validation">{{serviceUniqueIdErrorMessage}}</span>
			</template>
			
			<paper-input type="text" always-float-label label="Amount" value="{{amount}}"></paper-input>
			<template is="dom-if" if="[[amountErrorMessage]]">
				<span class="error-validation">{{amountErrorMessage}}</span>
			</template>
			<paper-button raised class="indigo" on-click="payBill">Pay bill</paper-button>
			<template is="dom-if" if="[[mainErrorMessage]]">
				<span class="error-validation">{{mainErrorMessage}}</span>
			</template>
		  </div>
      </div>
    `;
	}

	payBill() {
		// reset error data
		this.serviceErrorMessage = '';
		this.serviceProviderErrorMessage = '';
		this.serviceUniqueIdErrorMessage = '';
		this.amountErrorMessage = '';
		this.mainErrorMessage = '';

		let numbers = /^[-+]?[0-9]+$/;
		// serviceUniqueId validation
		if (this.serviceUniqueId.trim() === "" || !this.serviceUniqueId.match(numbers)) {
			this.serviceUniqueIdErrorMessage = "Please enter id, only numbers";
			return false;
		}
		// serviceUniqueId length validation
		if (this.serviceUniqueId.trim().length < 7) {
			this.serviceUniqueIdErrorMessage = "Electricity bill id must be atleast 7 numbers";
			return false;
		}
		// amount validation
		if (this.amount.trim() === "" || !this.amount.match(numbers)) {
			this.amountErrorMessage = 'Please enter amount, only numbers';
			return false;
		}

		// if validation is success then save data to currentRunningService and goto payment page
		this.currentRunningService = {
			"service": this.service,
			"serviceProvider": this.serviceProvider,
			"serviceUniqueId": this.serviceUniqueId,
			"amount": this.amount
		};
		// continue to payment page
		this.set('route.path', '/payment');

		// reset data
		this.serviceUniqueId = '';
		this.amount = '';
	}
}

window.customElements.define('my-electricity', MyElectricity);