"use client";
import { useState } from "react";
import CreateUserForm from "@/components/create/CreateUserForm";
import CreateComputerForm from "@/components/create/CreateComputerForm";

export default function CreatingForms() {
  const [showCreateUserForm, setShowCreateUserForm] = useState(true);

  return (
    <div className="flex flex-wrap items-center justify-center h-auto w-[33rem] bg-gray-800 p-4 border border-gray-700 rounded-lg col-span-2">
      {/* nav for change form */}
      <nav className="flex justify-start items-center w-full py-2 px-4">
        <ul className="flex space-x-4">
          <li
            className={`text-white ${
              showCreateUserForm ? "border-b-2 border-blue-500" : ""
            }`}
          >
            <button
              className="focus:outline-none"
              onClick={() => setShowCreateUserForm(true)}
            >
              Crear usuario
            </button>
          </li>
          <li
            className={`text-white ${
              !showCreateUserForm ? "border-b-2 border-blue-500" : ""
            }`}
          >
            <button
              className="focus:outline-none"
              onClick={() => setShowCreateUserForm(false)}
            >
              Crear computadora
            </button>
          </li>
        </ul>
      </nav>
      {showCreateUserForm ? <CreateUserForm /> : <CreateComputerForm />}
    </div>
  );
}
