import React, { useEffect, useState } from "react";

const StatisticCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 3000; // thời gian chạy (2 giây)
    const increment = Math.ceil(value / (duration / 50)); // tính mức tăng

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50); // cập nhật sau mỗi 50ms

    return () => clearInterval(timer); // clear timer khi component unmount
  }, [value]);

  return (
    <div>
      <h1>{count}</h1>
    </div>
  );
};

export default StatisticCounter;
