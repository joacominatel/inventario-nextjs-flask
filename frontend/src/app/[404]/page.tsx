"use client";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
    return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gray-800 animate-fade-in-down p-4 text-white">
        <Head>
            <title>
                404 - Página no encontrada
            </title>
        </Head>
        <h1 className="text-4xl font-bold">404 - Esta página no existe 🔍</h1>
        <Link href="/">
            <motion.button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
                Ir a la página de inicio
            </motion.button>
        </Link>
    </div>
    );
}