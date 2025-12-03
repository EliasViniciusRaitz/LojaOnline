import React from "react";
import { Drawer, Button, List, Typography, Space, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../context/CartContext";

const { Text, Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<Props> = ({ open, onClose }) => {
  const { cart, removeItem, clearCart, total } = useCart();

  const handleFinish = () => {
    notification.success({
      title: "Compra Finalizada!",
      description: "Obrigado pela sua compra 😄",
    });
    clearCart();
    onClose();
  };

  return (
    <Drawer title="Carrinho de Compras" open={open} onClose={onClose} width={380}>
      <List
        dataSource={cart}
        locale={{ emptyText: "Carrinho vazio" }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                icon={<DeleteOutlined />}
                danger
                type="text"
                onClick={() => removeItem(item.id)}
              />,
            ]}
          >
            <Space direction="vertical">
              <Text strong>{item.title}</Text>
              <Text>Qtd: {item.quantity}</Text>
              <Text>Preço: R$ {(item.price * item.quantity).toFixed(2)}</Text>
            </Space>
          </List.Item>
        )}
      />

      {cart.length > 0 && (
        <>
          <Title level={4} style={{ marginTop: 20 }}>Total: R$ {total.toFixed(2)}</Title>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Button type="primary" block onClick={handleFinish}>
              Finalizar Compra
            </Button>
            <Button danger block onClick={clearCart}>
              Limpar Carrinho
            </Button>
          </Space>
        </>
      )}
    </Drawer>
  );
};
