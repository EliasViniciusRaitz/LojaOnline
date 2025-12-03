// src/components/ClientEditDrawer.tsx
import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Select,
  notification,
} from "antd";
import type { Client } from "../types";
import { useDispatch } from "react-redux";
import { updateClient } from "../store/clientSlice";

interface ClientEditDrawerProps {
  open: boolean;
  client: Client | null;
  onClose: () => void;
}

export const ClientEditDrawer: React.FC<ClientEditDrawerProps> = ({
  open,
  client,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (client) {
      form.setFieldsValue({
        firstname: client.name.firstname,
        lastname: client.name.lastname,
        email: client.email,
        username: client.username,
        phone: client.phone,
        city: client.address.city,
        street: client.address.street,
        status: client.status,
      });
    } else {
        form.resetFields();
    }
  }, [client, form]);

  const handleFinish = (values: any) => {
    if (!client) return;

    const updatedClient: Client = {
      ...client,
      email: values.email,
      username: values.username,
      name: {
        firstname: values.firstname,
        lastname: values.lastname,
      },
      address: {
        ...client.address,
        city: values.city,
        street: values.street,
      },
      phone: values.phone,
      status: values.status,
    };

    dispatch(updateClient(updatedClient));
    notification.success({
      title: "Cliente atualizado",
      description: `O cliente ${updatedClient.name.firstname} foi atualizado com sucesso.`,
    });
    onClose();
  };

  return (
    <Drawer
      title="Editar Cliente"
      width={window.innerWidth < 768 ? '100%' : 500}
      onClose={onClose}
      open={open}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button onClick={form.submit} type="primary">
            Salvar
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="firstname"
          label="Nome"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Sobrenome"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
            name="phone"
            label="Telefone"
            rules={[{ required: true }]}
        >
            <Input />
        </Form.Item>
        <Form.Item name="city" label="Cidade">
          <Input />
        </Form.Item>
        <Form.Item name="street" label="Rua">
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Selecione o status" }]}
        >
            <Select>
                <Select.Option value="activated">Ativado</Select.Option>
                <Select.Option value="deactivated">Desativado</Select.Option>
            </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};