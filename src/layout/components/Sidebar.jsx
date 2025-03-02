import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  InboxOutlined,
  TeamOutlined,
  UserOutlined,
  BankOutlined,
  FileDoneOutlined,
  PushpinOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  PieChartOutlined,
  MenuOutlined,
  GroupOutlined,
  DatabaseOutlined,
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
      key: "/products",
      icon: <UnorderedListOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: "/inventory",
      icon: <DatabaseOutlined />,
      label: <Link to="/inventory">Inventory</Link>,
    },
    {
      key: "/purchaseOrders",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/purchaseOrders">Purchase Orders</Link>,
    },
    {
      key: "/orders",
      icon: <ShoppingOutlined />,
      label: <Link to="/orders">Orders</Link>,
    },
    {
      key: "/reports",
      icon: <PieChartOutlined />,
      label: <Link to="/reports">Reports</Link>,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: "/productGroups",
      icon: <GroupOutlined />,
      label: <Link to="/productGroups">Product Groups</Link>,
      group: "Others",
    },
    {
      key: "/suppliers",
      icon: <InboxOutlined />,
      label: <Link to="/suppliers">Suppliers</Link>,
      group: "Others",
    },
    {
      key: "/companies",
      icon: <TeamOutlined />,
      label: <Link to="/companies">Companies</Link>,
      group: "Others",
    },
    {
      key: "/locations",
      icon: <PushpinOutlined />,
      label: <Link to="/locations">Locations</Link>,
      group: "Others",
    },
    {
      key: "/warehouses",
      icon: <BankOutlined />,
      label: <Link to="/warehouses">Warehouses</Link>,
      group: "Others",
    },
  ];

  const customerMenuItems = [
    {
      key: "/ecommerce",
      icon: <UnorderedListOutlined />,
      label: <Link to="/ecommerce">Ecommerce</Link>,
    },
    {
      key: "/orders",
      icon: <ShoppingOutlined />,
      label: <Link to="/orders">Orders</Link>,
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
    const otherMenuChildren = adminMenuItems.filter(
      (item) => item.group === "Others"
    );
    const newAdminMenuItems = adminMenuItems.filter(
      (item) => item.group !== "Others"
    );
    menuItems = [
      ...menuItems,
      ...newAdminMenuItems,
      {
        key: "/Others",
        icon: <MenuOutlined />,
        label: "Others",
        children: otherMenuChildren,
      },
    ];
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
