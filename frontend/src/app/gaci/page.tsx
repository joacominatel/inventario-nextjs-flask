'use client';
import Swal from "sweetalert2"
import axios from "axios"

export default function Page() {
    function replaceFiles() {
        // /api/v1.0/replaceFiles
        axios.get('http://localhost:8010/api/v1.0/replaceFiles');
    }

    function adviceOfReplaceFiles() {
        Swal.fire({
            title: 'Estas seguro?',
            text: 'Vas a reemplazar los archivos TMP en el C:/ del servidor.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si! Reemplazar.',
            cancelButtonText: 'No, cancelar.',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                replaceFiles();
                Swal.fire(
                    'Reemplazados!',
                    'Todos los archivos fueron reemplazados correctamente.',
                    'success'
                )
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelado',
                    'No se reemplazaron los archivos.',
                    'error'
                )
            }
        })
    
    }

    return (
        <div className="h-screen flex items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Reemplazar TMPSDO</h1>
                <p>
                    Reemplaza los archivos en el servidor principal con los archivos de la copia de seguridad.
                </p>
                <button onClick={adviceOfReplaceFiles} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 transition-colors duration-300">Replace Files</button>
            </div>
        </div>
    )
}