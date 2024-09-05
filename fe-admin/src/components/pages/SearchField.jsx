import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

function SearchField({ label, onSearch }) {
  const [searchValue, setSearchValue] = useState("");

  // Cập nhật giá trị searchValue khi người dùng nhập vào TextField
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Gọi hàm tìm kiếm với giá trị searchValue khi nút tìm kiếm được nhấn
  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", marginTop: "0px" }}
    >
      <TextField
        label={label}
        type="search"
        name="username"
        variant="outlined"
        value={searchValue} // Đặt giá trị của TextField là searchValue
        onChange={handleInputChange} // Cập nhật searchValue khi giá trị thay đổi
        style={{ height: 40 }}
        InputProps={{
          style: { height: 40 },
        }}
        InputLabelProps={{
          style: { marginTop: "-5px" },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: "8px", height: 35 }} // Chỉnh height của Button và căn chỉnh bên cạnh
        onClick={handleSearchClick}
      >
        Tìm kiếm
      </Button>
    </div>
  );
}

export default SearchField;
