'use strict'

import { LitElement, html } from 'lit-element'
import 'axios'
import Jsona from 'jsona'

class JsonapiResource extends LitElement {
  constructor () {
    super()
    this.axios = require('axios')
    this.formatter = new Jsona()
    this.url = ''
    this.resource = ''
    this.response = {}
    this.setup()
  }
  static get properties () {
    return {
      url: {
        type: String
      },
      resource: {
        type: String
      },
      response: {
        type: Object
      },
      data: {
        type: Object
      },
      normalized: {
        type: Object
      },
      path: {
        type: String
      }
    }
  }
  /**
   *
   */
  render () {
    return html`
      <!-- template content -->
      <p>${this.path}</p>
    `
  }

  updated (props) {
    if (props.has('response')) { // url has changed
      this.data = this.response.data
    }
    if (props.has('url')) {
      this.get()
    }
  }

  get path () {
    return this.url + this.resource
  }

  get deserialized () {
    return this.formatter.deserialize(this.response.data)
  }

  set deserialized (value) {
    this.deserialized = value
    this.data = this.formatter.serialize(value)
  }

  setup () {
  }

  delete () {
    const that = this
    this.axios.get(this.path)
      .then(function (response) {
        that.handleResponse(response)
      })
      .catch(function (error) {
        that.handleError(error)
      })
      .finally(
        that.afterRequest()
      )
  }

  get () {
    const that = this
    this.axios.get(this.path)
      .then(function (response) {
        that.handleResponse(response)
      })
      .catch(function (error) {
        that.handleError(error)
      })
      .finally(
        that.afterRequest()
      )
  }

  post () {
    const that = this
    this.axios.post(this.path, this.data)
      .then(function (response) {
        that.handleResponse(response)
      })
      .catch(function (error) {
        that.handleError(error)
      })
      .finally(
        that.afterRequest()
      )
  }

  patch () {
    const that = this
    this.axios.patch(this.path, this.data)
      .then(function (response) {
        that.handleResponse(response)
      })
      .catch(function (error) {
        that.handleError(error)
      })
      .finally(
        that.afterRequest()
      )
  }

  put () {
    this.patch()
  }

  handleResponse (response) {
    this.response = response
  }

  handleError (error) {
    this.error = error
  }

  afterRequest () {
  }
}

customElements.define('jsonapi-resource', JsonapiResource)
