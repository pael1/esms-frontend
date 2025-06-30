// composables/useSweetLoading.ts
import Swal from 'sweetalert2'

export const useSweetLoading = () => {
    const showLoading = (title = 'Loading...', text = 'Please wait...') => {
        Swal.fire({
            title,
            text,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
    }

    const closeLoading = () => {
        Swal.close()
    }

    const showError = (title = 'Error', text = 'Something went wrong.') => {
        Swal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonColor: '#16A34A' // Tailwind green-500
        })
    }

    const showWarning = (title = 'Warning', text = 'Please be careful.') => {
        Swal.fire({
            icon: 'warning',
            title,
            text,
            confirmButtonColor: '#16A34A' // Tailwind green-500
        })
    }

    const showSuccess = (title = 'Success', text = 'Operation completed successfully.') => {
        Swal.fire({
            icon: 'success',
            title,
            text,
            confirmButtonColor: '#16A34A' // Tailwind green-500
        })
    }

    const withLoading = async <T>(
        callback: () => Promise<T>,
        title?: string,
        text?: string
    ): Promise<T> => {
        try {
            showLoading(title, text)
            const result = await callback()
            return result
        } finally {
            closeLoading()
        }
    }

    return {
        showLoading,
        closeLoading,
        withLoading,
        showError,
        showWarning,
        showSuccess
    }
}
