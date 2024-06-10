"use client";
import { useState } from "react";
import axios from "axios";
import UserProps from "@/interfaces/UserProps";
import Swal from "sweetalert2";
import Link from "next/link";

export default function CreateUserForm() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";
    const [user, setUser] = useState<UserProps>({} as UserProps);
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
                marca: marcaComputadora,
                modelo: modeloComputadora,
                serie: serieComputadora,
                is_active,
                win11_installed
            });
            Swal.fire({
                title: "Usuario creado",
                text: `Usuario ${response.data.usuario} creado con éxito`,
                icon: "success",
                confirmButtonText: "Ok"
            });
        } catch (error: any) {
            Swal.fire({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                confirmButtonText: "Ok"
            });
        }
    };
    return (
        <form className="space-y-4 grid grid-cols-2 gap-4">
        <div className="col-span-2">
            <h1 className="text-2xl font-bold text-white">Crear usuario</h1>
            <p className="text-white">Llena los campos para crear un nuevo usuario</p>
        </div>
        <div className="space-y-2">
            <label className="text-white">Workday ID*</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setWorkdayId(e.target.value)} required/>
        </div>
        <div className="space-y-2">
            <label className="text-white">Nombre*</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setNombre(e.target.value)} required/>
        </div>
        <div className="space-y-2">
            <label className="text-white">Apellido*</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setApellido(e.target.value)} required/>
        </div>
        <div className="space-y-2">
            <label className="text-white">Mail</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setMail(e.target.value)} />
        </div>
        <div className="space-y-2">
            <label className="text-white">Usuario</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setUsuario(e.target.value)} />
        </div>
        <div className="space-y-2">
            <label className="text-white">Marca de la computadora</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setMarcaComputadora(e.target.value)} />
        </div>
        <div className="space-y-2">
            <label className="text-white">Modelo de la computadora</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setModeloComputadora(e.target.value)} />
        </div>
        <div className="space-y-2">
            <label className="text-white">Serie de la computadora</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setSerieComputadora(e.target.value)} />
        </div>
        <div className="space-y-2">
            <label className="text-white">Activo</label>
            <select className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setIsActive(e.target.value === "true")}>
                <option value="true">Sí</option>
                <option value="false">No</option>
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-white">Win11 instalado</label>
            <select className="w-full bg-gray-700 p-2 rounded-lg" onChange={(e) => setWin11Installed(e.target.value === "true")} disabled>
                <option value="true">Sí</option>
                <option value="false">No</option>
            </select>
        </div>
        <button type="button" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 duration-300 transition-colors" onClick={createUser}>Crear usuario</button>
        <Link type="button" className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 duration-300 transition-colors flex justify-center items-center" href='/'>Cancelar</Link>
    </form>
    )
}