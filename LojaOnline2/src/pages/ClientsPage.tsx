// src/pages/ClientsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  Typography,
  notification,
  Tag,
  Tooltip,
  Space,
  Grid,
  Modal,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import type { TableProps, ColumnsType } from "antd/lib/table";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { getClients } from "../services/clients";
import type { Client } from "../types";
import { setClients, deleteClient } from "../store/clientSlice";
import { ClientNewModal } from "../components/ClientNewModal";
import { ClientEditDrawer } from "../components/ClientEditDrawer";
import { formatDate } from "../utils/formatters";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export const ClientsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useSelector((s: RootState) => s.clients);

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // NOVO: estado do modal de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const screens = useBreakpoint();

  // Carregar clientes da API
  useEffect(() => {
    setLoading(true);
    getClients()
      .then((data) => dispatch(setClients(data)))
      .catch(() =>
        notification.error({
          title: "Erro na API",
          description: "Não foi possível carregar os clientes.",
        })
      )
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Handlers
  const handleEdit = (client: Client) => {
    setClientToEdit(client);
    setDrawerOpen(true);
  };

  // NOVO: abre o modal de confirmação ao clicar em excluir
  const openDeleteModal = (client: Client) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  // NOVO: confirma exclusão
  const confirmDelete = () => {
    if (!clientToDelete) return;

    dispatch(deleteClient(clientToDelete.id));
    notification.success({
      title: "Deleted",
      description: `Cliente ${clientToDelete.name.firstname} removido com sucesso.`,
    });

    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  // Colunas da tabela (sem useMemo)
  const columns: ColumnsType<Client> = [
    {
      title: "Name",
      dataIndex: ["name", "firstname"],
      key: "name",
      width: screens.xs ? 150 : 200,
      sorter: (a, b) => a.name.firstname.localeCompare(b.name.firstname),
      render: (_, r) => `${r.name.firstname} ${r.name.lastname}`,
      fixed: screens.xs ? "left" : undefined,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      responsive: ["md"],
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => formatDate(date),
      responsive: ["lg"],
    },
    {
      title: "Address",
      key: "address",
      width: 250,
      render: (_, r) =>
        `${r.address.street}, ${r.address.number}, ${r.address.city}, ${r.address.zipcode}`,
      responsive: ["xl"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      responsive: ["lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
        <Tag
          icon={
            status === "activated" ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
          color={status === "activated" ? "success" : "error"}
          style={{ textTransform: "uppercase" }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      fixed: screens.xs ? "right" : undefined,
      render: (_, r) => (
        <Space size="middle">
          <Tooltip title="Edit Client">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(r)}
              type="text"
            />
          </Tooltip>

          <Tooltip title="Delet Client">
            <Button
              icon={<DeleteOutlined />}
              danger
              type="text"
              onClick={() => openDeleteModal(r)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tableProps: TableProps<Client> = {
    dataSource: clients,
    columns,
    rowKey: "id",
    loading,
    scroll: { x: screens.xs ? 800 : "max-content" },
    pagination: { pageSize: 10, showSizeChanger: true },
    size: screens.xs ? "small" : "middle",
  };

  return (
    <div style={{ padding: screens.xs ? 16 : 24 }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 24 }}
        gutter={[16, 16]}
      >
        <Col xs={24} sm={16}>
          <Title level={3} style={{ margin: 0 }}>
            Lista de Clientes
          </Title>
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: screens.xs ? "left" : "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            block={screens.xs}
          >
            Novo Cliente
          </Button>
        </Col>
      </Row>

      <Table {...tableProps} />

      <ClientNewModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ClientEditDrawer
        open={drawerOpen}
        client={clientToEdit}
        onClose={() => {
          setDrawerOpen(false);
          setClientToEdit(null);
        }}
      />

      {/* NOVO: Modal de confirmação */}
      <Modal
        title="Confirmar Exclusão"
        open={deleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Excluir"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
      >
        <p>
          Tem certeza que deseja excluir{" "}
          <strong>
            {clientToDelete?.name.firstname} {clientToDelete?.name.lastname}
          </strong>
          ?
        </p>
      </Modal>
    </div>
  );
};

export default ClientsPage;
