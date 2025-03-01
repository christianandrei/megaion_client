import { useState, useEffect } from "react";
import {
  Descriptions,
  Tag,
  Typography,
  Image,
  Row,
  Col,
  Button,
  Drawer,
  Skeleton,
  Empty,
  Tabs,
  Divider,
} from "antd";
import FormConsumable from "./components/FormConsumables";

import ErrorContent from "../../../../../../../components/common/ErrorContent";

import http from "../../../../../../../services/httpService";

import useDataStore from "../../../../../../../store/DataStore";

import StockLedgers from "../StockLedger/Index";

const { Title, Text } = Typography;

function ProductItemConsumableDetails({ productId, productItemId }) {
  const [productItem, setProductItem] = useState(null);
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormUpdateConsumableOpen, setIsFormUpdateConsumableOpen] =
    useState(false);

  const { statuses } = useDataStore();

  const getProductItemConsumables = async () => {
    const { data: productItem } = await http.get(
      `/api/productItems/${productId}/${productItemId}`
    );
    const { data: locations } = await http.get(`/api/locations`);
    const { data: warehouses } = await http.get(`/api/warehouses`);

    setProductItem(productItem);
    setLocations(locations);
    setWarehouses(warehouses);
  };

  useEffect(() => {
    const fetchProductItemConsumables = async () => {
      try {
        setIsContentLoading(true);
        await getProductItemConsumables();
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchProductItemConsumables();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  if (isContentLoading) {
    return <Skeleton />;
  }

  if (!productItem) {
    return <Empty />;
  }

  const toggleFormUpdateConsumableOpen = () => {
    setIsFormUpdateConsumableOpen(!isFormUpdateConsumableOpen);
  };

  const handleFormUpdateConsumableSubmit = async (formData) => {
    try {
      toggleFormUpdateConsumableOpen();
      setIsContentLoading(true);
      await http.put(`/api/productItemConsumables/${productItem.id}`, {
        ...formData,
        status_id: 1,
      });
      await getProductItemConsumables();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const {
    product,
    status_id,
    batch_number,
    expiry_date,
    other_details,
    barcode,
    location,
    warehouse,
  } = productItem;
  const { product_group_id, product_category_id, name } = product;

  const descriptionItems = [
    {
      label: "Image",
      children: (
        <div style={{ textAlign: "" }}>
          <Image
            width={150}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </div>
      ),
    },
    {
      label: "Status:",
      children:
        status_id === 3 ? (
          <Tag color="green">{statuses[status_id]}</Tag>
        ) : (
          statuses[status_id]
        ),
    },
    {
      label: "Product Group:",
      children: `${product_group_id}`,
    },
    {
      label: "Product Category:",
      children: `${product_category_id}`,
    },
    {
      label: "Batch Number:",
      children: batch_number || <Tag color="red">N/A</Tag>,
    },
    {
      label: "Expiry Date:",
      children: expiry_date || <Tag color="red">N/A</Tag>,
    },
    {
      label: "Barcode:",
      children: barcode || <Tag color="red">N/A</Tag>,
    },
    {
      label: "Consumable:",
      children: location?.name || <Tag color="red">N/A</Tag>,
    },
    {
      label: "Warehouse:",
      children: warehouse?.name || <Tag color="red">N/A</Tag>,
    },
    {
      label: "Other Details:",
      children: other_details || "-",
    },
  ];

  const tabItems = [
    {
      key: "1",
      label: "Stock Ledger",
      children: (
        <StockLedgers productId={productId} productItemId={productItemId} />
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between">
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Product Name: {name}
          </Title>
          <Text type="secondary">Some Description Here</Text>
        </Col>
        <Col>
          <Button size="large" onClick={toggleFormUpdateConsumableOpen}>
            Update Details
          </Button>
        </Col>
      </Row>

      <Descriptions
        bordered
        column={1}
        items={descriptionItems}
        style={{ marginBottom: 16, marginTop: 16 }}
      />

      <Divider />
      <Tabs defaultActiveKey="1" items={tabItems} />

      <Drawer
        title="Update Consumable"
        open={isFormUpdateConsumableOpen}
        destroyOnClose
        width={500}
        onClose={toggleFormUpdateConsumableOpen}
      >
        <FormConsumable
          formData={productItem}
          supportingDetails={{ locations, warehouses }}
          onSubmit={handleFormUpdateConsumableSubmit}
        />
      </Drawer>
    </>
  );
}

export default ProductItemConsumableDetails;
