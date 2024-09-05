import ForgotPasswordPage from "./components/pages/Auth/forgot-password/ForgotPassword";
import ResetPasswordPage from "./components/pages/Auth/forgot-password/ResetPassword";
import LoginPage from "./components/pages/Auth/LoginRegisterPage";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import RolesGroup from "./components/pages/RolesGroupPage/RolesGroup";
import Roles from "./components/pages/RolesPage/Roles";
import SystemLogs from "./components/pages/SystemLog";
import Users from "./components/pages/UsersPage/Users";
const publicRoutes = [

  {
    path: "/login",
    component: LoginPage,
    layout: LoginPage,
  },
  {
    path: "/register",
    component: LoginPage,
    layout: LoginPage,
  },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
    layout: ForgotPasswordPage,
  },
  {
    path: "/reset-password",
    component: ResetPasswordPage,
    layout: ResetPasswordPage,
  }
];

const privateRoutes = [
  { path: "/", component: Dashboard, pageTitle: "Dashboard" },
  { path: "/roles", component: Roles, pageTitle: "Quản lý phân quyền", childPage: "Danh sách quyền" },
  { path: "/users", component: Users, pageTitle: "Quản lý người dùng", childPage: "Danh sách người dùng" },
  {
    path: "/roles-group",
    component: RolesGroup,
    pageTitle: "Quản lý nhóm quyền",
    childPage: "Danh sách nhóm quyền"
  },
  { path: "/logs", component: SystemLogs, pageTitle: "Nhật ký hệ thống"},
];

export { privateRoutes, publicRoutes };
