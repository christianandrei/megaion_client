import { Routes, Route, Navigate } from "react-router-dom";

import PublicRoutes from "./components/PublicRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import RoleRoutes from "./components/RoleRoutes.jsx";

import Login from "./pages/public/Login";

import Layout from "./layout/Index.jsx";
import PageTitleProvider from "./components/common/PageTitleProvider";

import Dashboard from "./pages/private/Dashboard/Index";
import Suppliers from "./pages/private/Suppliers/Index.jsx";
import Companies from "./pages/private/Companies/Index.jsx";
import Products from "./pages/private/Products/Index";
import Ecommerce from "./pages/private/Ecommerce/Index";

function App() {
  const adminRoutes = [
    {
      title: "Suppliers",
      subTitle: "supplier management",
      path: "/suppliers",
      element: <Suppliers />,
    },
    {
      title: "Companies",
      subTitle: "customer/company management",
      path: "/companies",
      element: <Companies />,
    },
    {
      title: "Products",
      subTitle: "product management",
      path: "/products",
      element: <Products />,
    },
  ];

  const customerRoutes = [
    {
      title: "Customer Order Page",
      subTitle: "place your order here",
      path: "/customer/orderPage",
      element: <Ecommerce />,
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="/" element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <PageTitleProvider
                route={{
                  title: "Dashboard",
                  subTitle: "track, analyze, and optimize your operations",
                }}
              >
                <Dashboard />
              </PageTitleProvider>
            }
          />
          <Route path="/" element={<RoleRoutes userType="Admin" />}>
            {adminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PageTitleProvider route={route}>
                    {route.element}
                  </PageTitleProvider>
                }
              />
            ))}
          </Route>
          <Route path="/" element={<RoleRoutes userType="Customer" />}>
            {customerRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PageTitleProvider route={route}>
                    {route.element}
                  </PageTitleProvider>
                }
              />
            ))}
          </Route>
        </Route>
      </Route>
      <Route path="/404" element={<div>Page Not Found</div>} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}

export default App;
