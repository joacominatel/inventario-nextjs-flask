"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRssSquare, faRefresh } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";

export default function RedmineButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handlePasswordSubmit = () => {
    setIsPasswordModalOpen(false);
    // Verificar si la contraseña es correcta antes de realizar la acción
    if (password === process.env.NEXT_PUBLIC_REDMINE_PASSWORD) {
      setLoading(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Contraseña incorrecta!",
      });
    }
  };

  useEffect(() => {
    if (loading) {
      axios
        .get(`${API_URL}/api/internal/redmineUsers`)
        .then(() => {
          setSuccess(true);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal!",
      });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "¡Datos de Redmine actualizados exitosamente!",
      });
    }
  }, [success]);

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed rounded-full bg-gray-800 px-4 py-4 bottom-4 right-4 text-white cursor-pointer flex items-center justify-center"
      onClick={() => setIsPasswordModalOpen(true)}
    >
        {loading ? (
            <FontAwesomeIcon icon={faRefresh} spin />
        ) : (
            <FontAwesomeIcon icon={faRssSquare} />
        )}
      {isPasswordModalOpen &&
        ReactDOM.createPortal(
            // Modal para ingresar la contraseña de Redmine
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="bg-gray-800 p-8 rounded-lg shadow-lg text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese la contraseña de Redmine"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md mb-4 bg-gray-700 text-white"
              />
              <div className="flex w-full justify-between">
                <button
                  onClick={handlePasswordSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </motion.div>
  );
}
