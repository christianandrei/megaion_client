import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Spin,
  Row,
  Col,
  Button,
  Drawer,
  Table,
  Modal,
  Dropdown,
  Select,
  Typography,
  Space,
  Descriptions,
  Input,
  Empty,
  Tag,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";

import ErrorContent from "../../../components/common/ErrorContent";

import http from "../../../services/httpService";
import { formatWithComma } from "../../../helpers/numbers";

const { Title, Text } = Typography;

function CreatePurchaseOrder() {
  const [products, setProducts] = useState([]);
  const [purchaseOrder, setPurcaseOrder] = useState(null);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const { purchaseOrderId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsContentLoading(true);

        const { data: products } = await http.get("/api/products");
        const { data: purchaseOrder } = await http.get(
          `/api/purchaseOrders/${purchaseOrderId}`
        );
        setProducts(products);
        setPurcaseOrder(purchaseOrder);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  if (!purchaseOrder) {
    return (
      <Spin spinning={isContentLoading} tip="loading ...">
        <Empty />
      </Spin>
    );
  }

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => {
        return products.find(({ id }) => id === record.product_id).name;
      },
    },
    {
      title: "Unit",
      dataIndex: "product_unit",
      width: 100,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 100,
      render: (text) => formatWithComma(text),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 100,
      render: (text) => formatWithComma(text),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
      render: (text) => formatWithComma(text),
    },
  ];

  const {
    supplier,
    purchase_order_items,
    notes,
    subtotal_amount,
    total_amount,
    status,
  } = purchaseOrder;

  let statusColor = "orange";
  if (status === "Approved") {
    statusColor = "green";
  } else if (status === "Fulfilled") {
    statusColor = "blue";
  } else if (status === "Paid") {
    statusColor = "purple";
  } else if (status === "Cancelled") {
    statusColor = "red";
  }

  return (
    <>
      <Row>
        <Col span={16}>
          <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={5} style={{ margin: 0 }}>
                Purchase Order Number: #{purchaseOrder.id}
              </Title>
            </Col>
            <Col>
              <Tag color={statusColor}>{status}</Tag>
            </Col>
          </Row>
          {supplier && (
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ marginBottom: 0 }}>
                {supplier.name}
              </Title>
              <div>
                <Text type="secondary">{supplier.address}</Text>
              </div>
              <div>
                <Text type="secondary">{supplier.email}</Text>
              </div>
              <div>
                <Text type="secondary">{supplier.phone}</Text>
              </div>
            </div>
          )}
          <Table
            columns={tableColumns}
            dataSource={purchase_order_items}
            rowKey="product_id"
            pagination={false}
          />
          <Row type="flex" justify="space-between" style={{ marginTop: 16 }}>
            <Col>
              <Space>
                <span>Notes:</span>
                <span>{notes}</span>
              </Space>
            </Col>
            <Col>
              <Descriptions
                bordered
                column={1}
                items={[
                  {
                    label: "Subtotal:",
                    children: formatWithComma(subtotal_amount),
                  },
                  {
                    label: "Total:",
                    children: formatWithComma(total_amount),
                  },
                ]}
                style={{ marginBottom: 16 }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default CreatePurchaseOrder;
