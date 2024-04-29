"use client";
import { useState, useEffect } from "react";
import UserProps from "@/app/interfaces/UserProps";
import UserAccessories from "@/app/interfaces/UserAccessories";
import computadorasData from "@/app/interfaces/computadorasData";
import Swal from "sweetalert2";
import axios from "axios";

export default function PrintableUser({ params }: { params: any }) {
  const [user, setUser] = useState<UserProps>();
  const [accessories, setAccessories] = useState<UserAccessories[]>([]);
  const [computadoras, setComputadoras] = useState<computadorasData[]>([]);
  const agregarFila = () => {
    Swal.fire({
      title: "Agregar Accesorio",
      html: `
        <input id="accesorio" class="swal2-input" placeholder="Accesorio">
        <input id="detalle" class="swal2-input" placeholder="Detalle">
        <input id="ticket" class="swal2-input" placeholder="Ticket">
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      preConfirm: () => {
        const accesorio = (document.getElementById("accesorio") as HTMLInputElement).value;
        const detalle = (document.getElementById("detalle") as HTMLInputElement).value;
        const ticket = (document.getElementById("ticket") as HTMLInputElement).value;
        if (!accesorio || !detalle || !ticket) {
          Swal.showValidationMessage("Por favor, complete todos los campos.");
        }
        return { accesorio, detalle, ticket };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newAccessory: UserAccessories = {
          id: (accessories.length + 1).toString(),
          accesorio: result.value.accesorio,
          detalle: result.value.detalle,
          ticket: result.value.ticket,
          workday_id: user?.workday_id ?? "",
          cantidad: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setAccessories([...accessories, newAccessory]);
      }
    });
  };

  useEffect(() => {
    // use axios to fetch user data http://backend:8010/api/v1.0/users/${params.id}
    axios.get(`http://backend:8010/api/v1.0/users/${params.id}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [params.id]);

  useEffect(() => {
    // use axios to fetch accessories data http://backend:8010/api/v1.0/accessories/${user?.workday_id}
    axios.get(`http://backend:8010/api/v1.0/accessories/${user?.workday_id}`)
      .then((response) => setAccessories(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [user?.workday_id]);

  useEffect(() => {
    // use axios to fetch computadoras data http://backend:8010/api/v1.0/computadoras/${user?.workday_id}
    axios.get(`http://backend:8010/api/v1.0/computadoras/${user?.workday_id}`)
      .then((response) => setComputadoras(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [user?.workday_id]);

  return (
    <main className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-lg w-9/12 h-9/12 print:w-full print:h-full">
        <header className="top-0 left-0 flex justify-start items-start w-fit h-fit relatives flex-col p-4 text-xs text-gray-500">
          <h3>Business</h3>
          <p>Business address</p>
          <p>Business Country</p>
          <p>Business Phone</p>
        </header>
        <section className="flex flex-col justify-center items-center w-full text-black text-center">
          <h1 className="text-3xl font-bold text-center w-full">
            Equipamiento de {user?.nombre} {user?.apellido}
          </h1>
          {/* info of user */}
          <div className="flex justify-center items-center w-full">
            <div className="flex justify-start items-start w-full">
              <div className="flex flex-col justify-start items-start w-1/2 p-4 text-left">
                <p>
                  <span className="font-bold">Workday ID:</span>{" "}
                  {user?.workday_id}
                </p>
                <p>
                  <span className="font-bold">Nombre:</span> {user?.nombre}{" "}
                  {user?.apellido}
                </p>
                <p>
                  <span className="font-bold">Mail:</span> {user?.mail}
                </p>
                {user?.computadora?.map((comp, index) => (
                  <p key={comp.id}>
                    <span className="font-bold">Computadora {index}:</span>{" "}
                    {comp.marca} {comp.modelo} AR-{comp.serie}
                  </p>
                ))}
              </div>
            </div>
          </div>
          {/* accessories */}
          {accessories.length > 0 && (
            <table className="w-1/2 h-1/2 print:w-full print:h-full">
              <thead className="w-full bg-emerald-500 text-white font-bold print:border-b-2 print:border-black">
                <tr className="w-full">
                  <th>Accesorio</th>
                  <th>Detalle</th>
                  <th>Ticket</th>
                </tr>
              </thead>
              <tbody className="w-full bg-white text-black">
                {accessories.map((acc) => (
                  <tr key={acc.id} className="w-full border-b border-gray-200 print:border-black print:border-2">
                    <td>
                      {acc.accesorio}
                    </td>
                    <td>
                      {acc.detalle}
                    </td>
                    <td>
                      {acc.ticket}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) || 
          <h2 className="text-xl font-bold text-center w-full print:hidden">
            No se han encontrado accesorios
          </h2>}
          <button
            onClick={agregarFila}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 print:hidden"
          >
            Agregar accesorio
          </button>
        </section>
      </div>
      <button
        onClick={() => window.print()}
        className="fixed bottom-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4 print:hidden"
      >
        Imprimir
      </button>
    </main>
  );
}
