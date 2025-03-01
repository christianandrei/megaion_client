import { useEffect, useState } from "react";
import { Spin, Tabs, Badge, Empty } from "antd";
import {
  HomeOutlined,
  LoadingOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import Inventory from "./components/Inventory/Index";
import ProductsListing from "./components/Products/Index";

import http from "../../../services/httpService";

function Products() {
  const [newProductItemCount, setNewProductItemCount] = useState(0);

  const [isContentLoading, setIsContentLoading] = useState(false);

  useEffect(() => {
    const fetchNewProductItems = async () => {
      try {
        setIsContentLoading(true);
        const { data } = await http.get("/api/productItems/new");
        setNewProductItemCount(data.length);
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchNewProductItems();
  }, []);

  const tabItems = [
    {
      key: "1",
      label: (
        <>
          Inventory{" "}
          {isContentLoading ? (
            <SyncOutlined spin />
          ) : (
            newProductItemCount > 0 && (
              <Badge count={newProductItemCount} color="green" />
            )
          )}
        </>
      ),
      children: <Inventory newProductItemCount={newProductItemCount} />,
    },
    {
      key: "2",
      label: "Products",
      children: <ProductsListing />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={tabItems} />;
}

export default Products;
