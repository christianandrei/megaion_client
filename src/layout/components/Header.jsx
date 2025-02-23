import { Layout, Button, Row, Col, Dropdown, Avatar, Badge, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import useAppStore from "../../store/AppStore";

function Header() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { isSidebarOpen, toggleSidebar } = useAppStore();

  const menuItems = [
    {
      key: "account settings",
      label: "Account Settings",
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ];

  return (
    <Layout.Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Row justify="space-between">
        <Col>
          <Button
            type="text"
            icon={isSidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={toggleSidebar}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
        </Col>
        <Col>
          <Button type="text" style={{ width: 64, height: 64 }}>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 16 }} />
            </Badge>
          </Button>
          <Dropdown menu={{ items: menuItems }} placement="bottomLeft">
            <Button type="text" style={{ height: 64 }}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#1677ff",
                }}
              />{" "}
              Admin
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </Layout.Header>
  );
}

export default Header;
