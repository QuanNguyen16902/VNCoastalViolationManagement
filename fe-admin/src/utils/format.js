export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0"); // Ngày
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng (cần +1 vì getMonth() trả về từ 0-11)
  const year = date.getFullYear(); // Năm

  const hours = date.getHours().toString().padStart(2, "0"); // Giờ
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Phút

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
