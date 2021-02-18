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

class MyDashboard extends PolymerElement {
  static get properties() {
    return {
	  
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
	  
      <div class="card">
        <h1>MyDashboard</h1>
		<div class="">
			<paper-button raised class="indigo" on-click="dth">Dth</paper-button>
			<paper-button raised class="indigo" on-click="mobileRecharge">Mobile recharge</paper-button>
			<paper-button raised class="indigo" on-click="electricity">Electricity</paper-button>
		</div>
      </div>
    `;
  }
  
  // open dth page
  dth(){
	  this.set('route.path', '/dth');
  }
  // open mobile recharge page
  mobileRecharge(){
	  this.set('route.path', '/mobile');
  }
  // open dth page
  electricity(){
	  this.set('route.path', '/electricity');
  }
  
  
}

window.customElements.define('my-dashboard', MyDashboard);
