import { useEffect, useState } from "react";
import {
  Spin,
  Row,
  Col,
  Button,
  Drawer,
  Table,
  Space,
  Tooltip,
  Modal,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import ErrorContent from "../../../components/common/ErrorContent";
import FormSupplier from "./components/FormSupplier";

import http from "../../../services/httpService";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [isFormCreateSupplierOpen, setIsFormCreateSupplierOpen] =
    useState(false);
  const [isFormUpdateSupplierOpen, setIsFormUpdateSupplierOpen] =
    useState(false);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSuppliers = async () => {
    const { data } = await http.get("/api/suppliers");
    setSuppliers(data);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsContentLoading(true);
        await getSuppliers();
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  const toggleFormCreateSupplierOpen = () => {
    setIsFormCreateSupplierOpen(!isFormCreateSupplierOpen);
  };

  const toggleFormUpdateSupplierOpen = () => {
    setIsFormUpdateSupplierOpen(!isFormUpdateSupplierOpen);
  };

  const handleFormCreateSupplierSubmit = async (formData) => {
    try {
      toggleFormCreateSupplierOpen();
      setIsContentLoading(true);
      await http.post("/api/suppliers", formData);
      await getSuppliers();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleFormUpdateSupplierSubmit = async (formData) => {
    try {
      toggleFormUpdateSupplierOpen();
      setIsContentLoading(true);
      await http.put(`/api/suppliers/${selectedSupplier.id}`, formData);
      await getSuppliers();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleDeleteSupplier = async (supplier) => {
    try {
      setIsContentLoading(true);
      await http.delete(`/api/suppliers/${supplier.id}`);
      await getSuppliers();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Action",
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedSupplier(record);
                toggleFormUpdateSupplierOpen();
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                Modal.confirm({
                  title: "Delete Supplier",
                  content: "Are you sure you want to delete this supplier?",
                  onOk: async () => {
                    handleDeleteSupplier(record);
                  },
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Spin spinning={isContentLoading} tip="loading ...">
        <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
          <Col></Col>
          <Col>
            <Button type="primary" onClick={toggleFormCreateSupplierOpen}>
              Create Supplier
            </Button>
          </Col>
        </Row>
        <Table columns={tableColumns} dataSource={suppliers} rowKey="id" />
      </Spin>

      <Drawer
        title="Create Supplier"
        open={isFormCreateSupplierOpen}
        destroyOnClose
        width={500}
        onClose={toggleFormCreateSupplierOpen}
      >
        <FormSupplier onSubmit={handleFormCreateSupplierSubmit} />
      </Drawer>

      <Drawer
        title="Update Supplier"
        open={isFormUpdateSupplierOpen}
        destroyOnClose
        width={500}
        onClose={toggleFormUpdateSupplierOpen}
      >
        <FormSupplier
          formData={selectedSupplier}
          onSubmit={handleFormUpdateSupplierSubmit}
        />
      </Drawer>
    </>
  );
}

export default Suppliers;
