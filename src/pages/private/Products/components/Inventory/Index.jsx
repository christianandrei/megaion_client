import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function Inventory({ newProductItemCount }) {
  const [productItems, setProductItems] = useState([]);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsContentLoading(true);
        const { data: productItemConsumables } = await http.get(
          "/api/productItemConsumables"
        );
        const { data: productItemEquipments } = await http.get(
          "/api/productItemEquipments"
        );
        const productItems = [
          ...productItemConsumables,
          ...productItemEquipments,
        ].map((item) => ({
          newId: `${item.product_id}-${item.id}`,
          ...item,
        }));

        setProductItems(productItems);
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
    // {
    //   title: "Quantity",
    //   render: (_, record) => record.inventory.quantity,
    //   width: 100,
    // },
    {
      title: "Action",
      width: 50,
      render: (_, record) => {
        const { product_id, id } = record;
        return (
          <Link to={`/productItems/${product_id}/${id}`}>
            <Button type="primary">Update</Button>
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <Spin spinning={isContentLoading} tip="loading ...">
        {newProductItemCount !== 0 && (
          <Alert
            message={`Update New Product Items`}
            description={`${newProductItemCount} new product items found. Update new product items so that the unavailable quantity of the following products is restored.`}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Table
          columns={tableColumns}
          dataSource={productItems}
          rowKey="newId"
          pagination={false}
        />
      </Spin>
    </>
  );
}

export default Inventory;
