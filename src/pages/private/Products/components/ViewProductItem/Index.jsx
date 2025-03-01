import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Skeleton, Empty } from "antd";

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

  if (isContentLoading) {
    return (
      <Row>
        <Col span={12}>
          <Skeleton />
        </Col>
        <Col span={12}></Col>
      </Row>
    );
  }

  if (!productItem) {
    return <Empty />;
  }

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
      </Col>
      <Col span={12}></Col>
    </Row>
  );
}

export default ViewProductItem;
