'use strict'

import { LitElement, html } from 'lit-element'
import 'axios'
import Jsona from 'jsona'

class JsonapiResource extends LitElement {

  /*
  ** Constructor
  */
  constructor () {
    super()
    this.axios = require('axios')
    this.formatter = new Jsona()
    this.url = ''
    this.resource = ''
    this.response = {}
  }

  /*
  ** Properties
  */
  static get properties () {
    return {
      /*
      ** The base URL of the API, no trailing slash
      */
      url: {
        type: String
      },
      /*
      ** The resource to call
      ** eg. /authors/17.json
      */
      resource: {
        type: String
      },
      /*
      ** The response given by the server
      */
      response: {
        type: Object
      },
      /*
      ** The jsonapi-formatted data
      */
      data: {
        type: Object
      },
      /*
      ** The deserialized data
      */
      deserialized: {
        type: Object
      },
      /*
      ** The computed path, composed of url and resource
      */
      path: {
        type: String
      }
    }
  }

  /*
  ** Called when the element is updated
  */
  updated (props) {
    if (props.has('response')) { // url has changed
      this.data = this.response.data
      if (!!this.data) {
        this.deserialized = this.formatter.deserialize(this.data)
      }
      let event = new CustomEvent('response-changed', { detail: { ok: !!this.response.data } })
      this.dispatchEvent(event)
    }
    if (props.has('url')) {
      this.get()
    }
    if (props.has('deserialized')) {
      this.data = this.formatter.serialize({stuff: this.deserialized})
    }
  }

  /*
  ** This is the function to call when deserialized data is to be updated
  */
  updateData (data) {
    this.deserialized = data
    this.data = this.formatter.serialize({stuff: data})
  }

  /*
  ** path getter
  */
  get path () {
    return this.url + this.resource
  }

  /*
  ** API DELETE request
  */
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

  /*
  ** API GET request
  */
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

  /*
  ** API POST request
  */
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

  /*
  ** API PATCH request
  */
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

  /*
  ** API PUT request
  */
  put () {
    this.patch()
  }

  /*
  ** Successful response callback
  */
  handleResponse (response) {
    this.response = response
  }

  /*
  ** Error response callback
  */
  handleError (error) {
    this.error = error
  }

  /*
  ** Post response callback
  */
  afterRequest () {
  }
}

customElements.define('jsonapi-resource', JsonapiResource)
