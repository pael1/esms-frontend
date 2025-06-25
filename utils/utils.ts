import Swal, { type SweetAlertIcon } from "sweetalert2";

export function notify(title: string, icon: any, text: string) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
    });
}