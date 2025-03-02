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
  Skeleton,
  Tag,
  List,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";

import ErrorContent from "../../../../components/common/ErrorContent";

import http from "../../../../services/httpService";
import { formatWithComma } from "../../../../helpers/numbers";

import useDataStore from "../../../../store/DataStore";

import FormAllocation from "./components/FormAllocation";

const { Title, Text } = Typography;

function ViewOrder() {
  const [order, setOrder] = useState(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormAllocationOpen, setIsFormAllocationOpen] = useState(false);

  const { orderId } = useParams();
  const { statuses } = useDataStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsContentLoading(true);
        const { data: order } = await http.get(`/api/orders/${orderId}`);

        console.log(order);

        const newOrderItems = order.order_items.map((orderItem) => ({
          ...orderItem,
          orderItemAllocations: orderItem.order_items_allocation,
        }));

        order.order_items = newOrderItems;
        // order.latest_status.status.id = 10;

        setOrder(order);
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

  if (isContentLoading) {
    return <Skeleton />;
  }

  if (!order) {
    return <Empty />;
  }

  const toggleFormAllocationOpen = () => {
    setIsFormAllocationOpen(!isFormAllocationOpen);
  };

  const handleFormAllocationSubmit = (formData) => {
    toggleFormAllocationOpen();
    const { forInsertOrderAllocation, forInsertInventory } = formData;

    const newOrderItems = order.order_items.map((orderItem) => {
      if (orderItem.id === selectedOrderItem.id) {
        return {
          ...orderItem,
          orderItemAllocations: forInsertOrderAllocation,
          forInsertInventory,
        };
      }
      return orderItem;
    });

    order.order_items = newOrderItems;

    setOrder(order);
  };

  function hasEmptyAllocation(order) {
    return order
      ? order.order_items.some((item) => item.orderItemAllocations.length === 0)
      : true;
  }

  const handleProcess = async () => {
    try {
      setIsContentLoading(true);
      let forInsertInventory = [];
      let forOrderItemsAllocationInsert = [];

      order.order_items.forEach((orderItem) => {
        forInsertInventory = [
          ...forInsertInventory,
          ...orderItem.forInsertInventory,
        ];
        forOrderItemsAllocationInsert = [
          ...forOrderItemsAllocationInsert,
          ...orderItem.orderItemAllocations,
        ];
      });

      console.log({
        order_id: order.id,
        forInventoryInsert: forInsertInventory,
        forOrderItemsAllocationInsert: forOrderItemsAllocationInsert,
      });

      await http.post("/api/saveOrderAllocation", {
        order_id: order.id,
        forInventoryInsert: forInsertInventory,
        forOrderItemsAllocationInsert,
      });
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsContentLoading(false);
    }
  };

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => {
        return record.product.name;
      },
    },
    {
      title: "Quantity",
      dataIndex: "qty",
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
      dataIndex: "total_amount",
      width: 100,
      render: (text) => formatWithComma(text),
    },
    {
      title: "Action",
      width: 50,
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              setSelectedOrderItem({ order, ...record });
              toggleFormAllocationOpen();
            }}
          >
            Allocate
          </Button>
        );
      },
    },
  ];

  if (order.latest_status.status.id !== 9) {
    tableColumns.pop();
  }

  const { order_number, order_items, total_amount, latest_status } = order;

  const status_id = latest_status.status.id;

  let statusColor = "orange";
  if (status_id === 11 && status_id === 12) {
    statusColor = "purple";
  } else if (status_id === 8) {
    statusColor = "red";
  }

  return (
    <>
      <Row>
        <Col span={16}>
          <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={5} style={{ margin: 0 }}>
                Order Number: {order_number}
              </Title>
            </Col>
            <Col>
              <Tag color={statusColor}>{statuses[status_id]}</Tag>
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 0 }}>
              Company Name
            </Title>
            <div>
              <Text type="secondary">Copmany Address</Text>
            </div>
          </div>

          <Table
            columns={tableColumns}
            dataSource={order_items}
            rowKey="product_id"
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <List
                    size="small"
                    bordered
                    dataSource={record.orderItemAllocations}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ fontSize: 11 }}>
                          <Space>
                            <span>
                              <strong>Quantity Allocated</strong>: {item.qty}
                            </span>
                          </Space>
                        </div>
                      </List.Item>
                    )}
                  />
                </>
              ),
            }}
          />

          <Row
            type="flex"
            justify="space-between"
            style={{ marginTop: 16, marginBottom: 16 }}
          >
            <Col></Col>
            <Col>
              <Descriptions
                bordered
                column={1}
                items={[
                  {
                    label: "Subtotal:",
                    children: formatWithComma(total_amount),
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

          {order.latest_status.status.id === 9 && (
            <div style={{ textAlign: "right" }}>
              <Button
                size="large"
                type="primary"
                disabled={hasEmptyAllocation(order)}
                onClick={handleProcess}
              >
                Process
              </Button>
            </div>
          )}
        </Col>
        <Col></Col>
      </Row>

      <Drawer
        title="Select Product"
        open={isFormAllocationOpen}
        destroyOnClose
        width={600}
        onClose={toggleFormAllocationOpen}
      >
        <FormAllocation
          supportingData={{ selectedOrderItem }}
          onSubmit={handleFormAllocationSubmit}
        />
      </Drawer>
    </>
  );
}

export default ViewOrder;
