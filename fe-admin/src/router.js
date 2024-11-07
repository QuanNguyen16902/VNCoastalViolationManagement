import ForgotPasswordPage from "./components/pages/Auth/forgot-password/ForgotPassword";
import ResetPasswordPage from "./components/pages/Auth/forgot-password/ResetPassword";
import LoginPage from "./components/pages/Auth/LoginRegisterPage";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import AddPenaltyDecision from "./components/pages/PenaltyDecision/AddPenaltyDecision";
import DecisionMain from "./components/pages/PenaltyDecision/DecisionMain";
import PaymentFailure from "./components/pages/PenaltyDecision/Payment/PaymentFailure";
import PaymentSuccess from "./components/pages/PenaltyDecision/Payment/PaymentSuccess";
import VnPayForm from "./components/pages/PenaltyDecision/Payment/VnpayForm";
import Permissions from "./components/pages/PermissionPage/Permissions";
import CardBox from "./components/pages/reports/report";
import Roles from "./components/pages/RolesPage/Roles";
import Settings from "./components/pages/SettingPage/Settings";
import SystemLogs from "./components/pages/SystemLog/SystemLog";
import UserProfile from "./components/pages/UserProfile/UserProfile";
import UsersGroup from "./components/pages/UsersGroupPage/UsersGroup";
import Users from "./components/pages/UsersPage/Users";
import ViolationPeople from "./components/pages/ViolationPeople/ViolationPeople";
import AddViolationRecord from "./components/pages/ViolationRecord/AddViolation/AddViolationRecord";
import ViolationMain from "./components/pages/ViolationRecord/ViolationMain";
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
  },
];

const privateRoutes = [
  { path: "/", component: Dashboard, pageTitle: "Dashboard" },
  {
    path: "/roles",
    component: Roles,
    pageTitle: "Quản lý vai trò",
    childPage: "Danh sách vai trò (Roles)",
  },
  {
    path: "/permissions",
    component: Permissions,
    pageTitle: "Quản lý phân quyền",
    childPage: "Danh sách phân quyền (Permissions)",
  },
  {
    path: "/users",
    component: Users,
    pageTitle: "Quản lý người dùng",
    childPage: "Danh sách người dùng",
  },
  {
    path: "/user-detail",
    component: UserProfile,
    pageTitle: "Hồ sơ người dùng",
  },
  {
    path: "/users-group",
    component: UsersGroup,
    pageTitle: "Quản lý nhóm người dùng",
    childPage: "Danh sách nhóm người dùng",
  },
  { path: "/logs", component: SystemLogs, pageTitle: "Nhật ký hệ thống" },
  { path: "/settings", component: Settings, pageTitle: "Settings" },
  {
    path: "/violation-person",
    component: ViolationPeople,
    pageTitle: "Người vi phạm",
    // layout: BienBan,
  },
  {
    path: "/violation-records/new",
    component: AddViolationRecord,
    pageTitle: "Biên bản vi phạm",
    // layout: BienBan,
  },
  {
    path: "/violation-records",
    component: ViolationMain,
    pageTitle: "Biên bản vi phạm",
    childPage: "Danh sách",
    // layout: BienBan,
  },
  {
    path: "/penalty-decision",
    component: DecisionMain,
    pageTitle: "Quyết định xử phạt",
    childPage: "Danh sách",
    // layout: BienBan,
  },
  {
    path: "/penalty-decision/new",
    component: AddPenaltyDecision,
    pageTitle: "Quyết định xử phạt",
    // layout: BienBan,
  },
  {
    path: "/report",
    component: CardBox,
    pageTitle: "Báo cáo",
  },
  {
    path: "/payment",
    component: VnPayForm,
    pageTitle: "Nộp phạt",
    // layout: BienBan,
  },
  {
    path: "/payment-success",
    component: PaymentSuccess,
    pageTitle: "Nộp phạt",
    // layout: BienBan,
  },
  {
    path: "/payment-failure",
    component: PaymentFailure,
    pageTitle: "Nộp phạt",
    // layout: BienBan,
  },
];

export { privateRoutes, publicRoutes };
