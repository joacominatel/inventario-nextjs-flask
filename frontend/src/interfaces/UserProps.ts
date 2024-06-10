import computadorasData from './computadorasData';

interface UserProps {
    id: string;
    workday_id: string;
    nombre: string | null;
    apellido: string | null;
    mail: string | null;
    usuario: string | null;
    computadora: computadorasData[];
    is_active: boolean | null;
    win11_installed: boolean | null;
    created_at: string | null; // Cambio aquí
    updated_at: string | null; // Cambio aquí
}

export default UserProps;