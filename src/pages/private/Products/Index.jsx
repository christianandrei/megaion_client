import { useEffect, useState } from "react";
import { Spin, Tabs, Badge, Empty } from "antd";
import {
  HomeOutlined,
  LoadingOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import NewProductItems from "./components/NewProductItems/Index";
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
          New Product Items{" "}
          {isContentLoading ? (
            <SyncOutlined spin />
          ) : (
            newProductItemCount > 0 && (
              <Badge count={newProductItemCount} color="green" />
            )
          )}
        </>
      ),
      children: <NewProductItems onFetchFinish={setNewProductItemCount} />,
    },
    {
      key: "2",
      label: "Products",
      children: <ProductsListing />,
    },
    {
      key: "3",
      label: "Inventory",
      children: null,
    },
  ];

  return <Tabs defaultActiveKey="2" items={tabItems} />;
}

export default Products;
