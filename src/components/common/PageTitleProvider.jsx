import { Layout, Typography, Space, theme } from "antd";

const { Title, Text } = Typography;

function PageTitleProvider({ route, children }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { title, subTitle } = route;

  return (
    <>
      <Space>
        <Title level={4} style={{ margin: 0, padding: "16px 0 24px" }}>
          {title}
        </Title>
        <Text type="secondary">{subTitle}</Text>
      </Space>
      <Layout.Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {children}
      </Layout.Content>
    </>
  );
}

export default PageTitleProvider;
