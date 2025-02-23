import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  InboxOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import useAppStore from "../../store/AppStore";
import useUserStore from "../../store/UserStore";
import megaionLogo from "../../assets/images/megaion.png";
import megaionLogoSmall from "../../assets/images/megaion-small.png";

function Sidebar() {
  const { isSidebarOpen } = useAppStore();
  const { type: userType } = useUserStore();

  const location = useLocation();

  const adminMenuItems = [
    {
      key: "/suppliers",
      icon: <InboxOutlined />,
      label: <Link to="/suppliers">Suppliers</Link>,
    },
    {
      key: "/companies",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/companies">Companies</Link>,
    },
    {
      key: "/products",
      icon: <UnorderedListOutlined />,
      label: <Link to="/products">Products</Link>,
    },
  ];

  const customerMenuItems = [
    {
      key: "/customer/orderPage",
      icon: <UnorderedListOutlined />,
      label: <Link to="/customer/orderPage">Order Page</Link>,
    },
  ];

  let menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
  ];

  if (userType === "Admin") {
    menuItems = [...menuItems, ...adminMenuItems];
  } else if (userType === "Customer") {
    menuItems = [...menuItems, ...customerMenuItems];
  }

  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={!isSidebarOpen}
      theme="light"
      width={220}
      className="sidebar"
    >
      <div style={{ textAlign: "center" }}>
        <img
          src={isSidebarOpen ? megaionLogo : megaionLogoSmall}
          alt="Megaion Logo"
          style={{
            height: 64,
            width: isSidebarOpen ? 200 : "auto",
            padding: 10,
            borderRadius: 15,
          }}
        />
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Layout.Sider>
  );
}

export default Sidebar;
