import { useEffect, useState } from "react";

export const useUserRoles = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const storedRoles =  localStorage.getItem('userRoles');
       setRoles(storedRoles)
    }, [])

    return roles;
}