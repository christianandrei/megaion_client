import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Divider } from "antd";

const FormPOItem = ({ formData, supportingData, onSubmit }) => {
  const [formPOItemInstance] = Form.useForm();

  useEffect(() => {
    if (formData) {
      formPOItemInstance.setFieldsValue(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleFormValuesChange = (changedValues) => {
    const fieldName = Object.keys(changedValues)[0];
    if (fieldName === "quantity" || fieldName === "price") {
      const values = formPOItemInstance.getFieldsValue();
      const { quantity, price } = values;
      const amount = quantity * price;
      formPOItemInstance.setFieldsValue({ amount });
    }
  };

  const handleFormFinish = (values) => {
    // Convert `undefined` to `null`
    for (let key in values) {
      if (values[key] === undefined) {
        values[key] = null;
      }
    }

    onSubmit(values);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const { products } = supportingData;

  return (
    <Form
      {...layout}
      form={formPOItemInstance}
      validateMessages={{
        required: "This is required.",
      }}
      initialValues={{
        quantity: 0,
        price: 0,
        amount: 0,
      }}
      onValuesChange={handleFormValuesChange}
      onFinish={handleFormFinish}
    >
      <Form.Item label="Product" name="product_id" rules={[{ required: true }]}>
        <Select
          options={products.map((product) => ({
            value: product.id,
            label: product.name,
          }))}
        />
      </Form.Item>
      <Form.Item label="Unit" name="product_unit" rules={[{ required: true }]}>
        <Select
          options={[
            { value: "Box", label: "Box" },
            { value: "Piece", label: "Piece" },
            { value: "Pack", label: "Pack" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Price" name="price" rules={[{ required: true }]}>
        <InputNumber
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
        <InputNumber
          readOnly
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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

export default FormPOItem;
