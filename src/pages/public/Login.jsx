import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";

import http from "../../services/httpService";
import useAppStore from "../../store/UserStore";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const res = await http.post("/api/login", values);
      localStorage.setItem("token", res.data.token);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
