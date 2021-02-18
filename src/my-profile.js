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

class MyProfile extends PolymerElement {
  static get properties() {
    return {
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

      <div class="form-container">
		  <div class="card">
			<h1>MyProfile</h1>
			
			<paper-input type="text" always-float-label label="Email" disabled="disabled" value="[[loggedInUserDetails.email]]"></paper-input>
			<paper-input type="text" always-float-label label="Role" disabled="disabled" value="[[loggedInUserDetails.role]]"></paper-input>
			<paper-input type="text" always-float-label label="Wallet Balance" disabled="disabled" value="[[loggedInUserDetails.wallet.balance]]"></paper-input>
		  </div>
      </div>
    `;
  }
}

window.customElements.define('my-profile', MyProfile);
