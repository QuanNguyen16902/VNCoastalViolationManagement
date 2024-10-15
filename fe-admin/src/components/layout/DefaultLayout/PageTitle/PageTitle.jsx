import React from "react";
import "./pageTitle.css";
function PageTitle({ page, childPage }) {
  return (
    <div className="pagetitle">
      <h1>{page}</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">
              <i className="bi bi-house-door"></i>
            </a>
          </li>
          <li className="breadcrumb-item">{page}</li>
          {childPage && <li className="breadcrumb-item active">{childPage}</li>}
        </ol>
      </nav>
    </div>
  );
}

export default PageTitle;
