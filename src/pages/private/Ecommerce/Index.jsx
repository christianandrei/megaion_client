import React, { useState } from "react";
import { Card, Col, Row, Button, Input, List, message } from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

const products = [
  {
    id: 1,
    name: "Product 1",
    description: "Description for product 1.",
    price: 10.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 5,
  },
  {
    id: 2,
    name: "Product 2",
    description: "Description for product 2.",
    price: 20.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 3,
  },
  {
    id: 3,
    name: "Product 3",
    description: "Description for product 3.",
    price: 30.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 8,
  },
  {
    id: 4,
    name: "Product 4",
    description: "Description for product 4.",
    price: 40.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 2,
  },
  {
    id: 5,
    name: "Product 5",
    description: "Description for product 5.",
    price: 50.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 10,
  },
  {
    id: 6,
    name: "Product 6",
    description: "Description for product 6.",
    price: 60.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 6,
  },
  {
    id: 7,
    name: "Product 7",
    description: "Description for product 7.",
    price: 70.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 4,
  },
  {
    id: 8,
    name: "Product 8",
    description: "Description for product 8.",
    price: 80.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 7,
  },
  {
    id: 9,
    name: "Product 9",
    description: "Description for product 9.",
    price: 90.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 9,
  },
  {
    id: 10,
    name: "Product 10",
    description: "Description for product 10.",
    price: 100.0,
    image: "https://via.placeholder.com/150",
    quantityLimit: 1,
  },
];

function ProductCard({ product, addToCart }) {
  return (
    <Card
      hoverable
      cover={<img alt={product.name} src="https://placehold.co/150" />}
      actions={[
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </Button>,
      ]}
    >
      <Card.Meta
        title={product.name}
        description={
          <>
            <p>{product.description}</p>
            <p>${product.price.toFixed(2)}</p>
          </>
        }
      />
    </Card>
  );
}

function ProductListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        if (existingProduct.quantity < product.quantityLimit) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          message.warning(
            `You can only add up to ${product.quantityLimit} of this item.`
          );
          return prevCart;
        }
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Input
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 20 }}
          />
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} addToCart={addToCart} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={8}>
          <Card title="Your Cart">
            <List
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => updateQuantity(item.id, -1)}
                    />,
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.quantity >= item.quantityLimit}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`$${item.price.toFixed(2)} x ${item.quantity}`}
                  />
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 20, fontWeight: "bold" }}>
              Total: ${totalPrice.toFixed(2)}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductListing;
