// src/components/ClientNewModal.tsx
import React from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  notification,
  message,
} from "antd";
import type { Client } from "../types";
import { addClient } from "../store/clientSlice";
import { useDispatch } from "react-redux";

interface ClientNewModalProps {
  open: boolean;
  onClose: () => void;
}

export const ClientNewModal: React.FC<ClientNewModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleFinish = (values: any) => {
    // Simula a criação de um novo cliente com dados padronizados
    const newClient: Client = {
      id: `local-${Date.now()}`, // ID local para o Redux
      email: values.email,
      username: values.username,
      name: {
        firstname: values.firstname,
        lastname: values.lastname,
      },
      address: {
        geolocation: { lat: "0", long: "0" },
        city: values.city,
        street: values.street,
        number: 1, // Valor padrão
        zipcode: "00000-000", // Valor padrão
      },
      phone: values.phone,
      createdAt: new Date().toISOString(), // Data de criação atual
      status: "activated", // Novo cliente é sempre ativado
    };

    dispatch(addClient(newClient));
    form.resetFields();
    notification.success({
      title: "Cliente cadastrado",
      description: `O cliente ${newClient.name.firstname} foi adicionado.`,
    });
    onClose();
  };

  return (
    <Modal
      title="Novo Cliente"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      maskClosable={false} // Não fecha ao clicar fora
      keyboard={false} // Não fecha com ESC
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="firstname"
          label="Nome"
          rules={[{ required: true, message: "Insira o nome" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Sobrenome"
          rules={[{ required: true, message: "Insira o sobrenome" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email", message: "Insira um email válido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Insira um username" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Telefone"
          rules={[{ required: true, message: "Insira o telefone" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="city" label="Cidade">
          <Input />
        </Form.Item>
        <Form.Item name="street" label="Rua">
          <Input />
        </Form.Item>

        <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
          <Button onClick={() => { form.resetFields(); onClose(); }} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};