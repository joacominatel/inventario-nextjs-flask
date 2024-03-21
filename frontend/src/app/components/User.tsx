import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faLock, faEye, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { motion } from 'framer-motion';
import UserAccessories from './UserAccessories';
import axios from 'axios';
import Swal from 'sweetalert2';

interface UserProps {
    id: string;
    workday_id: string;
    nombre: string | null;
    apellido: string | null;
    mail: string | null;
    usuario: string | null;
    marca: string | null;
    modelo: string | null;
    serie: string | null;
    creacion: string | null;
    modificacion: string | null;
    win11_installed: boolean | null;
}

const User: React.FC<UserProps> = ({ id, nombre, apellido, mail, usuario, workday_id, marca, modelo, serie, creacion, modificacion, win11_installed }) => {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showAccessories, setShowAccessories] = useState(false);
    const [arrowDirection, setArrowDirection] = useState('right');
    const [editedUser, setEditedUser] = useState<UserProps>({
        id,
        nombre,
        apellido,
        mail,
        usuario,
        marca,
        modelo,
        serie,
        workday_id: workday_id,
        creacion,
        modificacion,
        win11_installed
    });

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowAccessories(false);
        setEditMode(false);
    };

    const handleEditUser = () => {
        setEditMode(true);
        setShowAccessories(false);
    };

    const handleToggleAccessories = () => {
        setShowAccessories(!showAccessories);
        setArrowDirection(arrowDirection === 'right' ? 'down' : 'right');
    };

    const handleCancelEdit = () => {
        setEditedUser({
            id,
            nombre,
            apellido,
            mail,
            usuario,
            marca,
            modelo,
            serie,
            workday_id: workday_id,
            creacion,
            modificacion,
            win11_installed
        });
        setEditMode(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setEditedUser((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleDeleteUser = () => {
        const confirmDelete = Swal.fire({
            title: 'Estas seguro?',
            text: `Usuario: ${nombre} ${apellido} sera desactivado`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Desactivar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                return true;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                return false;
            }
        });
        
        confirmDelete.then((result) => {
            if (result) {
                const url = `http://localhost:8010/api/v1.0/users/${id}`;
                axios.post(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => {
                        // Handle successful response
                        console.log(response.data);
                    })
                    .catch(error => {
                        // Handle error
                        console.error('Error:', error);
                    });
            }
        });
    };

    const handleSaveUser = () => {
        const url = `http://localhost:8010/api/v1.0/users/${id}`;
        axios.put(url, editedUser, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                // Handle successful response
                console.log(response.data);
                window.location.reload();
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white" key={id}>
            <h2 className="text-2xl font-bold mb-4">{nombre} {apellido}</h2>
            <p className="text-lg">Name: {nombre}</p>
            <p className="text-lg">Last Name: {apellido}</p>
            <p className="text-lg">Email: {mail}</p>
            <p className="text-lg">Username: {usuario}</p>
            <div className="flex justify-end mt-4">
                <motion.button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mr-2 rounded" onClick={handleDeleteUser}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FontAwesomeIcon icon={faLock} />
                </motion.button>
                <motion.button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={handleOpenModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FontAwesomeIcon icon={faEye} />
                </motion.button>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 flex-row">
                    <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={handleCloseModal}></div>
                    {editMode && (
                        <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in relative z-10 w-auto h-auto max-w-2xl">
                            <h2 className="text-2xl font-bold mb-4 text-black">Edit User</h2>
                            <form className="grid grid-cols-2 gap-4 text-black p-4 border-0">
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="nombre">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        className="w-full p-3 rounded-lg shadow-md bg-gray-100 border-0"
                                        placeholder="Name"
                                        value={editedUser.nombre || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="apellido">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        className="w-full p-3 rounded-lg shadow-md bg-gray-100 border-0"
                                        placeholder="Last Name"
                                        value={editedUser.apellido || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="mail">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="mail"
                                        className="w-full p-3 rounded-lg shadow-md bg-gray-100 border-0"
                                        placeholder="Email"
                                        value={editedUser.mail || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="usuario">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="usuario"
                                        className="w-full p-3 rounded-lg shadow-md bg-gray-100 border-0"
                                        placeholder="Username"
                                        value={editedUser.usuario || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="marca">
                                        Marca
                                    </label>
                                    <input
                                        type="text"
                                        id="marca"
                                        className="w-full p-3 rounded-lg shadow-md bg-gray-100 border-0"
                                        placeholder="Marca"
                                        value={editedUser.marca || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="modelo">
                                        Modelo
                                    </label>
                                    <input
                                        type="text"
                                        id="modelo"
                                        className="w-full p-3 rounded-lg shadow-md bg-gray-100 border-0"
                                        placeholder="Modelo"
                                        value={editedUser.modelo || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2" htmlFor="serie">
                                        Serie
                                    </label>
                                    <input
                                        type="text"
                                        id="serie"
                                        className="w-full p-3 rounded-lg shadow-md bg-gray-100 border-0"
                                        placeholder="Serie"
                                        value={editedUser.serie || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </form>
                            <hr className="my-4" />
                            <div className="flex justify-end">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={handleSaveUser}>
                                    Save
                                </button>
                            </div>
                        </div>
                    ) || (
                            <motion.div 
                                className="animate-fade-in relative z-10 flex flex-row gap-4 w-full h-auto max-w-full items-center justify-center"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                transition={{ type: 'tween', stiffness: 120, duration: 0.35 }}
                            >
                                <div className="flex justify-start mb-4 bg-white p-4 rounded-lg shadow-md animate-fade-in relative min-h-full mg-4">
                                    <div className="flex flex-col w-full h-auto max-w-2xl text-black p-4">
                                        <h2 className="text-2xl font-bold mb-4 text-black">{nombre} {apellido}</h2>
                                        <p className="text-lg text-black"><span className='font-bold'>Workday ID:</span> {workday_id}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Email:</span> {mail}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Username:</span> {usuario}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Marca:</span> {marca}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Modelo:</span> {modelo}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Serie:</span> {serie}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Creacion:</span> {creacion}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Modificacion:</span> {modificacion}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Win11 Installed:</span> {win11_installed ? "Yes" : "No"}</p>
                                        <div className="flex justify-end">
                                            <motion.button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCloseModal}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                Close
                                            </motion.button>
                                            <motion.button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={handleEditUser}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row w-auto h-auto p-4 max-w-fit max-h-fit">
                                    <motion.button
                                        className="top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
                                        onClick={handleToggleAccessories}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FontAwesomeIcon icon={arrowDirection === 'right' ? faArrowLeft : faArrowRight} />
                                    </motion.button>
                                </div>

                                {showAccessories && <UserAccessories workdayId={workday_id} />}
                            </motion.div>
                        )}
                </div>
            )}
        </div>
    );
};

export default User;