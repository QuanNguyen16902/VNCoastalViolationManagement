import { DatePicker, TimePicker } from "antd";
import moment from "moment";
import React, { useState } from "react";

const DateTimePicker = ({ onSave }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleTimeChange = (time) => {
    setTime(time);
  };

  const handleSave = () => {
    if (date && time) {
      // Kết hợp ngày và giờ đã chọn vào cùng một chuỗi
      const combinedDateTime = moment(date)
        .set({
          hour: time.hours(),
          minute: time.minutes(),
          second: 0,
        })
        .format("YYYY-MM-DD HH:mm:ss");

      // Gọi hàm onSave để lưu giá trị
      onSave(combinedDateTime);
      console.log("DateTime to save:", combinedDateTime);
    }
  };

  return (
    <div>
      <DatePicker onChange={handleDateChange} placeholder="Chọn ngày" />
      <TimePicker
        onChange={handleTimeChange}
        placeholder="Chọn giờ"
        format="HH:mm"
      />
      <button onClick={handleSave}>Lưu</button>
    </div>
  );
};

export default DateTimePicker;
