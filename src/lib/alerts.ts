import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDeleteAlert = async (text: string) => {
  return await MySwal.fire({
    title: '¿Estás seguro?',
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#eab308', // Tailwind yellow-500 (gold)
    cancelButtonColor: '#ef4444', // Tailwind red-500
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#1f2937', // Tailwind gray-800
    color: '#f3f4f6', // Tailwind gray-100
  });
};

export const successAlert = (title: string) => {
  MySwal.fire({
    title: title,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    background: '#1f2937',
    color: '#f3f4f6',
  });
};
