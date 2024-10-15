import "boxicons/css/boxicons.min.css";
import StatisticCounter from "./StatisticCounter";

const DashboardBox = (props) => {
  return (
    <div
      className="dashboardBox"
      style={{
        backgroundImage: `linear-gradient(to right, ${props?.color[0]}, ${props?.color[1]})`,
      }}
    >
      {props.grow === true ? (
        <span className="chart">
          <i className="bx bx-trending-up"></i>
        </span>
      ) : (
        <span className="chart">
          <i className="bx bx-trending-down"></i>
        </span>
      )}

      <div className="d-flex w-100">
        <div className="col1">
          <h4 className="text-white mb-0">{props.label}</h4>
          <span className="text-white ">
            <StatisticCounter value={props.value} />
          </span>{" "}
          {/* Hiển thị giá trị */}
        </div>
        <div className="ms-auto">
          <span className="icon">
            <i className={props.icon ? props.icon : ""}></i>
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center w-100 bottomEle">
        <h6 className="text-white mb-0 mt-0">{props.option}</h6>{" "}
        {/* Hiển thị thời gian */}
        {/* <div className="ms-auto">
          <Button className="ms-auto toggleIcon" onClick={handleClick}>
            <i className="bx bx-dots-vertical-rounded"></i>
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardBox;
