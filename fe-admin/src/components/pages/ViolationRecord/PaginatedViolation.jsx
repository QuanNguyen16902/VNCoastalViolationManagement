import React from "react";
import { Dropdown, Pagination } from "react-bootstrap";

const PaginationComponent = ({
  page,
  size,
  totalPages,
  onSizeChange,
  onPageChange,
}) => {
  return (
    <div className="row d-flex justify-content-between">
      <div className="col-auto">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {size} <span className="caret"></span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {[5, 10, 20, 30].map((pageSize) => (
              <Dropdown.Item
                key={pageSize}
                onClick={() => onSizeChange(pageSize)}
                href="#"
              >
                {pageSize}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="col-auto">
        <Pagination>
          {/* Render các số trang */}
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={index === page}
              onClick={() => onPageChange(index)}
            >
              {index + 1}
            </Pagination.Item>
          ))}

          {/* Nút next page */}
          {page < totalPages - 1 && (
            <Pagination.Next onClick={() => onPageChange(page + 1)} />
          )}

          {/* Nút last page */}
          {page < totalPages - 1 && (
            <Pagination.Last onClick={() => onPageChange(totalPages - 1)} />
          )}
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationComponent;
