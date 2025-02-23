import React, { useEffect } from "react";
import { Form, Input, Button, Select, Divider } from "antd";

const FormCompany = ({ formData, onSubmit }) => {
  const [formCompanyInstance] = Form.useForm();

  useEffect(() => {
    if (formData) {
      const { name, email, shipping_address } = formData;
      formCompanyInstance.setFieldsValue({
        name,
        email,
        shipping_address,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleFormFinish = (values) => {
    // Convert `undefined` to `null`
    for (let key in values) {
      if (values[key] === undefined) {
        values[key] = null;
      }
    }

    console.log({ ...values, status: "Active" });
    //onSubmit(values);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Form
      {...layout}
      form={formCompanyInstance}
      validateMessages={{
        required: "This is required.",
      }}
      onFinish={handleFormFinish}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
            message: "Invalid email format.",
          },
          { required: true },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone Number"
        name="phone_number"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Shipping Address"
        name="shipping_address"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Physical Address" name="physical_address">
        <Input />
      </Form.Item>
      <Form.Item label="Business Type" name="business_type">
        <Select
          options={[
            {
              value: "Sole",
              label: "Sole",
            },
            {
              value: "Partnership",
              label: "Partnership",
            },
            {
              value: "Corporation",
              label: "Corporation",
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="Industry" name="industry">
        <Input />
      </Form.Item>
      <Form.Item label="Primary Contact Name" name="primary_contact_name">
        <Input />
      </Form.Item>
      <Form.Item label="Primary Contact Title" name="primary_contact_title">
        <Input />
      </Form.Item>
      <Form.Item label="Primary Contact Number" name="primary_contact_number">
        <Input />
      </Form.Item>
      <Form.Item label="Secondary Contact Name" name="secondary_contact_name">
        <Input />
      </Form.Item>
      <Form.Item label="Secondary Contact Title" name="secondary_contact_title">
        <Input />
      </Form.Item>
      <Form.Item
        label="Secondary Contact Number"
        name="secondary_contact_number"
      >
        <Input />
      </Form.Item>
      <Form.Item label="Payment Term" name="payment_term">
        <Input />
      </Form.Item>
      <Form.Item label="Payment Method" name="payment_method">
        <Input />
      </Form.Item>
      <Form.Item label="Credit Limit" name="credit_limit">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Category" name="category">
        <Select
          options={[
            {
              value: "High-Value",
              label: "High-Value",
            },
            {
              value: "Low-Value",
              label: "Low-Value",
            },
            {
              value: "Strategic Partner",
              label: "Strategic Partner",
            },
          ]}
        />
      </Form.Item>
      <Divider />
      <Form.Item noStyle>
        <div style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            OK
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default FormCompany;
