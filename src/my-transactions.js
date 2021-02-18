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

class MyTransactions extends PolymerElement {
  static get properties() {
    return {
	  userTransactions: {	/* gets current user transactions list from my-app.js */
		  type: Array,
		  value: [],
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
		
		.Table
		{
			display: table;
			width: 100%;
		}
		.Title
		{
			display: table-caption;
			text-align: center;
			font-weight: bold;
			font-size: larger;
		}
		.Heading
		{
			display: table-row;
			font-weight: bold;
			text-align: center;
		}
		.Row
		{
			display: table-row;
		}
		.Cell
		{
			display: table-cell;
			border: solid;
			border-width: thin;
			padding-left: 5px;
			padding-right: 5px;
		}
      </style>

      <div class="card">
        <h1>MyTransactions</h1>
		
		<div class="Table">
			<div class="Heading">
				<div class="Cell">
					<p>Service</p>
				</div>
				<div class="Cell">
					<p>Provider</p>
				</div>
				<div class="Cell">
					<p>Id</p>
				</div>
				<div class="Cell">
					<p>Amount</p>
				</div>
			</div>
			<template is="dom-repeat" items="{{userTransactions}}">
			  <div class="Row">
					<div class="Cell">
						<p>{{item.service}}</p>
					</div>
					<div class="Cell">
						<p>{{item.provider}}</p>
					</div>
					<div class="Cell">
						<p>{{item.serviceUniqueId}}</p>
					</div>
					<div class="Cell">
						<p>{{item.amount}}</p>
					</div>
				</div>
          </template>
		</div>
      </div>
    `;
  }
}

window.customElements.define('my-transactions', MyTransactions);
