import { useEffect, useState } from "react";
import { Spin, Row, Col, Button, Drawer, Table, Modal, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import ErrorContent from "../../../../../../../components/common/ErrorContent";
import FormStockLedger from "./components/FormStocklLedger";

import http from "../../../../../../../services/httpService";

import { getColumnSearchProps } from "../../../../../../../helpers/TableFilterProps";

function StockLedgers({ productId, productItemId }) {
  const [stockLedgers, setStockLedgers] = useState([]);
  const [selectedStockLedger, setSelectedStockLedger] = useState(null);

  const [isFormCreateStockLedgerOpen, setIsFormCreateStockLedgerOpen] =
    useState(false);
  const [isFormUpdateStockLedgerOpen, setIsFormUpdateStockLedgerOpen] =
    useState(false);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStockLedgers = async () => {
    const { data } = await http.get(
      `/api/inventories/${productId}/${productItemId}`
    );
    setStockLedgers(data);
  };

  useEffect(() => {
    const fetchStockLedgers = async () => {
      try {
        setIsContentLoading(true);
        await getStockLedgers();
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchStockLedgers();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  const toggleFormCreateStockLedgerOpen = () => {
    setIsFormCreateStockLedgerOpen(!isFormCreateStockLedgerOpen);
  };

  const toggleFormUpdateStockLedgerOpen = () => {
    setIsFormUpdateStockLedgerOpen(!isFormUpdateStockLedgerOpen);
  };

  const handleFormCreateStockLedgerSubmit = async (formData) => {
    try {
      toggleFormCreateStockLedgerOpen();
      setIsContentLoading(true);
      await http.post("/api/inventories", {
        ...formData,
        remarks: "Manual Adjustment",
        product_id: Number(productId),
        product_item_id: Number(productItemId),
      });
      await getStockLedgers();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const tableColumns = [
    {
      title: "Movement",
      dataIndex: "movement_type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "Created by",
      render: (_, record) => 1,
    },
  ];

  return (
    <>
      <Spin spinning={isContentLoading} tip="loading ...">
        <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
          <Col></Col>
          <Col>
            <Button type="primary" onClick={toggleFormCreateStockLedgerOpen}>
              Manual Adjustment
            </Button>
          </Col>
        </Row>
        <Table columns={tableColumns} dataSource={stockLedgers} rowKey="id" />
      </Spin>

      <Drawer
        title="Manual Adjustment"
        open={isFormCreateStockLedgerOpen}
        destroyOnClose
        width={500}
        onClose={toggleFormCreateStockLedgerOpen}
      >
        <FormStockLedger onSubmit={handleFormCreateStockLedgerSubmit} />
      </Drawer>
    </>
  );
}

export default StockLedgers;
