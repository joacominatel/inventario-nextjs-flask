import CreateUserForm from "@/components/create/CreateUserForm"

export default function CreateUser() {
    return (
        <section className="w-full mx-auto h-screen bg-gray-950 overflow-hidden flex items-center justify-center">
            <div className="flex flex-wrap items-center justify-center h-auto w-[33rem] bg-gray-800 p-4 border border-gray-700 rounded-lg col-span-2">
                <CreateUserForm />
            </div>
        </section>
    )
}