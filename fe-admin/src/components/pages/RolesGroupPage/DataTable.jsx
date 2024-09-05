import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import userService from '../../../service/user.service';

function DataTable() {
    const [data, setData] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await userService.getRolesGroup();
          setData(response.data);
        } catch (e) {
          console.log(e.message);
        }
      };
      fetchData();
   
      
    }, []);
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'userId', headerName: 'User ID', width: 130 },
        { field: 'roleId', headerName: 'Role ID', width: 130 },
       
      ];
      
       
      
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  )
}

export default DataTable

 