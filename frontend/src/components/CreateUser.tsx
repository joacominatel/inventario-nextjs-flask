"use client";
import { useState } from "react";
import axios from "axios";
import UserProps from "@/interfaces/UserProps";
import Swal from "sweetalert2";

export default function CreateUser() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";
  const [user, setUser] = useState<UserProps>();
  const [workday_id, setWorkdayId] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [usuario, setUsuario] = useState<string>("");
  const [marcaComputadora, setMarcaComputadora] = useState<string>("");
  const [modeloComputadora, setModeloComputadora] = useState<string>("");
  const [serieComputadora, setSerieComputadora] = useState<string>("");
  const [is_active, setIsActive] = useState<boolean>(true);
  const [win11_installed, setWin11Installed] = useState<boolean>(true);

  const createUser = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/v1.0/users`, {
        workday_id,
        nombre,
        apellido,
        mail,
        usuario,
        marcaComputadora,
        modeloComputadora,
        serieComputadora,
        is_active,
        win11_installed,
      });
      Swal.fire("Usuario creado", "", "success");
      setUser(response.data);
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    // create modal of form to create user
    <div className="fixed z-20 inset-0 overflow-y-auto rounded-xl shadow-lg bg-black opacity-60">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Crear usuario
                </h3>
                <div className="mt-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="workday_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Workday ID
                      </label>
                      <input
                        type="text"
                        name="workday_id"
                        id="workday_id"
                        autoComplete="workday_id"
                        value={workday_id}
                        onChange={(e) => setWorkdayId(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="nombre"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        autoComplete="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="apellido"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        id="apellido"
                        autoComplete="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="mail"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mail
                      </label>
                      <input
                        type="text"
                        name="mail"
                        id="mail"
                        autoComplete="mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="usuario"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Usuario
                      </label>
                      <input
                        type="text"
                        name="usuario"
                        id="usuario"
                        autoComplete="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="marcaComputadora"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Marca Computadora
                      </label>
                      <input
                        type="text"
                        name="marcaComputadora"
                        id="marcaComputadora"
                        autoComplete="marcaComputadora"
                        value={marcaComputadora}
                        onChange={(e) => setMarcaComputadora(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="modeloComputadora"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Modelo Computadora
                      </label>
                      <input
                        type="text"
                        name="modeloComputadora"
                        id="modeloComputadora"
                        autoComplete="modeloComputadora"
                        value={modeloComputadora}
                        onChange={(e) => setModeloComputadora(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="serieComputadora"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Serie Computadora
                      </label>
                      <input
                        type="text"
                        name="serieComputadora"
                        id="serieComputadora"
                        autoComplete="serieComputadora"
                        value={serieComputadora}
                        onChange={(e) => setSerieComputadora(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="is_active"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Activo
                      </label>
                      <input
                        type="checkbox"
                        name="is_active"
                        id="is_active"
                        autoComplete="is_active"
                        checked={is_active}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="win11_installed"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Win11 Instalado
                      </label>
                      <input
                        type="checkbox"
                        name="win11_installed"
                        id="win11_installed"
                        autoComplete="win11_installed"
                        checked={win11_installed}
                        onChange={(e) => setWin11Installed(e.target.checked)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <button
                        onClick={createUser}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Crear
                      </button>
                      <button
                        onClick={() => setUser(undefined)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                        Cancelar
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
