import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Spin,
  Row,
  Col,
  Button,
  Table,
  Dropdown,
  Tabs,
  Badge,
  Typography,
  Tag,
  App,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";

import ErrorContent from "../../../components/common/ErrorContent";

import http from "../../../services/httpService";

import { getColumnSearchProps } from "../../../helpers/TableFilterProps";
import { formatWithComma } from "../../../helpers/numbers";

import useDataStore from "../../../store/DataStore";

const { Text } = Typography;

function Orders() {
  const [orders, setOrders] = useState([]);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { statuses } = useDataStore();
  const { modal } = App.useApp();

  const getOrders = async () => {
    const { data } = await http.get("/api/orders");
    setOrders(data);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsContentLoading(true);
        await getOrders();
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  const handleUpdateOrder = async (order, newStatusId) => {
    try {
      setIsContentLoading(true);
      await http.put(`/api/orders/${order.id}`, {
        status_id: Number(newStatusId),
      });
      await getOrders();
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const tableColumns = [
    {
      title: "Order No.",
      dataIndex: "order_number",
      ...getColumnSearchProps("order_number"),
      render: (_, record) => {
        return <div>{record.order_number}</div>;
      },
    },
    {
      title: "Total Items",
      dataIndex: "total_items",
      width: 150,
      render: (text) => formatWithComma(text),
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      width: 150,
      render: (text) => formatWithComma(text),
    },
    {
      title: "Status",
      dataIndex: "status_id",
      width: 100,
      render: (_, record) => {
        const status_id = record.latest_status.status.id;

        let color = "orange";
        if (status_id === 5) {
          color = "green";
        } else if (status_id === 6) {
          color = "blue";
        } else if (status_id === 7) {
          color = "purple";
        } else if (status_id === 8) {
          color = "red";
        }
        return <Tag color={color}>{statuses[status_id]}</Tag>;
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
          { key: 8, label: statuses[8], danger: true },
        ];

        // if (record.status_id === 4) {
        //   menuItems.unshift({ key: 5, label: statuses[5] });
        // }

        // if (record.status_id === 5) {
        //   menuItems.unshift({ key: 6, label: statuses[6] });
        // }

        // if (record.status_id === 6) {
        //   menuItems.unshift({ key: 7, label: statuses[7] });
        //   menuItems.unshift({ key: 5, label: statuses[5] });
        //   menuItems.pop();
        //   menuItems.pop();
        // }

        // if (record.status_id === 7 || record.status_id === 8) {
        //   menuItems.pop();
        //   menuItems.pop();
        // }

        const handleMenuClick = ({ key }) => {
          if (key === "View") {
            navigate(`/orders/${record.id}`);
          } else {
            modal.confirm({
              title: `${statuses[key]} Purchase Order`,
              content: `Are you sure you want to ${statuses[
                key
              ].toLowerCase()} this purchase order?`,
              onOk: async () => {
                handleUpdateOrder(record, key);
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

  const onHoldOs = orders.filter((o) => o.latest_status.status.id === 9);
  const approvedOs = orders.filter((o) => o.latest_status.status.id === 10);
  const inTransitOs = orders.filter((o) => o.latest_status.status.id === 11);
  const deliveredOs = orders.filter((o) => o.latest_status.status.id === 12);
  const cancelledOs = orders.filter((o) => o.latest_status.status.id === 8);

  const tabItems = [
    {
      key: "1",
      label: (
        <>
          On Hold{" "}
          {onHoldOs.length > 0 && (
            <Badge count={onHoldOs.length} color="gold" />
          )}
        </>
      ),
      children: (
        <Table columns={tableColumns} dataSource={onHoldOs} rowKey="id" />
      ),
    },
    {
      key: "2",
      label: (
        <>
          Processing{" "}
          {approvedOs.length > 0 && (
            <Badge count={approvedOs.length} color="green" />
          )}
        </>
      ),
      children: (
        <Table columns={tableColumns} dataSource={approvedOs} rowKey="id" />
      ),
    },
    {
      key: "3",
      label: (
        <>
          In Transit{" "}
          {inTransitOs.length > 0 && (
            <Badge count={inTransitOs.length} color="blue" />
          )}
        </>
      ),
      children: (
        <Table columns={tableColumns} dataSource={inTransitOs} rowKey="id" />
      ),
    },
    {
      key: "4",
      label: "Delivered",
      children: (
        <Table columns={tableColumns} dataSource={deliveredOs} rowKey="id" />
      ),
    },
    {
      key: "5",
      label: "Cancelled",
      children: (
        <Table columns={tableColumns} dataSource={cancelledOs} rowKey="id" />
      ),
    },
    {
      key: "6",
      label: "All Orders",
      children: (
        <Table columns={tableColumns} dataSource={orders} rowKey="id" />
      ),
    },
  ];

  return (
    <>
      <Spin spinning={isContentLoading} tip="loading ...">
        {/* <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
          <Col></Col>
          <Col>
            <Link to="/orders/create">
              <Button type="primary">Create Purchase Order</Button>
            </Link>
          </Col>
        </Row> */}
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Spin>
    </>
  );
}

export default Orders;
