import { Pop } from '../utils/Pop'
import { SocketHandler } from '../utils/SocketHandler'

class SocketService extends SocketHandler {
  constructor() {
    super()
    this
      .on('error', this.onError)
  }

  /**
  * @description Event listener for socket error.
  * @param {Error} e - The thrown error object.
  */
  onError(e) {
    Pop.toast(e.message, 'error')
  }
}

export const socketService = new SocketService()
