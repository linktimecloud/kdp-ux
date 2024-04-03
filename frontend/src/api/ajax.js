/**
 * import axios
 *
 * Usage of Axios
 * https://github.com/mzabriskie/axios
 */
import Vue from 'vue'
import axios from 'axios'
import { MessageBox } from 'element-ui'
import Store from '@/store'
import i18n from '@/i18n'

import { isFunction, get, set } from 'lodash'
import toast from '@/utils/toast'

import { rest } from './rest'

import { NODE_ENV, URI_BASE, ACCEPT, API_TOKEN, DEFAULT_LANG } from '@/env'

import ServiceErrorModal from '@/common/serviceError'

/**
 * axios global configuration
 */
axios.defaults.withCredentials = NODE_ENV === 'production'

axios.defaults.headers.common.Accept = ACCEPT

// AUTH_TOKEN
axios.defaults.headers.common.Authorization = API_TOKEN || ''

/**
 * The ajax class package
 */
export class Ajax {
  /**
   * Creates an instance of Ajax.
   *
   * @param {Object} [opt={}]
   *
   * @memberOf Ajax
   */
  constructor (opt = {}) {
    // get a rest full api detail according opt
    if (opt.resource) {
      const res = rest(opt.resource)
      const obj = res.obj
      if (obj) {
        Object.assign(opt, obj)
      }
      opt.res = res
    }
    // set `options`
    const abortController = new AbortController()
    this.options = Object.assign({
      method: 'get',
      baseURL: URI_BASE,
      params: {},
      data: {},
      toast: true,
      cache: false,
      loading: false,
      loadingParams: {
        closable: true,
        text: i18n.t('common.loading')
      },
      abortController
    }, opt)
  }

  /**
   * Loading
   *
   * @param {any} opt
   *
   * @memberOf Ajax
   */
  loadingAction (processing = false) {
    const options = this.options
    const loading = Store.getters.loadingOptions
    const params = options.loadingParams

    if (options.processing) {
      const process = options.processing || {}
      set(process.obj, process.field, processing)
    }

    if (!options.loading) {
      return false
    }

    if (processing) {
      Store.dispatch('setLoadingOptions', {
        text: params.text,
        closable: params.closable,
        show: loading.show + 1
      })
    } else if (loading.show > 0) {
      Store.dispatch('setLoadingOptions', {
        show: loading.show - 1
      })
    }
  }

  /**
   * Trigger the request
   *
   * @param {Object} opt
   * @returns {Promise}
   *
   * @memberOf Ajax
   */
  fetch (opt) {
    const self = this
    const options = opt
      ? Object.assign({}, self.options, opt)
      : self.options
    const settings = {
      url: options.path,
      baseURL: options.baseURL,
      method: options.method,
      params: options.params,
      data: options.data,
      responseType: options.responseType,
      withCredentials: options.withCredentials,
      signal: options.abortController.signal,
      validateStatus: status => {
        return status >= 200 && status < 300
      }
    }
    if (options.method === 'get') {
      if (!options.cache) {
        settings.params.t = Date.now()
      }
      settings.params = Object.assign(
        {},
        settings.data,
        settings.params
      )
    }
    // Language
    axios.defaults.headers.common['Accept-Language'] = Store.getters.lang ?? DEFAULT_LANG
    // before send
    self.loadingAction(true)
    if (isFunction(options.before)) {
      options.before()
    }
    try {
      const curInstance = axios(settings)
      curInstance
        .then(response => {
          self.handleResponse(response, options)
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            console.log('Request canceled', error.message)
          } else {
            self.handleException(error.response, options)
          }
        })
        .finally(response => {
          self.loadingAction(false)
          if (isFunction(options.complete)) {
            options.complete(response)
          }
        })
      return curInstance
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Cancel the request
   *
   * @param {Object} opt
   * @returns {Promise}
   *
   * @memberOf Ajax
   */
  cancel () {
    this.options.abortController.abort()
  }

  /**
   * Handle the response data under http status 200
   *
   * @param {Object} response
   * @param {Object} options
   *
   * @memberOf Ajax
   */
  handleResponse (response = {}, options) {
    const self = this
    if (!response.data) {
      self.handleException(response, options)
      return
    }

    const status = response.data.status && response.data.status.toString()
    if (status === '100000') {
      if (isFunction(options.success)) {
        options.success(response.data)
      }
    } else {
      self.handleServiceError(response, options)
    }
  }

  /**
   * Handle the response data.status is not `100000`
   *
   * @param {Object} response
   * @param {Object} options
   *
   * @memberOf Ajax
   */
  handleServiceError (rsp, options) {
    if (isFunction(options.fail)) {
      options.fail(rsp)
    }

    const error = get(rsp, 'data.error', null)
    if (error && options.toast) {
      const DEFAULT_TYPE = 'warning'
      const { app, solution, info = {}, type = DEFAULT_TYPE } = error

      const errorMsgs = []
      if (app) {
        errorMsgs.push(`${i18n.t('error.app')}: ${app}`)
      }
      if (solution || info.solution) {
        errorMsgs.push(`${i18n.t('error.solution')}: ${solution || info.solution}`)
      }

      const h = new Vue().$createElement
      const cb = () => {
        MessageBox({
          customClass: 'el-message-box--md',
          title: i18n.t('common.serviceError'),
          message: h(ServiceErrorModal, {
            props: {
              data: error
            }
          })
        }).then(() => {}).catch(() => {})
      }
      const isValidType = ['success', 'warning', 'error'].includes(type)
      toast.error(
        info.description || get(rsp, 'data.message') || '',
        errorMsgs,
        {
          type: isValidType ? type : DEFAULT_TYPE,
          cb
        }
      )
    }
  }

  /**
   * Handle http status not 200
   *
   * @param {Object} response
   * @param {Object} options
   *
   * @memberOf Ajax
   */
  handleException (response = {}, options) {
    if (isFunction(options.fail)) {
      options.fail(response)
    }
    if (options.toast) {
      const path = options.path
      let text = response.statusText
      text = text ? `: ${text}` : ''
      const errText = i18n.t('common.path') + path + i18n.t('exception.occur') + text
      toast.log(
        [
          errText + ',',
          i18n.t('exception.retry')
        ]
      )
    }
  }
}

export default Ajax
