// src/components/NewProductModal.tsx
import React from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  notification,
  theme,
} from "antd";
import type { Product } from "../types/index";

import defaultProductImg from "../assets/default-product.png"; 

const { useToken } = theme;

interface NewProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const { token } = useToken();

  const handleFinish = (values: any) => {

    const finalImage = values.image ? values.image : defaultProductImg;

    const newProduct: Product = {
      id: `local-${Date.now()}`,
      title: values.title,
      description: values.description,
      price: Number(values.price),
      image: finalImage, 
      rating: { rate: 0, count: 0 }, 
      category: values.category || "uncategorized",
    };

    onSave(newProduct);
    form.resetFields();
    notification.success({
      title: "Produto salvo",
      description: "Produto cadastrado com sucesso!",
    });
    onClose();
  };

  return (
    <Modal
      title="New Product"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      maskClosable={false}
      keyboard={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder="Ex: Fancy Jacket" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea rows={4} placeholder="Product description..." />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category">
            <Select.Option value="clothing">Clothing</Select.Option>
            <Select.Option value="jewelry">Jewelry</Select.Option>
            <Select.Option value="electronics">Electronics</Select.Option>
            <Select.Option value="uncategorized">Uncategorized</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={0.01}
            placeholder="0.00"
            prefix="R$"
          />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image URL (Optional)"
          rules={[{ type: "url", warningOnly: true }]}
        >
          <Input placeholder="Leave empty for default image" />
        </Form.Item>
        
        <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};