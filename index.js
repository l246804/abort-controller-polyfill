{
  /**
   * @type {typeof globalThis}
   */
  const root
    = (typeof globalThis !== 'undefined' && globalThis)
    || (typeof self !== 'undefined' && self)
    || (typeof global !== 'undefined' && global)
    || (typeof window !== 'undefined' && window)

  const SECRET = {}

  root.AbortSignal = (function () {
    function AbortSignal(secret) {
      if (secret !== SECRET) {
        throw new TypeError('Illegal constructor.')
      }
      this._super = new EventTarget()
      this._aborted = false
      this._onabort = null
      this._reason = undefined
    }

    AbortSignal.prototype = Object.create(EventTarget.prototype)
    AbortSignal.prototype.constructor = AbortSignal

    extendSuperMethods(AbortSignal, ['addEventListener', 'removeEventListener', 'dispatchEvent'])

    Object.defineProperty(AbortSignal.prototype, 'onabort', {
      get() {
        return this._onabort
      },
      set(callback) {
        const existing = this._onabort
        if (existing) {
          this.removeEventListener('abort', existing)
        }
        this._onabort = callback
        this.addEventListener('abort', callback)
      },
    })

    Object.defineProperty(AbortSignal.prototype, 'aborted', {
      get() {
        return this._aborted
      },
    })

    Object.defineProperty(AbortSignal.prototype, 'reason', {
      get() {
        return this._reason
      },
    })

    AbortSignal.prototype.throwIfAborted = function throwIfAborted() {
      if (this.aborted) {
        throw this.reason
      }
    }

    AbortSignal.abort = function abort(reason) {
      const ac = new root.AbortController()
      ac.abort(reason)
      return ac.signal
    }

    AbortSignal.any = function any(iterable) {
      if (arguments.length === 0) {
        throw new TypeError(
          'Failed to execute \'any\' on \'AbortSignal\': 1 argument required, but only 0 present.',
        )
      }

      if (!Array.isArray(iterable)) {
        throw new TypeError(
          'Failed to execute \'any\' on \'AbortSignal\': The object must have a callable @@iterator property.',
        )
      }

      const ac = new root.AbortController()
      function abortCallback(event) {
        ac.abort(event.reason)
        iterable.forEach((signal) => {
          signal.removeEventListener('abort', abortCallback)
        })
      }

      iterable.forEach((signal) => {
        signal.addEventListener('abort', abortCallback)
      })

      return ac.signal
    }

    AbortSignal.timeout = function timeout(ms) {
      if (ms == null) {
        throw new TypeError(
          'Failed to execute \'timeout\' on \'AbortSignal\': 1 argument required, but only 0 present.',
        )
      }

      if (ms < 0) {
        throw new TypeError(
          'Failed to execute \'timeout\' on \'AbortSignal\': Value is outside the \'unsigned long long\' value range.',
        )
      }

      if (Number.isNaN(ms)) {
        throw new TypeError(
          'Failed to execute \'timeout\' on \'AbortSignal\': Value is not of type \'unsigned long long\'.',
        )
      }

      const ac = new root.AbortController()
      setTimeout(() => {
        const error = new Error('signal timed out')
        error.name = 'TimeoutError'
        ac.abort(error)
      }, ms)
      return ac.signal
    }

    return AbortSignal
  })()

  root.AbortController = (function () {
    function AbortController() {
      this._signal = new root.AbortSignal(SECRET)
    }

    AbortController.prototype = Object.create(Object.prototype)

    Object.defineProperty(AbortController.prototype, 'signal', {
      get() {
        return this._signal
      },
    })

    AbortController.prototype.abort = function (reason) {
      abortSignal(this.signal, reason)
    }

    return AbortController
  })()

  function abortSignal(signal, reason) {
    if (!signal.aborted) {
      signal._aborted = true
      signal._reason = normalizeReason(reason)

      const event = new Event('abort')
      event.reason = reason
      signal.dispatchEvent(event)
    }
  }

  function normalizeReason(reason) {
    if (reason === undefined) {
      reason = new Error('signal is aborted without reason')
      reason.name = 'AbortError'
    }
    return reason
  }

  function extendSuperMethods(Ctor, methods) {
    methods.forEach((method) => {
      Object.defineProperty(Ctor.prototype, method, {
        get() {
          return this._super[method].bind(this._super)
        },
      })
    })
  }
}
