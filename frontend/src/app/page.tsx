'use client';
import { useState, useEffect } from "react";
import User from "@/components/User";
import axios from "axios";
import computadorasData from "@/interfaces/computadorasData";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";

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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // check if search is empty or less than 3 characters
        if (search === "" || search.length < 3) {
          return;
        }
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";

        // url /api/v1.0/users/<string>
        const trimmedSearch = search.trim();
        const response = await axios.get(`${API_URL}/api/v1.0/${searchActive ? "users" : "usersDisabled"}/${trimmedSearch}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Accept": "application/json",
            "Content-Type": "application/json",
          }
        });
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
            className="w-full p-4 rounded-lg shadow-md bg- gray-800 text-black focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Buscar usuario por nombre, apellido, correo"
          />
          <Link
            className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center"
            href="/create"
          >
            +
          </Link>
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
              {/* Icono de candado abierto */}
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                {searchActive ? <FontAwesomeIcon icon={faLock} className="text-white" /> : <FontAwesomeIcon icon={faUnlock} className="text-white" />}
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