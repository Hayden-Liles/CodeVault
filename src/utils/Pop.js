import Swal from "sweetalert2"

export class Pop {

  /**
   * @async
   * @description Confirms the user's action.
   * @param {string} title - The title of the confirmation.
   * @param {string} text - The text of the confirmation.
   * @param {string} confirmButtonText - The text of the confirm button.
   * @param {string} icon - The icon of the confirmation.
   * @returns {Promise<boolean>} A promise that resolves to true if the user confirms the action, and false otherwise.
   */
  static async confirm(title = 'Sure you want to do this?', text = "You won't be able to revert this!", confirmButtonText = 'Confirm', icon = 'warning') {
    try {
      // @ts-ignore
      const res = await Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        allowOutsideClick: false,
        showCancelButton: true,
      })
      if (res.isConfirmed) {
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  /**
   * @description Displays a toast message.
   * @param {string} title - The title of the toast.
   * @param {string} icon - The icon of the toast.
   * @param {string} position - The position of the toast.
   * @param {number} timer - The time before the toast disappears.
   */
  static toast(title = 'Warning!', icon = 'warning', position = 'top-right', timer = 3000) {
    // @ts-ignore
    Swal.fire({
      toast: true,
      icon,
      title,
      position,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  }

  /**
   * @description Handles errors and displays a toast message.
   * @param {AxiosError | Error | string} error - The error to handle.
   */
  static error(error) {
    if (error.isAxiosError) {
      const { response } = error
      const errorObj = (response.data ? response.data.error : response.data) || { message: 'Invalid Request ' + response.status }
      if (!errorObj) {
        return this.toast(error.message)
      }
      this.toast(errorObj.message || errorObj.error || 'error')
    } else {
      this.toast(error.message || error, 'error')
    }
  }

  
}
