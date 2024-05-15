'use client';
import { useState } from 'react';
import axios from 'axios';
import UserProps from '../interfaces/UserProps';
import Swal from 'sweetalert2';

export default function CreateUser() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';
    const [user, setUser] = useState<UserProps>();
    const [workday_id, setWorkdayId] = useState<string>('');
    const [nombre, setNombre] = useState<string>('');
    const [apellido, setApellido] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    const [usuario, setUsuario] = useState<string>('');
    const [marcaComputadora, setMarcaComputadora] = useState<string>('');
    const [modeloComputadora, setModeloComputadora] = useState<string>('');
    const [serieComputadora, setSerieComputadora] = useState<string>('');
    const [is_active, setIsActive] = useState<boolean>(true);
    const [win11_installed, setWin11Installed] = useState<boolean>(true);

    const createUser = async () => {
        try {
            const user = {
                workday_id: workday_id,
                nombre: nombre,
                apellido: apellido,
                mail: mail,
                usuario: usuario,
                marca: marcaComputadora,
                modelo: modeloComputadora,
                serie: serieComputadora,
                is_active: is_active,
                win11_installed: win11_installed
            };
            const response = await axios.post(`${API_URL}/api/v1.0/users`, user);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'User created successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
                throw new Error('Something went wrong');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    }

    // close the form
    function closeForm() {
        setUser(undefined);
    }

    return (
            <div className='flex w-1/3 h-auto bg-white rounded-lg shadow-lg justify-center items-center flex-col'>
                <div className='grid grid-cols-2 gap-4 p-4 text-center text-black'>
                    <h1 className='col-span-2 text-2xl'>Create User</h1>
                    <input type='text' placeholder='Workday ID' className='rounded-lg p-2 border-blue-400 border-2' onChange={(e) => setWorkdayId(e.target.value)} />
                    <input type='text' placeholder='Nombre' className='rounded-lg p-2 border-blue-400 border-2' onChange={(e) => setNombre(e.target.value)} />
                    <input type='text' placeholder='Apellido' className='rounded-lg p-2 border-blue-400 border-2' onChange={(e) => setApellido(e.target.value)} />
                    <input type='text' placeholder='Mail' className='rounded-lg p-2 border-blue-400 border-2' onChange={(e) => setMail(e.target.value)} />
                    <div className='flex flex-col gap-4 items-center'>
                        <h2>Computadora</h2>
                        <input type='text' placeholder='Marca Computadora' className='rounded-lg p-2 border-blue-400 border-2' onChange={(e) => setMarcaComputadora(e.target.value)} />
                        <input type='text' placeholder='Modelo Computadora' className='rounded-lg p-2 border-blue-400 border-2' onChange={(e) => setModeloComputadora(e.target.value)} />
                        <input type='text' placeholder='Serie Computadora' className='rounded-lg p-2 border-blue-400 border-2' onChange={(e) => setSerieComputadora(e.target.value)} />
                    </div>
                    <input type='text' placeholder='Usuario' className='rounded-lg p-2 border-blue-400 border-2' onChange={(e) => setUsuario(e.target.value)} />
                    <div className='flex items-center justify-center'>
                        <label htmlFor='is_active' className='mr-2'>Is Active</label>
                        <input type='checkbox' id='is_active' onChange={(e) => setIsActive(e.target.checked)} />
                    </div>
                    <div className='flex items-center justify-center'>
                        <label htmlFor='win11_installed' className='mr-2'>Win11 Installed</label>
                        <input type='checkbox' id='win11_installed' onChange={(e) => setWin11Installed(e.target.checked)} />
                    </div>

                    <button className='col-span-2 bg-blue-500 p-2 rounded-lg text-white' onClick={createUser}>Create User</button>
                </div>
            </div>
    )

}