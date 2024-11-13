import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
} from "antd";
import React from "react";
import { formatDate } from "../../../utils/format";

const { Option } = Select;

const TangVatForm = ({ tangVats, onTangVatsChange }) => {
  const [form] = Form.useForm();

  // Hàm thêm tang vật mới vào danh sách
  const addTangVat = () => {
    form.validateFields().then((values) => {
      // Cập nhật tang vật mới vào danh sách
      const updatedTangVats = [...tangVats, values];
      onTangVatsChange(updatedTangVats); // Cập nhật lại tangVats trong component cha
      form.resetFields(); // Reset form sau khi thêm
    });
  };

  // Hàm xoá tang vật
  const deleteTangVat = (index) => {
    const updatedTangVats = tangVats.filter((_, i) => i !== index);
    onTangVatsChange(updatedTangVats); // Cập nhật lại tangVats trong component cha
  };

  const columns = [
    {
      title: "Tên Tang Vật",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày Thu Giữ",
      dataIndex: "seizureDate",
      key: "seizureDate",
      render: (date) => date && formatDate(date),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_, record, index) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => deleteTangVat(index)}
        >
          Xoá
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} layout="inline">
        <Form.Item
          name="itemName"
          label="Tên Tang Vật"
          rules={[{ required: true, message: "Vui lòng nhập tên tang vật!" }]}
        >
          <Input placeholder="Tên tang vật" />
        </Form.Item>

        <Form.Item name="description" label="Mô Tả">
          <Input placeholder="Mô tả" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số Lượng"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <InputNumber min={1} placeholder="Số lượng" />
        </Form.Item>

        <Form.Item name="seizureDate" label="Ngày Thu Giữ" className="m-2">
          <DatePicker placeholder="Chọn ngày" />
        </Form.Item>

        <Form.Item
          className="m-2"
          name="status"
          label="Trạng Thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="Đã thu giữ">Đã thu giữ</Option>
            <Option value="Đang xử lý">Đang xử lý</Option>
            <Option value="Đã trả lại">Đã trả lại</Option>
          </Select>
        </Form.Item>

        <Form.Item className="m-2">
          <Button type="primary" onClick={addTangVat} icon={<PlusOutlined />}>
            Thêm Tang Vật
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={tangVats}
        columns={columns}
        rowKey={(record) => record.itemName + record.seizureDate}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default TangVatForm;
