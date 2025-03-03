import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Input,
  List,
  message,
  Skeleton,
  Empty,
  Tag,
  Divider,
} from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

import ErrorContent from "../../../components/common/ErrorContent";

import http from "../../../services/httpService";

function ProductCard({ product, addToCart }) {
  let actions = [];
  if (product.available_qty === 0) {
    actions = [<Tag color="red">Not Available</Tag>];
  } else if (product.product_category_id === 3) {
    actions = [<Tag color="orange">Call To Order</Tag>];
  } else {
    actions = [
      <Button
        type="primary"
        icon={<ShoppingCartOutlined />}
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </Button>,
    ];
  }

  return (
    <Card
      hoverable
      cover={<img alt={product.name} src={product.img_url} />}
      actions={actions}
    >
      <Card.Meta
        title={product.name}
        description={
          <>
            <p>{product.description}</p>

            <div>PHP {product.selling_price.toFixed(2)}</div>
            <div>Available: {product.available_qty}</div>
          </>
        }
      />
    </Card>
  );
}

function ProductListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);

  const [products, setProducts] = useState([]);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const [error, setError] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsContentLoading(true);
        const { data } = await http.get("/api/products");
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  if (isContentLoading) {
    return <Skeleton />;
  }

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        if (existingProduct.quantity < product.available_qty) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          message.warning(
            `You can only add up to ${product.available_qty} of this item.`
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
    (total, item) => total + item.selling_price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      if (orderNumber.trim() === "") {
        alert("Please enter order number");
        return;
      }

      setPlaceOrderLoading(true);

      const orderItems = cart.map((cartItem) => {
        const { quantity, id, selling_price } = cartItem;
        return {
          product_id: id,
          qty: quantity,
          price: selling_price,
          total_amount: Number(
            (cartItem.selling_price * cartItem.quantity).toFixed(2)
          ),
        };
      });

      const order = {
        total_items: cart.length,
        order_number: orderNumber,
        total_amount: totalPrice,
        order_items: orderItems,
      };

      await http.post("/api/orders", order);
      window.location.reload();
    } catch (error) {
      setError(error);
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Input
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 20 }}
            size="large"
          />
          {products.length === 0 ? (
            <Empty />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredProducts.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <ProductCard product={product} addToCart={addToCart} />
                </Col>
              ))}
            </Row>
          )}
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
                      disabled={item.quantity >= item.available_qty}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`PHP ${item.selling_price.toFixed(2)} x ${
                      item.quantity
                    }`}
                  />
                  <div>
                    PHP {(item.selling_price * item.quantity).toFixed(2)}
                  </div>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 20, fontWeight: "bold" }}>
              Total: PHP {totalPrice.toFixed(2)}
            </div>

            <Divider />
            <Input
              style={{ width: "100%", marginBottom: 16 }}
              placeholder="Enter your Order Number Here"
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <Button
              size="large"
              type="primary"
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
              loading={placeOrderLoading}
            >
              Place Order
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductListing;
