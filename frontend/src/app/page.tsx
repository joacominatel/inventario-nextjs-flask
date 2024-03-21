'use client';
import { useState } from "react";
import { useEffect } from "react";
import User from "./components/User";
import axios from "axios";

export default function Home() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<usersData[]>([]);

  // Explicitly type the users state as an array of objects with specific properties
  interface usersData {
    readonly id: string,
    workday_id: string,
    nombre: string,
    apellido: string,
    mail: string,
    marca: string,
    modelo: string,
    serie: string,
    usuario: string,
    created_at: string,
    updated_at: string,
    win11_installed: boolean
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // check if search is empty
        if (search === "") {
          return;
        }

        // url /api/v1.0/users/<string>
        const response = await axios.get(`http://localhost:8010/api/v1.0/users/${search}`);
        const data = response.data;

        const initialUsersData: usersData[] = [];

        // check if data message === "Usuario no encontrado"
        if (data.message === "Usuario no encontrado") {
          setUsers([]);
          return;
        }

        // check if data is not empty
        data.forEach((user: usersData) => {
          initialUsersData.push({
            id: user.id,
            workday_id: user.workday_id,
            nombre: user.nombre,
            apellido: user.apellido,
            mail: user.mail,
            marca: user.marca,
            modelo: user.modelo,
            serie: user.serie,
            usuario: user.usuario,
            created_at: user.created_at,
            updated_at: user.updated_at,
            win11_installed: user.win11_installed
          });

          console.log(user.id);
        });

        setUsers(initialUsersData);

      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [search]);

  return (
    // Add a search bar to the page
    <section className="container mx-auto">
      <div className="text-center mt-4 space-y-4">
        <form>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            id="search"
            className="w-full p-4 rounded-lg shadow-md bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Buscar usuario por nombre, apellido, correo"
          />
        </form>
      </div>
      <div className="mt-4" id="users">
        {users.length === 0 ? (
          <div className="text-center mt-4 space-y-4 text-2xl font-bold p-4 rounded-lg shadow-md bg-gray-800">
            <h1 className="text-2xl text-white">No se encontraron usuarios 👀</h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {users.map((user: { id: string, workday_id: string, nombre: string, apellido: string, mail: string, usuario: string, marca: string, modelo: string, serie: string, created_at: string, updated_at: string, win11_installed: boolean }) => (
              <User
                id={user.id}
                workday_id={user.workday_id}
                nombre={user.nombre}
                apellido={user.apellido}
                mail={user.mail}
                usuario={user.usuario}
                marca={user.marca}
                modelo={user.modelo}
                serie={user.serie}
                creacion={user.created_at}
                modificacion={user.updated_at}
                win11_installed={user.win11_installed}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}