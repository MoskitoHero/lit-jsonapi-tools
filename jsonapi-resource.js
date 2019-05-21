'use strict'

import { LitElement, html } from 'lit-element'

class JsonapiResource extends LitElement {
  /**
   *
   */
  render () {
    return html`
      <!-- template content -->
      <p>Hello World</p>
    `
  }
}

customElements.define('jsonapi-resource', JsonapiResource)
