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
import FormEquipment from "./components/FormEquipments";

import ErrorContent from "../../../../../../../components/common/ErrorContent";

import http from "../../../../../../../services/httpService";

import useDataStore from "../../../../../../../store/DataStore";

import StockLedger from "../StockLedger/Index";

const { Title, Text } = Typography;

function ProductItemEquipmentDetails({ productId, productItemId }) {
  const [productItem, setProductItem] = useState(null);
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormUpdateEquipmentOpen, setIsFormUpdateEquipmentOpen] =
    useState(false);

  const { statuses } = useDataStore();

  const getProductItemEquipments = async () => {
    const { data: productItems } = await http.get(
      `/api/productItemEquipments/${productItemId}`
    );
    const { data: locations } = await http.get(`/api/locations`);
    const { data: warehouses } = await http.get(`/api/warehouses`);

    setProductItem(productItems);
    setLocations(locations);
    setWarehouses(warehouses);
  };

  useEffect(() => {
    const fetchProductItemEquipments = async () => {
      try {
        setIsContentLoading(true);
        await getProductItemEquipments();
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchProductItemEquipments();
  }, []);

  if (error) {
    console.log(error.response);
    console.log(error.response.data);
    return <ErrorContent error={error?.response?.data?.message} />;
  }

  if (!productItem || isContentLoading) {
    return <Skeleton />;
  }

  if (!productItem) {
    return <Empty />;
  }

  const toggleFormUpdateEquipmentOpen = () => {
    setIsFormUpdateEquipmentOpen(!isFormUpdateEquipmentOpen);
  };

  const handleFormUpdateEquipmentSubmit = async (formData) => {
    try {
      toggleFormUpdateEquipmentOpen();
      setIsContentLoading(true);
      await http.put(`/api/productItemEquipments/${productItem.id}`, {
        ...formData,
        status_id: 1,
      });
      await getProductItemEquipments();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const {
    product,
    status_id,
    other_details,
    barcode,
    location,
    warehouse,
    maintenance_interval_in_month,
    model_number,
    serial_number,
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
      label: "Serial Number:",
      children: serial_number || <Tag color="red">N/A</Tag>,
    },
    {
      label: "Model Number:",
      children: model_number || <Tag color="red">N/A</Tag>,
    },

    {
      label: "Maintenance Inverval in Month:",
      children: maintenance_interval_in_month || <Tag color="red">N/A</Tag>,
    },
    {
      label: "Barcode:",
      children: barcode || <Tag color="red">N/A</Tag>,
    },
    {
      label: "Equipment:",
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
        <StockLedger productId={productId} productItemId={productItemId} />
      ),
    },
    {
      key: "3",
      label: "Maintenance Records",
      children: <Empty />,
    },
    {
      key: "4",
      label: "Calibration Records",
      children: <Empty />,
    },
    {
      key: "2",
      label: "Warranty Claims",
      children: <Empty />,
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
          <Button size="large" onClick={toggleFormUpdateEquipmentOpen}>
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
        title="Update Equipment"
        open={isFormUpdateEquipmentOpen}
        destroyOnClose
        width={500}
        onClose={toggleFormUpdateEquipmentOpen}
      >
        <FormEquipment
          formData={productItem}
          supportingDetails={{ locations, warehouses }}
          onSubmit={handleFormUpdateEquipmentSubmit}
        />
      </Drawer>
    </>
  );
}

export default ProductItemEquipmentDetails;
