// import Icons
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
// import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, Routes } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "./App.css";
import DefaultLayout from "./components/layout/DefaultLayout/DefaultLayout";
import Error403 from "./components/layout/Error/Error403";
import Error404 from "./components/layout/Error/Error404";
import Error500 from "./components/layout/Error/Error500";
import { privateRoutes, publicRoutes } from "./router";
import { getToken, isTokenExpired, removeToken } from "./utils/auth";

const PrivateRoute = ({ element, ...rest }) => {
  const token = getToken();
  return token ? element : <Navigate to="/login" />;
};

// Component to protect public routes
const PublicRoute = ({ element, ...rest }) => {
  const token = getToken();
  return !token ? element : <Navigate to="/" />;
};

function App() {
  useEffect(() => {
    const token = getToken();
    console.log("Token hiện tại:", token);

    if (token) {
      if (isTokenExpired()) {
        console.log("Token đã hết hạn");
        removeToken();
        sessionStorage.setItem("sessionExpired", "true");
        window.location.href = "/login";
      } else {
        console.log("Token chưa hết hạn");
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000 - Date.now();
        console.log("Thời gian hết hạn (ms):", expirationTime);
        setTimeout(() => {
          console.log("Thực hiện logout do hết hạn token");
          removeToken();
          sessionStorage.setItem("sessionExpired", "true");
          window.location.href = "/login";
        }, expirationTime);
      }
    }

    const sessionExpired = sessionStorage.getItem("sessionExpired");
    console.log("sessionExpired:", sessionExpired);
    if (sessionExpired === "true") {
      toast.warn("Phiên làm việc đã hết hạn");
      setTimeout(() => {
        sessionStorage.removeItem("sessionExpired");
      }, 2000);
    }
  }, []);

  return (
    <div>
      <Routes>
        {privateRoutes.map((route, index) => {
          const Layout = route.layout || DefaultLayout;
          const Page = route.component;
          const pageTitle = route.pageTitle;
          const childPageTitle = route.childPage;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRoute
                  element={
                    <Layout
                      pageTitle={pageTitle}
                      childPage={childPageTitle}
                      children={<Page />}
                    ></Layout>
                  }
                />
              }
            />
          );
        })}

        {publicRoutes.map((route, index) => {
          const Layout = route.layout || DefaultLayout;
          const Page = route.component;
          const pageTitle = route.pageTitle;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PublicRoute
                  element={
                    <Layout pageTitle={pageTitle}>
                      <Page />
                    </Layout>
                  }
                />
              }
            />
          );
        })}
        <Route path="/403" element={<Error403 />} />

        {/* Route mặc định cho các trang không tồn tại */}
        <Route path="*" element={<Error404 />} />
        <Route path="/500" element={<Error500 />} />
      </Routes>
    </div>
  );
}

export default App;
