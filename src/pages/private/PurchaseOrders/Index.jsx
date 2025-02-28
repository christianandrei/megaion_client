import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Spin,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Dropdown,
  Tabs,
  Badge,
  Typography,
  Tag,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";

import ErrorContent from "../../../components/common/ErrorContent";

import http from "../../../services/httpService";

import { getColumnSearchProps } from "../../../helpers/TableFilterProps";

const { Text } = Typography;

function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getPurchaseOrders = async () => {
    const { data } = await http.get("/api/purchaseOrders");
    setPurchaseOrders(data);
  };

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        setIsContentLoading(true);
        await getPurchaseOrders();
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  const handleUpdatePurchaseOrder = async (purchaseOrder, newStatus) => {
    try {
      setIsContentLoading(true);
      await http.put(`/api/purchaseOrders/${purchaseOrder.id}`, {
        status: newStatus,
      });
      await getPurchaseOrders();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const tableColumns = [
    {
      title: "Purchase Order No.",
      dataIndex: "id",
      ...getColumnSearchProps("id"),
      render: (_, record) => {
        const { id, supplier, notes } = record;

        return (
          <div>
            <div>
              <Text strong>{id}</Text>
            </div>
            <div>{supplier.name}</div>
            <div>
              <Text type="secondary">{supplier.address}</Text>
            </div>
            <div>
              {notes && (
                <Text type="secondary" italic>
                  {notes}
                </Text>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (_, record) => {
        const status = record.status;
        let color = "orange";
        if (status === "Approved") {
          color = "green";
        } else if (status === "Fulfilled") {
          color = "blue";
        } else if (status === "Paid") {
          color = "purple";
        } else if (status === "Cancelled") {
          color = "red";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      width: 50,
      render: (_, record) => {
        const menuItems = [
          { key: "View", label: "View Details" },
          {
            type: "divider",
          },
          { key: "Cancelled", label: "Cancelled", danger: true },
        ];

        if (record.status === "Pending") {
          menuItems.unshift({ key: "Approved", label: "Approved" });
        }

        if (record.status === "Approved") {
          menuItems.unshift({ key: "Fulfilled", label: "Fulfilled" });
        }

        if (record.status === "Fulfilled") {
          menuItems.unshift({ key: "Paid", label: "Paid" });
          menuItems.pop();
          menuItems.pop();
        }

        if (record.status === "Paid" || record.status === "Cancelled") {
          menuItems.pop();
          menuItems.pop();
        }

        const handleMenuClick = ({ key }) => {
          if (key === "View") {
            navigate(`/purchaseOrders/${record.id}`);
          } else {
            Modal.confirm({
              title: `${key} Purchase Order`,
              content: `Are you sure you want to ${key.toLowerCase()} this purchase order?`,
              onOk: async () => {
                handleUpdatePurchaseOrder(record, key);
              },
            });
          }
        };

        return (
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button shape="circle" onClick={(e) => e.stopPropagation()}>
              <MoreOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const pendingPOs = purchaseOrders.filter((po) => po.status === "Pending");
  const approvedPOs = purchaseOrders.filter((po) => po.status === "Approved");
  const fulfilledPOs = purchaseOrders.filter((po) => po.status === "Fulfilled");
  const cancelledPos = purchaseOrders.filter((po) => po.status === "Cancelled");

  const tabItems = [
    {
      key: "1",
      label: (
        <>
          Pending{" "}
          {pendingPOs.length > 0 && (
            <Badge count={pendingPOs.length} color="gold" />
          )}
        </>
      ),
      children: (
        <Table columns={tableColumns} dataSource={pendingPOs} rowKey="id" />
      ),
    },
    {
      key: "2",
      label: (
        <>
          Approved{" "}
          {approvedPOs.length > 0 && (
            <Badge count={approvedPOs.length} color="green" />
          )}
        </>
      ),
      children: (
        <Table columns={tableColumns} dataSource={approvedPOs} rowKey="id" />
      ),
    },
    {
      key: "3",
      label: (
        <>
          Fulfilled{" "}
          {fulfilledPOs.length > 0 && (
            <Badge count={fulfilledPOs.length} color="blue" />
          )}
        </>
      ),
      children: (
        <Table columns={tableColumns} dataSource={fulfilledPOs} rowKey="id" />
      ),
    },
    {
      key: "4",
      label: "Cancelled",
      children: (
        <Table columns={tableColumns} dataSource={cancelledPos} rowKey="id" />
      ),
    },
    {
      key: "5",
      label: "All Purchase Orders",
      children: (
        <Table columns={tableColumns} dataSource={purchaseOrders} rowKey="id" />
      ),
    },
  ];

  return (
    <>
      <Spin spinning={isContentLoading} tip="loading ...">
        <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
          <Col></Col>
          <Col>
            <Link to="/purchaseOrders/create">
              <Button type="primary">Create Purchase Order</Button>
            </Link>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Spin>
    </>
  );
}

export default PurchaseOrders;
