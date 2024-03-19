import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

interface AddAccessoryFormProps {
    workdayId: string;
}

const AddAccessoryForm: React.FC<AddAccessoryFormProps> = ({ workdayId }) => {
    const [accesorio, setAccesorio] = useState<string>("");
    const [detalle, setDetalle] = useState<string>("");
    const [ticket, setTicket] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [created, setCreated] = useState<boolean>(false);

    const handleAddAccessory = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(`http://localhost:8010/api/v1.0/accessories/${workdayId}`, {
                accesorio,
                detalle,
                ticket,
            });
            setAccesorio("");
            setDetalle("");
            setTicket("");
            setCreated(true);
        } catch (error) {
            setError("Error adding accessory");
        } finally {
            setLoading(false);
        }
    };

    if (created) {
        return <div>Accessory added successfully</div>;
    }

    return (
        <form onSubmit={handleAddAccessory}>
            <h2>Add Accessory</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accesorio">
                    Accessory
                </label>
                <select 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="accesorio"
                    value={accesorio}
                    onChange={(e) => setAccesorio(e.target.value)}
                >
                    <option value="">Select an accessory</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Keyboard">Keyboard</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Phone">Phone</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detalle">
                    Detail
                </label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="detalle"
                    placeholder="Enter detail"
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ticket">
                    Ticket
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="ticket"
                    placeholder="Enter ticket"
                    value={ticket}
                    onChange={(e) => setTicket(e.target.value)}
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={loading}
                >
                    Add Accessory
                </button>
            </div>
        </form>
    );
}

export default AddAccessoryForm;