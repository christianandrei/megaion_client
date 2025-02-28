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

function NewProductItems() {
  const [newProductItemConsumables, setNewProductItemConsumables] = useState(
    []
  );
  const [newProductItemEquipments, setNewProductItemEquipment] = useState([]);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewProductItems = async () => {
      try {
        setIsContentLoading(true);
        const { data } = await http.get("/api/productItems/new");
        const newProductItemConsumables = data.filter(
          (item) => item.product.product_category_id === 1
        );
        const newProductItemEquipments = data.filter(
          (item) => item.product.product_category_id === 2
        );
        setNewProductItemConsumables(newProductItemConsumables);
        setNewProductItemEquipment(newProductItemEquipments);
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchNewProductItems();
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
      <Spin spinning={isContentLoading} tip="loading ...">
        {newProductItemConsumables.length === 0 &&
        newProductItemEquipments.length === 0 ? (
          <Empty />
        ) : (
          <Alert
            message={`Update New Product Items`}
            description="Update new product items so that the unavailable quantity of the following products is restored."
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        {newProductItemConsumables.length !== 0 && (
          <>
            <Title level={4}>Consumables</Title>
            <Table
              columns={tableColumns}
              dataSource={newProductItemConsumables}
              rowKey="id"
              pagination={false}
            />
          </>
        )}
        {newProductItemEquipments.length !== 0 && (
          <>
            <Title level={4}>Equipments</Title>
            <Table
              columns={tableColumns}
              dataSource={newProductItemEquipments}
              rowKey="id"
              pagination={false}
            />
          </>
        )}
      </Spin>
    </>
  );
}

export default NewProductItems;
