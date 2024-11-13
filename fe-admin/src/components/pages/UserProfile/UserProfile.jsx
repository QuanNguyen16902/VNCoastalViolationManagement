import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import userService from "../../../service/user.service";
import { getUserFromToken } from "../../../utils/auth";

function UserProfile() {
  const [userDetails, setUserDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const currentUser = getUserFromToken();
  const fileInputRef = useRef(null); // Tạo ref cho input file

  const fetchUser = async () => {
    try {
      if (currentUser) {
        const response = await userService.getUser(currentUser.id);
        setUserDetails(response.data.profile);
      }
    } catch (error) {
      toast.error(error.response?.data || "Lỗi truy xuất người dùng");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);

      // Preview ảnh ngay lập tức
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails((prevState) => ({
          ...prevState,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!newPhoto) return;
    try {
      const formData = new FormData();
      formData.append("photo", newPhoto);

      await userService.uploadUserPhoto(currentUser.id, formData);
      toast.success("Ảnh đã được cập nhật thành công!");
      fetchUser();
      setNewPhoto(null);
    } catch (error) {
      toast.error(error.response?.data || "Lỗi cập nhật ảnh");
    }
  };

  const saveChanges = async () => {
    try {
      const updatedUser = {
        fullName: userDetails.fullName,
        position: userDetails.position,
        rank: userDetails.rank,
        department: userDetails.department,
      };

      await userService.editProfile(userDetails.id, updatedUser);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data || "Lỗi cập nhật thông tin");
    }
  };

  return (
    <div className="container mt-5 ">
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="text-center">
              {/* Nhấn vào ảnh để chọn ảnh mới */}
              <img
                src={
                  userDetails?.photo ||
                  "https://th.bing.com/th/id/OIP.ghZN_FaqJ8PdAWZKqcsU0wHaE6?w=244&h=180&c=7&r=0&o=5&pid=1.7"
                }
                className="card-img-top rounded-circle"
                alt="Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  margin: "auto",
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current.click()} // Nhấn vào ảnh mở input file
              />
              <input
                type="file"
                ref={fileInputRef} // Gắn ref vào input
                className="d-none" // Ẩn input
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={uploadPhoto}
                disabled={!newPhoto}
              >
                Cập nhật ảnh
              </button>
            </div>
            <div className="card-body text-center">
              {isEditing ? (
                <input
                  type="text"
                  className="form-control mb-2"
                  name="fullName"
                  value={userDetails?.fullName || ""}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, fullName: e.target.value })
                  }
                  placeholder="Tên đầy đủ"
                />
              ) : (
                <h5 className="card-title">
                  {userDetails?.fullName || "Chưa có"}
                </h5>
              )}
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="position"
                  value={userDetails?.position || ""}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, position: e.target.value })
                  }
                  placeholder="Chức vụ"
                />
              ) : (
                <p className="card-text">
                  {userDetails?.position || "Chưa có chức vụ"}
                </p>
              )}
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  value={userDetails?.department || ""}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      department: e.target.value,
                    })
                  }
                  placeholder="Đơn vị"
                />
              ) : (
                <p className="card-text">
                  {userDetails?.department || "Chưa có đơn vị"}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header">
              <h4>Thông Tin Cá Nhân</h4>
            </div>
            <div className="card-body">
              <h5 className="card-title">Thông tin chi tiết</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Username:</strong>{" "}
                  {currentUser?.username || "Chưa có email"}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong>{" "}
                  {currentUser?.email || "Chưa có email"}
                </li>
                <li className="list-group-item">
                  <strong>Cấp bậc:</strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="rank"
                      value={userDetails?.rank || ""}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, rank: e.target.value })
                      }
                    />
                  ) : (
                    userDetails?.rank || "Chưa có"
                  )}
                </li>
                <li className="list-group-item">
                  <strong>Quyền:</strong>{" "}
                  {Array.isArray(currentUser?.roles)
                    ? currentUser.roles.map((role) => role.authority).join(", ")
                    : "N/A"}
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            {isEditing ? (
              <>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={saveChanges}>
                  Lưu
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary me-2"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
