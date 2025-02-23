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
import FormCompany from "./components/FormCompany";

import http from "../../../services/httpService";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [isFormCreateCompanyOpen, setIsFormCreateCompanyOpen] = useState(false);
  const [isFormUpdateCompanyOpen, setIsFormUpdateCompanyOpen] = useState(false);

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCompanies = async () => {
    const { data } = await http.get("/api/companies");
    setCompanies(data);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsContentLoading(true);
        await getCompanies();
      } catch (error) {
        setError(error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (error) {
    return <ErrorContent />;
  }

  const toggleFormCreateCompanyOpen = () => {
    setIsFormCreateCompanyOpen(!isFormCreateCompanyOpen);
  };

  const toggleFormUpdateCompanyOpen = () => {
    setIsFormUpdateCompanyOpen(!isFormUpdateCompanyOpen);
  };

  const handleFormCreateCompanySubmit = async (formData) => {
    try {
      toggleFormCreateCompanyOpen();
      setIsContentLoading(true);
      await http.post("/api/companies", { ...formData, status: "Active" });
      await getCompanies();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleFormUpdateCompanySubmit = async (formData) => {
    try {
      toggleFormUpdateCompanyOpen();
      setIsContentLoading(true);
      await http.put(`/api/companies/${selectedCompany.id}`, formData);
      await getCompanies();
    } catch (error) {
      setError(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleDeleteCompany = async (company) => {
    try {
      setIsContentLoading(true);
      await http.delete(`/api/companies/${company.id}`);
      await getCompanies();
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
      render: (text, record) => <span>{record.name}</span>,
    },
    {
      title: "Shipping Address",
      dataIndex: "shipping_address",
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
                setSelectedCompany(record);
                toggleFormUpdateCompanyOpen();
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                Modal.confirm({
                  title: "Delete Company",
                  content: "Are you sure you want to delete this company?",
                  onOk: async () => {
                    handleDeleteCompany(record);
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
            <Button type="primary" onClick={toggleFormCreateCompanyOpen}>
              Create Company
            </Button>
          </Col>
        </Row>
        <Table columns={tableColumns} dataSource={companies} rowKey="id" />
      </Spin>

      <Drawer
        title="Create Company"
        open={isFormCreateCompanyOpen}
        destroyOnClose
        width={600}
        onClose={toggleFormCreateCompanyOpen}
      >
        <FormCompany onSubmit={handleFormCreateCompanySubmit} />
      </Drawer>

      <Drawer
        title="Update Company"
        open={isFormUpdateCompanyOpen}
        destroyOnClose
        width={600}
        onClose={toggleFormUpdateCompanyOpen}
      >
        <FormCompany
          formData={selectedCompany}
          onSubmit={handleFormUpdateCompanySubmit}
        />
      </Drawer>
    </>
  );
}

export default Companies;
