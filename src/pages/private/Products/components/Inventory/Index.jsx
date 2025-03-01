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
  Tag,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Barcode from "react-barcode";

import ErrorContent from "../../../../../components/common/ErrorContent";

import http from "../../../../../services/httpService";

import { getColumnSearchProps } from "../../../../../helpers/TableFilterProps";
import useDataStore from "../../../../../store/DataStore";

const { Title } = Typography;

function Inventory({ newProductItemCount }) {
  const [productItems, setProductItems] = useState([]);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const { statuses } = useDataStore();

  const computeQuantitySum = (movements, movementType) => {
    return movements
      .filter((movement) => movement.movement_type === movementType)
      .reduce((sum, movement) => sum + movement.quantity, 0);
  };

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
        ].map((item) => {
          const sumOfIncrements = computeQuantitySum(
            item.inventoryMovements,
            "Increment"
          );
          const sumOfDecrements = computeQuantitySum(
            item.inventoryMovements,
            "Decrement"
          );

          return {
            newId: `${item.product_id}-${item.id}`,
            product_name: item.product.name,
            quantity: sumOfIncrements - sumOfDecrements,
            ...item,
          };
        });

        setProductItems(productItems);
      } catch (error) {
        console.log(error);
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
      render: (_, record) => {
        return <div>{record.product_name}</div>;
      },
      ...getColumnSearchProps("product_name"),
    },
    { title: "Quantity", dataIndex: "quantity", width: 100 },
    {
      title: "Barcode",
      render: (_, record) => {
        return (
          <div>
            {record.barcode ? (
              <Barcode
                value={record.barcode}
                height={20}
                displayValue={false}
              />
            ) : (
              "-"
            )}
          </div>
        );
      },
      ...getColumnSearchProps("barcode", "Search Barcode Here"),
      width: 200,
    },

    {
      title: "Status",
      width: 100,
      filters: [
        {
          text: "New",
          value: 3,
        },
        {
          text: "Active",
          value: 1,
        },
      ],
      onFilter: (value, record) => record.status_id === value,
      render: (_, { status_id }) => {
        return status_id === 3 ? (
          <Tag color="green">{statuses[status_id]}</Tag>
        ) : (
          statuses[status_id]
        );
      },
    },
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
