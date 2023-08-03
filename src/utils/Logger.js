import { dev } from '../env.js'

/**
 * @description Logs data to the console if the application is in development mode.
 * @param {string} type - The type of console log.
 * @param {Array} content - The content to log.
 */
function log(type, content) {
  if (dev) {
    // eslint-disable-next-line no-console
    console[type](`[${type}] :: ${new Date().toLocaleTimeString()} :: `, ...content)
  } else {
    switch (type) {
      case 'log':
      case 'assert':
        return
    }
    // eslint-disable-next-line no-console
    console[type](`[${type}] :: ${new Date().toLocaleTimeString()} :: `, ...content)
  }
}

export const logger = {
    /**
   * @description Logs the data as a normal log.
   */
  log() {
    log('log', arguments)
  },
  /**
   * @description Logs the data as an error.
   */
  error() {
    log('error', arguments)
  },
    /**
   * @description Logs the data as a warning.
   */
  warn() {
    log('warn', arguments)
  },
    /**
   * @description Logs the data as an assertion.
   */
  assert() {
    log('assert', arguments)
  },
  /**
   * @description Logs the data as a trace.
   */
  trace() {
    log('trace', arguments)
  }
}
