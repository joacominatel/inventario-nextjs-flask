"use client";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";

export default function CreateComputerForm() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";
  const [marca, setMarca] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [serie, setSerie] = useState<string>("");

  const createComputer = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/v1.0/computadoras`, {
        marca,
        modelo,
        serie,
      });
      Swal.fire({
        title: "Computadora agregada",
        text: `Computadora ${response.data.serie} agregada con éxito`,
        icon: "success",
        confirmButtonText: "Ok",
      });

      // Clear the form
      setModelo("");
      setSerie("");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <form
      className="space-y-4 grid grid-cols-2 gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="col-span-2">
        <h1 className="text-2xl font-bold text-white">Agregar computadora</h1>
        <p className="text-white">
          Llena los campos para agregar una nueva computadora
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-white">Marca*</label>
        <input
          type="text"
          className="w-full bg-gray-700 p-2 rounded-lg"
          onChange={(e) => setMarca(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-white">Modelo*</label>
        <input
          type="text"
          className="w-full bg-gray-700 p-2 rounded-lg"
          onChange={(e) => setModelo(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2 col-span-2">
        <label className="text-white">Serie*</label>
        <input
          type="text"
          className="w-full bg-gray-700 p-2 rounded-lg"
          onChange={(e) => setSerie(e.target.value)}
          required
        />
      </div>
      <button
        className="bg-blue-500 text-white p-2 rounded-lg"
        onClick={createComputer}
      >
        Agregar computadora
      </button>
      <Link
        type="button"
        className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 duration-300 transition-colors flex justify-center items-center"
        href="/"
      >
        Cancelar
      </Link>
    </form>
  );
}
