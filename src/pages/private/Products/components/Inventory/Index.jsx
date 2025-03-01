import { useEffect, useState } from "react";
import {
  Spin,
  Row,
  Col,
  Button,
  Drawer,
  Table,
  Modal,
  Dropdown,
  Alert,
  Typography,
  Empty,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";

import ErrorContent from "../../../../../components/common/ErrorContent";

import http from "../../../../../services/httpService";

import { getColumnSearchProps } from "../../../../../helpers/TableFilterProps";

const { Title } = Typography;

function Inventory() {
  const [newProductItemConsumables, setNewProductItemConsumables] = useState(
    []
  );
  const [newProductItemEquipments, setNewProductItemEquipment] = useState([]);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsContentLoading(true);
        //const { data } = await http.get("/api/productItems/new");
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  const tableColumns = [
    {
      title: "Name",

      render: (_, record) => record.product.name,
    },
    {
      title: "Quantity",
      render: (_, record) => record.inventory.quantity,
      width: 100,
    },
    {
      title: "Action",
      width: 50,
      render: (_, record) => {
        return <Button type="primary">Update</Button>;
      },
    },
  ];

  return (
    <>
      <Spin spinning={isContentLoading} tip="loading ..."></Spin>
    </>
  );
}

export default Inventory;
