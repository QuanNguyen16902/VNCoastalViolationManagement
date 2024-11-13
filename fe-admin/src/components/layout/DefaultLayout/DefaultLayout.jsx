import { useEffect } from "react";
import { useConfig } from "../../pages/SettingPage/ConfigProvider.js";
import Footer from "./Footer/Footer.jsx";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import PageTitle from "./PageTitle/PageTitle.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
function DefaultLayout({ children, pageTitle, childPage }) {
  const { config, loadConfig } = useConfig();
  useEffect(() => {
    loadConfig();
  }, []);
  return (
    <div>
      <Header />
      <div>
        <Sidebar />
        <PageTitle page={pageTitle} childPage={childPage} />
        <Main children={children} />
        <Footer />
      </div>
    </div>
  );
}

export default DefaultLayout;
