import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import LandingPage from "./pages/landing-page/LandingPage";
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import OverviewPage from "./pages/dashboard-pages/overview-page/OverviewPage";
import OrderPage from "./pages/dashboard-pages/order-page/OrderPage";
import CheckoutPage from "./pages/dashboard-pages/checkout-page/CheckoutPage";
import AddressPage from "./pages/dashboard-pages/address-page/AddressPage";
import SettingPage from "./pages/dashboard-pages/setting-page/SettingPage";
import ToolPage from "./pages/dashboard-pages/tool-page/ToolPage";
import PackagePage from "./pages/dashboard-pages/package-page/PackagePage";
import NotFoundPage from "./pages/not-found-page/NotFoundPage";
import LogPage from "./pages/dashboard-pages/log-page/LogPage";
import TransactionPage from "./pages/dashboard-pages/transaction-page/TransactionPage";
import UserPage from "./pages/dashboard-pages/user-page/UserPage";
import ResetPasswordPage from "./pages/reset-password-page/ResetPasswordPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset_password" element={<ResetPasswordPage />}/>
          <Route path="/dashboard/overview" element={<OverviewPage />} />
          <Route path="/dashboard/order" element={<OrderPage />} />
          <Route path="/dashboard/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard/address" element={<AddressPage />} />
          <Route path="/dashboard/package" element={<PackagePage />} />
          <Route path="/dashboard/settings" element={<SettingPage />} />
          <Route path="/dashboard/log" element={<LogPage />} />
          <Route path="/dashboard/transaction" element={<TransactionPage />} />
          <Route path="/dashboard/tool" element={<ToolPage />} />
          <Route path='/dashboard/user' element={<UserPage />}/>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
