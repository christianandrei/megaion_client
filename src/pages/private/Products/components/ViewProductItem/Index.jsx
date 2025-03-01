import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Skeleton } from "antd";

import ErrorContent from "../../../../../components/common/ErrorContent";
import ProductItemConsumableDetails from "./components/ProductItemConsumableDetails/Index";
import ProductItemEquipmentDetails from "./components/ProductItemEquipmentDetails/Index";

import http from "../../../../../services/httpService";

function ViewProductItem() {
  const [productItem, setProductItem] = useState(null);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const { productId, productItemId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsContentLoading(true);

        const { data: productItem } = await http.get(
          `/api/productItems/${productId}/${productItemId}`
        );

        setProductItem(productItem);
      } catch (error) {
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

  if (!productItem) {
    return (
      <Row>
        <Col span={12}>
          <Skeleton />
        </Col>
        <Col span={12}></Col>
      </Row>
    );
  }

  // const tabItems = [
  //   {
  //     key: "1",
  //     label: "Inventory Movements",
  //     children: <Empty />,
  //   },
  //   {
  //     key: "3",
  //     label: "Maintenance Records",
  //     children: <Empty />,
  //   },
  //   {
  //     key: "4",
  //     label: "Calibration Records",
  //     children: <Empty />,
  //   },
  //   {
  //     key: "2",
  //     label: "Warranty Claims",
  //     children: <Empty />,
  //   },
  // ];

  return (
    <Row>
      <Col span={12}>
        {productItem.product.product_category_id === 1 ? (
          <ProductItemConsumableDetails
            productId={productId}
            productItemId={productItemId}
          />
        ) : (
          <ProductItemEquipmentDetails
            productId={productId}
            productItemId={productItemId}
          />
        )}

        {/* <Divider />
          <Tabs defaultActiveKey="1" items={tabItems} /> */}
      </Col>
      <Col span={12}></Col>
    </Row>
  );
}

export default ViewProductItem;
