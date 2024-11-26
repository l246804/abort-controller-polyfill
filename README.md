[![npm version](https://badge.fury.io/js/modern-abortcontroller-polyfill.svg)](https://badge.fury.io/js/modern-abortcontroller-polyfill)
![Node.js CI](https://github.com/l246804/abort-controller-polyfill/workflows/Node.js%20CI/badge.svg)

# modern-abort-controller-polyfill

Forked from [yet-another-abortcontroller-polyfill](https://www.npmjs.com/package/yet-another-abortcontroller-polyfill)

**Changes in this fork**

- **Forcefully override native classes**
- [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
  - Supports instance properties
    - [`reason`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/reason)
  - Supports instance methods
    - [`throwIfAborted`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/throwIfAborted)
  - Supports static methods
    - [`abort()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/abort_static)
    - [`any()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static)
    - [`timeout()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
  - Supports instance method [`abort(reason)`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort)
