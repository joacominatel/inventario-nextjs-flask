'use client';
import { useState } from "react";
import { useEffect } from "react";
import User from "./components/User";
import axios from "axios";
import computadorasData from "./interfaces/computadorasData";

export default function Home() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<usersData[]>([]);
  const [searchActive, setSearchActive] = useState(() => {
      const storedValue = typeof window !== 'undefined' ? localStorage.getItem("searchActive") : null;
      return storedValue !==  null ? JSON.parse(storedValue) : true;
  })

  // Explicitly type the users state as an array of  objects with specific properties
  interface usersData {
    readonly id: string,
    workday_id: string,
    nombre: string,
    apellido: string,
    mail: string,
    computadora: computadorasData[],
    usuario: string,
    created_at: string,
    updated_at: string,
    is_active: boolean,
    win11_installed: boolean
  }

  // Almacenar en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem('searchActive', JSON.stringify(searchActive));
  }, [searchActive]);

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
        const response = await axios.get(`http://localhost:8010/api/v1.0/${searchActive ? "users" : "usersDisabled"}/${search}`);
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
            computadora: user.computadora,
            usuario: user.usuario,
            created_at: user.created_at,
            updated_at: user.updated_at,
            is_active: user.is_active,
            win11_installed: user.win11_installed
          });

            // console.log(user.computadora);
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
        <form className="flex flex-row items-center justify-center space-x-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            id="search"
            className="w-full p-4 rounded-lg shadow-md bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Buscar usuario por nombre, apellido, correo"
          />
          {/* checkbox to search on activated users or deactivated users */}
          <div className="flex justify-center items-center">
            <label htmlFor="searchActive" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="searchActive"
                checked={searchActive}
                onChange={() => setSearchActive(!searchActive)}
                className="sr-only peer checked:bg-blue-500 checked:border-blue-500 checked:text-white checked:justify-end"
              />
              <div className="peer rounded-br-2xl rounded-tl-2xl outline-none duration-100 after:duration-500 w-28 h-14 bg-blue-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500  after:content-['No'] after:absolute after:outline-none after:rounded-br-xl after:rounded-tl-xl after:h-12 after:w-12 after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center  after:text-sky-800 after:font-bold peer-checked:after:translate-x-14 peer-checked:after:content-['Yes'] peer-checked:after:border-white">
              </div>
            </label>
          </div>
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
            {users.map((user: { id: string, workday_id: string, nombre: string, apellido: string, mail: string, usuario: string, created_at: string, updated_at: string, win11_installed: boolean, is_active: boolean, computadora: computadorasData[] }) => (
              <User
                key={user.id}
                id={user.id}
                workday_id={user.workday_id}
                nombre={user.nombre}
                apellido={user.apellido}
                mail={user.mail}
                usuario={user.usuario}
                computadora={user.computadora || []}
                created_at={user.created_at}
                updated_at={user.updated_at}
                is_active={user.is_active}
                win11_installed={user.win11_installed}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}