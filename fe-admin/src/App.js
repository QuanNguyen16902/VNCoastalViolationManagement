// import Icons
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
// import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import DefaultLayout from "./components/layout/DefaultLayout/DefaultLayout";
import Error403 from "./components/layout/Error/Error403";
import Error404 from "./components/layout/Error/Error404";
import Error500 from "./components/layout/Error/Error500";
import { privateRoutes, publicRoutes } from "./router";


const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

// Component to protect public routes
const PublicRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');
  return !token ? element : <Navigate to="/" />;
};

function App() {
  const token = localStorage.getItem('token')

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
                    <Layout pageTitle={pageTitle} childPage={childPageTitle}>
                      <Page />
                    </Layout>
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
