import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMouse, faHeadphones, faDisplay, faKeyboard, faPhone, faComputer } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const accesorioIconMap = {
    Mouse: { icon: faMouse, bgColor: "bg-blue-500" },
    Keyboard: { icon: faKeyboard, bgColor: "bg-red-500" },
    Monitor: { icon: faDisplay, bgColor: "bg-green-500" },
    Phone: { icon: faPhone, bgColor: "bg-yellow-500" },
    Headphones: { icon: faHeadphones, bgColor: "bg-purple-500" },
    Other: { icon: faComputer, bgColor: "bg-orange-500" },
};

interface AccesorioProps {
    id: string;
    accesorio: string;
    detalle: string;
    ticket: string;
    cantidad: number;
}

const Accesorio: React.FC<AccesorioProps> = ({ accesorio, detalle, ticket, cantidad, id }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";
    const { icon, bgColor } = accesorioIconMap[accesorio as keyof typeof accesorioIconMap] || { icon: faComputer, bgColor: "bg-cyan-500" };
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [deleted, setDeleted] = useState<boolean>(false);

    const toggleDetail = () => {
        setDetailVisible(!detailVisible);
    };

    const handleDoubleClick = () => {
        const confirmDeleteAcc = Swal.fire({
            title: `¿Eliminar ${accesorio}?`,
            text: "No podrás revertir esto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${API_URL}/api/v1.0/accessories/${id}`);
                setDeleted(true);
                Swal.fire("Eliminado", "El accesorio ha sido eliminado", "success");
            } else {
                console.log("Cancelado");
            }        
        });
    };

    if (deleted) {
        return null;
    }

    return (
        <motion.div className={`flex items-center ${bgColor} shadow-lg rounded-lg p-4 mb-4 hover:shadow-2xl transition-all duration-300 cursor-pointer`} onClick={toggleDetail} onDoubleClick={handleDoubleClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
            <div className="mr-4 text-white text-center w-16 justify-center items-center flex">
                <FontAwesomeIcon icon={icon} size="3x" />
            </div>
            <motion.div className="flex-1 transition-all ease-in-out transform hover:scale-105">
                <h2 className="text-2xl font-bold text-white">{accesorio}</h2>
                <p className="text-white text-sm">Detalle: {detalle}</p>
                {detailVisible && <p className="text-white text-sm">Cantidad: {cantidad}</p>}
                {detailVisible && <p className="text-white text-sm">Ticket: {ticket}</p>}
            </motion.div>
        </motion.div>
    );
}

export default Accesorio;