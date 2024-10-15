// src/components/PaymentSuccess.js

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  return (
    <div className="container-sm d-flex justify-content-center align-items-center">
        <div className="card"></div>
    </div>
    // {/* <Container maxWidth="sm" sx={{ mt: 8 }}>
    //   <Paper elevation={3} sx={{ p: 4 }}>
    //     <Grid container spacing={2} direction="column" alignItems="center">
          // <Grid item>
    //         <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
    //       </Grid>
    //       <Grid item>
    //         <Typography variant="h4" component="h1" gutterBottom>
    //           Nộp Phạt Thành Công!
    //         </Typography>
    //       </Grid>
    //       {orderId && (
    //         <Grid item>
    //           <Typography variant="h6" component="p">
    //             Mã đơn hàng: <strong>{orderId}</strong>
    //           </Typography>
    //         </Grid>
    //       )}
    //       <Grid item>
    //         <Typography variant="body1" component="p" align="center">
    //           Bạn sẽ nhận được xác nhận qua email.
    //         </Typography>
    //       </Grid>
    //       <Grid item>
    //         <Button
    //           variant="contained"
    //           color="primary"
    //           startIcon={<ArrowBackIcon />}
    //           href="/penalty-decision"
    //         >
    //           Quay lại
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   </Paper>
    // </Container> */}
  );
};

export default PaymentSuccess;
