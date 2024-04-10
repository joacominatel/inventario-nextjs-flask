'use client';
export default function PrintablePage() {
    
    function goBack() {
     window.location.href = '/';
    }

    return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold font-mono m-10">Error, debes seleccionar un usuario para imprimir</h1>
        <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={goBack}
        >
            Volver
        </button>
    </div>
    );
}
