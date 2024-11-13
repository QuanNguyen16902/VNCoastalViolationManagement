import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import userGroupService from "../../../service/user-group.service";
import userService from "../../../service/user.service";

function UsersOfGroupModal({ open, onClose, onEditUserGroup, userGroupId }) {
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedAvailableMembers, setSelectedAvailableMembers] = useState([]);
  const [selectedSelectedMembers, setSelectedSelectedMembers] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const handleAdd = () => {
    setSelectedMembers([...selectedMembers, ...selectedAvailableMembers]);
    setAvailableMembers(
      availableMembers.filter(
        (member) => !selectedAvailableMembers.includes(member)
      )
    );
    setSelectedAvailableMembers([]);
  };

  const handleRemove = () => {
    // Di chuyển từng thành viên từ selectedMembers sang availableMembers
    const updatedSelectedMembers = selectedMembers.filter(
      (member) => !selectedSelectedMembers.includes(member)
    );

    // Thêm các thành viên đã chọn vào danh sách availableMembers mà không trùng lặp
    const updatedAvailableMembers = [
      ...availableMembers,
      ...selectedSelectedMembers.filter(
        (member) => !availableMembers.includes(member)
      ),
    ];

    // Cập nhật lại state cho selectedMembers và availableMembers
    setSelectedMembers(updatedSelectedMembers);
    setAvailableMembers(updatedAvailableMembers);

    // Reset danh sách selectedSelectedMembers
    setSelectedSelectedMembers([]);
  };

  const handleSelectAvailable = (member) => {
    setSelectedAvailableMembers(
      selectedAvailableMembers.includes(member)
        ? selectedAvailableMembers.filter((m) => m !== member)
        : [...selectedAvailableMembers, member]
    );
  };

  const handleSelectSelected = (member) => {
    setSelectedSelectedMembers(
      selectedSelectedMembers.includes(member)
        ? selectedSelectedMembers.filter((m) => m !== member)
        : [...selectedSelectedMembers, member]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi cả hai API đồng thời
        const [groupResponse, usersResponse] = await Promise.all([
          userGroupService.getGroup(userGroupId),
          userService.getUsers(),
        ]);

        // Thiết lập selectedMembers từ dữ liệu nhóm
        const selectedUsers = groupResponse.data.users;
        setSelectedMembers(selectedUsers);

        // Lọc những người dùng không có trong selectedMembers để cập nhật availableMembers
        const availableUsers = usersResponse.data.filter(
          (user) => !selectedUsers.some((selected) => selected.id === user.id)
        );
        setAvailableMembers(availableUsers);
      } catch (error) {
        toast.error(error.response?.data || "Lỗi");
      }
    };

    fetchData();
  }, [userGroupId]);
  useEffect(() => {
    setUserIds(selectedMembers.map((member) => member.id));
  }, [selectedMembers]);

  const handleSubmit = async () => {
    try {
      const response = await userGroupService.addListUserToGroup(
        userGroupId,
        userIds
      );
      toast.success(response.data);
    } catch (error) {
      toast.error(error.response.data || "Lỗi");
    }
  };
  return (
    <Dialog
      fullWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="edit-userGroup-dialog-title"
    >
      <DialogTitle id="edit-userGroup-dialog-title">
        Chỉnh sửa người dùng trong Nhóm (ID: {userGroupId})
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div>
            <h3>Có sẵn</h3>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                height: "300px",
                overflowY: "auto",
              }}
            >
              {availableMembers.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectAvailable(item)}
                  style={{
                    padding: "5px",
                    cursor: "pointer",
                    backgroundColor: selectedAvailableMembers.includes(item)
                      ? "#e0f7fa"
                      : "white",
                  }}
                >
                  {item.id} - {item.profile?.fullName}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <button onClick={handleAdd} className="btn btn-primary">
              Thêm
            </button>
            <button onClick={handleRemove} className="btn btn-danger">
              Loại bỏ
            </button>
          </div>
          <div>
            <h3>Được chọn</h3>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                height: "300px",
                overflowY: "auto",
              }}
            >
              {selectedMembers.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectSelected(item)}
                  style={{
                    padding: "5px",
                    cursor: "pointer",
                    backgroundColor: selectedSelectedMembers.includes(item)
                      ? "#ffebee"
                      : "white",
                  }}
                >
                  {item.id} - {item.profile?.fullName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UsersOfGroupModal;
