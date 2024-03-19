import React, { useState, useEffect } from "react";
import axios from "axios";
import AddAccessoryForm from "./AddAccessoryForm";
import Accesorio from "./Accesorio";
import { motion } from "framer-motion";

interface UserAccessories {
    id: string;
    workday_id: string;
    accesorio: string;
    detalle: string;
    ticket: string;
    cantidad: number;
    created_at: string;
    updated_at: string;
}

interface UserAccessoriesProps {
    workdayId: string;
}

const UserAccessories: React.FC<UserAccessoriesProps> = ({ workdayId }) => {
    const [accessories, setAccessories] = useState<UserAccessories[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [addAccessoryFormVisible, setAddAccessoryFormVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserAccessories = async () => {
            try {
                const response = await axios.get(`http://localhost:8010/api/v1.0/accessories/${workdayId}`);
                setAccessories(response.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user accessories:", error);
                setLoading(false);
            }
        };

        fetchUserAccessories();

        // Cleanup function to cancel the request if component unmounts or if workdayId changes
        return () => {
            console.log("Cleanup function");
        };
    }, [workdayId]);

    const handleAddAccessoryFormVisible = () => {
        setAddAccessoryFormVisible(!addAccessoryFormVisible);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!Array.isArray(accessories) || accessories.length === 0) {
        return (
            <div className="text-black bg-white p-5 rounded-lg h-auto shadow-lg min-h-full min-w-96">
                <h2 className="text-center font-bold">User Accessories</h2>
                <div className="text-center mt-5">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddAccessoryFormVisible}>
                        Add Accessory
                    </button>
                </div>
                {addAccessoryFormVisible && <AddAccessoryForm workdayId={workdayId} />}
            </div>
        );
    }

    return (
        <motion.div 
            className="text-black bg-white p-5 rounded-lg h-auto shadow-lg min-h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h2 className="text-center font-bold">User Accessories</h2>
            <div className="grid grid-cols-2 gap-4 mt-5">
                {accessories.map((accessory) => (
                    <Accesorio key={accessory.id} id={accessory.id} accesorio={accessory.accesorio} detalle={accessory.detalle} ticket={accessory.ticket} cantidad={accessory.cantidad} />
                ))}
            </div>
            <motion.div className="text-center mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
                <motion.button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddAccessoryFormVisible}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                >
                    Add Accessory
                </motion.button>
            </motion.div>
            {addAccessoryFormVisible && <AddAccessoryForm workdayId={workdayId} />}
        </motion.div>
    );
};

export default UserAccessories; 