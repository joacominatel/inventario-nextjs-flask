import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLock, faLockOpen, faEye, faArrowRight, faArrowLeft, faTrash, faPrint } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import UserAccessories from './UserAccessories';
import computadorasData from '../interfaces/computadorasData';
import UserProps from '../interfaces/UserProps';

const User: React.FC<UserProps> = ({ id, nombre, apellido, mail, usuario, workday_id, win11_installed, is_active, computadora, created_at, updated_at }) => {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showAccessories, setShowAccessories] = useState(false);
    const [arrowDirection, setArrowDirection] = useState('right');
    const [avaibleComputers, setAvaibleComputers] = useState<computadorasData[]>([]);
    const [editedUser, setEditedUser] = useState<UserProps>({
        id,
        nombre,
        apellido,
        mail,
        usuario,
        workday_id: workday_id,
        is_active,
        win11_installed,
        created_at,
        updated_at,
        computadora: [...computadora]
    });

    useEffect(() => {
        fetchAvailableComputers();
    }, []);

    const fetchAvailableComputers = async () => {
        try {
            const response = await axios.get('http://localhost:8010/api/v1.0/computadoras');
            setAvaibleComputers(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

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

    const callPrintableUser = () => {
        const endpoint = `/printable/${id}`;
        window.open(endpoint, '_blank');
    };

    const handleToggleAccessories = () => {
        setShowAccessories(!showAccessories);
        setArrowDirection(arrowDirection === 'right' ? 'down' : 'right');
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleAddComputer = () => {
        setEditedUser(prevState => ({
            ...prevState,
            computadora: [...prevState.computadora, { id, marca: null, modelo: null, serie: null, created_at: null, updated_at: null }]
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setEditedUser((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const deleteUserComputer = (index: number) => {
        setEditedUser((prevState) => {
            const newComputadora = prevState.computadora.filter((_, i) => i !== index);
            return {
                ...prevState,
                computadora: newComputadora,
            };
        });
    }

    const handleDeleteUser = async () => {
        const confirmDelete = await Swal.fire({
            title: 'Estas seguro?',
            text: `${nombre} ${apellido} ${is_active ? 'sera desactivado' : 'sera activado'}`,
            icon: 'warning',
            input: 'password',
            inputPlaceholder: 'Ingrese contraseña de admin',
            showCancelButton: true,
            confirmButtonText: `${is_active ? 'Si, desactivar!' : 'Si, activar!'}`,
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        });

        if (confirmDelete.isConfirmed && confirmDelete.value === 'admin1234') {
            Swal.fire(`Usuario ${is_active ? 'desactivado' : 'activado'}`, '', 'success');
            const url = `http://localhost:8010/api/v1.0/${is_active ? 'userDeactivate' : 'userActivate'}/${id}`;
            try {
                const response = await axios.post(url);
                console.log(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (confirmDelete.isConfirmed && confirmDelete.value !== 'admin1234') {
            Swal.fire('Error', 'Contraseña incorrecta', 'error');
        }
    };

    const handleComputerChange = (index: number, key: string, value: string) => {
        console.log('Nuevo ID de la computadora:', value);
        setEditedUser((prevState) => {
            const newComputadora = [...prevState.computadora];
            newComputadora[index] = {
                ...newComputadora[index],
                [key]: value,
            };
            return {
                ...prevState,
                computadora: newComputadora,
            };
        });
    }

    const handleSaveUser = () => {
        const url = `http://localhost:8010/api/v1.0/users/${id}`;
        const data = {
            nombre: editedUser.nombre,
            apellido: editedUser.apellido,
            mail: editedUser.mail,
            usuario: editedUser.usuario,
            computadoras_ids: editedUser.computadora.map((comp) => comp.id),
        };

        axios.put(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire('Usuario actualizado', '', 'success');
                    handleCloseModal();
                    // console.log(response.data);
                } else if (response.status === 201) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Cuidado!',
                        text: `Esta computadora ya esta asignada al usuario ${response.data.assigned_to}, deseas asignarla de todas formas?`,
                        showCancelButton: true,
                        confirmButtonText: 'Si, asignar!',
                        cancelButtonText: 'No, cancelar!',
                        reverseButtons: true

                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.post(url + '/force', data, {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then(response => {
                                    if (response.status === 200) {
                                        Swal.fire('Usuario actualizado', '', 'success');
                                        handleCloseModal();
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                        }
                    });

                }
            })
            .catch(error => {
                Swal.fire('Error', 'Error al actualizar el usuario', 'error');
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
                    {
                        is_active ? (
                            <FontAwesomeIcon icon={faLock} />
                        ) : (
                            <FontAwesomeIcon icon={faLockOpen} />
                        )
                    }
                </motion.button>
                <motion.button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={handleOpenModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FontAwesomeIcon icon={faEye} />
                </motion.button>
            </div>
            {showModal && (
                <motion.div 
                    className="fixed inset-0 flex items-center justify-center z-50 flex-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
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
                                <div className='mb-4'>
                                    {editedUser.computadora.map((computadora, index) => (
                                        <div className="flex flex-col" key={index}>
                                            <label className='block text-sm font-bold mb-2' htmlFor={`computadora-${index}`}>
                                                Choose a computer
                                            </label>
                                            <div className='flex flex-row justify-between'>
                                                <select
                                                    id={`computadora-${index}`}
                                                    className='w-full p-3 rounded-lg shadow-md bg-gray-100 border-0'
                                                    value={computadora.id}
                                                    onChange={(e) => handleComputerChange(index, 'id', e.target.value)}
                                                >
                                                    <option value=''>Choose a computer</option>
                                                    {
                                                        avaibleComputers.map((comp) => (
                                                            <option key={comp.id} value={comp.id}>{comp.marca} {comp.modelo} | {comp.serie}</option>
                                                        ))
                                                    }
                                                </select>
                                                <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2'
                                                    onClick={() => deleteUserComputer(index)}
                                                    type='button'
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <motion.button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                                        type='button'
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleAddComputer}
                                    >
                                        Add Computer
                                    </motion.button>

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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                
                            >
                                <div className="flex justify-start mb-4 bg-white p-4 rounded-lg shadow-md animate-fade-in relative min-h-full mg-4">
                                    <div className="flex flex-col w-full h-auto max-w-2xl text-black p-4">
                                        <h2 className="text-2xl font-bold mb-4 text-black">{nombre} {apellido}</h2>
                                        <p className="text-lg text-black"><span className='font-bold'>Workday ID:</span> {workday_id}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Email:</span> {mail}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Username:</span> {usuario}</p>
                                        {computadora.map((comp, index = 1) => (
                                            <p className="text-lg text-black" key={comp.id}><span className='font-bold'>Computadora {index}:</span> {comp.marca} {comp.modelo} | {comp.serie}</p>
                                        ))
                                        }
                                        <p className="text-lg text-black"><span className='font-bold'>Creacion:</span> {created_at}</p>
                                        <p className="text-lg text-black"><span className='font-bold'>Modificacion:</span> {updated_at}</p>
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
                                            <motion.button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={callPrintableUser}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                >
                                                <FontAwesomeIcon icon={faPrint} />
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
                </motion.div>
            )}
        </div>
    );
};

export default User;