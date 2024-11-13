import { useEffect, useState } from "react";

export const useUserRoles = () => {
  const [roles, setRoles] = useState({ userRoles: [], groupRoles: [] });

  useEffect(() => {
    // Lấy dữ liệu từ localStorage và parse thành mảng, nếu không có thì trả về mảng rỗng
    const storedUserRoles = JSON.parse(localStorage.getItem("userRoles")) || [];
    const storedGroupRoles =
      JSON.parse(localStorage.getItem("groupRoles")) || [];

    // Cập nhật state với userRoles và groupRoles
    setRoles({
      userRoles: storedUserRoles,
      groupRoles: storedGroupRoles,
    });
  }, []);

  return roles;
};
