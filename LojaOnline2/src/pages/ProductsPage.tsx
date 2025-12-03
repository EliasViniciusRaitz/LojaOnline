import React, { useEffect, useState, useMemo } from "react";
import {
  List,
  Spin,
  Row,
  Col,
  Button,
  Typography,
  Grid,
  notification,
  Image,
  Rate,
  Input,
  Popconfirm,
  Space,
} from "antd";
import {
  PlusOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeFilled,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

import { getProducts } from "../services/products";
import { addProduct, updateProduct, deleteProduct } from "../store/productSlice";

import type { Product } from "../types/index";
import { ProductEditDrawer } from "../components/ProductEditDrawer";
import { NewProductModal } from "../components/NewProductModal";

import defaultProductImg from "../assets/default-product.png";

// IMPORTANTE: Carrinho
import { useCart } from "../context/CartContext";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;
const { Search } = Input;

export const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reduxProducts = useSelector((s: RootState) => s.products);

  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const screens = useBreakpoint();

  // ✔ Carrinho atualizado
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => setApiProducts(data))
      .catch(() => {
        notification.error({
          title: "Erro",
          description: "Não foi possível carregar os produtos da API.",
        });
        setApiProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Mescla API + produtos locais
  const mergedProducts = useMemo(
    () => [...reduxProducts, ...apiProducts],
    [reduxProducts, apiProducts]
  );

  const filteredProducts = mergedProducts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveLocalProduct = (p: Product) => {
    dispatch(addProduct(p));
  };

  // ✔ BUY → adiciona ao carrinho COM addItem
  const handleBuy = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    notification.success({
      title: "Adicionado ao carrinho!",
      description: `${product.title} foi incluído com sucesso.`,
    });
  };

  const openEdit = (p: Product) => {
    setProductToEdit(p);
    setEditOpen(true);
  };

  const handleSaveEdit = (p: Product) => {
    dispatch(updateProduct(p));
    notification.success({
      title: "Produto atualizado com sucesso!",
    });
  };

  const handleDelete = (id: number | string) => {
    dispatch(deleteProduct(id));
    notification.success({
      title: "Produto excluído com sucesso!",
    });
  };

  return (
    <div style={{ padding: screens.xs ? 16 : 24 }}>
      {/* Cabeçalho com busca e botão */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 32 }}
        gutter={[16, 16]}
      >
        <Col xs={24} sm={8} md={6}>
          <Title level={3} style={{ margin: 0 }}>
            List of Products
          </Title>
        </Col>

        <Col xs={24} sm={8} md={10} style={{ textAlign: "center" }}>
          <Search
            placeholder="Buscar produto"
            allowClear
            enterButton="Buscar"
            size="large"
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>

        <Col xs={24} sm={8} md={8} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            block={screens.xs}
          >
            New Product
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          dataSource={filteredProducts}
          renderItem={(item) => (
            <List.Item>
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  padding: 16,
                  minHeight: 450,
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                }}
              >
                {/* imagem + info */}
                <div>
                  <div style={{ textAlign: "center" }}>
                    <Image
                      src={item.image}
                      fallback={defaultProductImg}
                      alt={item.title}
                      style={{
                        objectFit: "contain",
                        height: 160,
                        marginBottom: 12,
                        borderRadius: 8,
                      }}
                      preview={{ mask: <EyeFilled style={{ fontSize: 20 }} /> }}
                    />
                  </div>

                  <Title
                    level={5}
                    ellipsis={{ rows: 2 }}
                    style={{ minHeight: 45 }}
                  >
                    {item.title}
                  </Title>

                  <Paragraph
                    ellipsis={{ rows: 3 }}
                    style={{ color: "#666", minHeight: 65 }}
                  >
                    {item.description}
                  </Paragraph>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <Rate disabled allowHalf value={item.rating?.rate ?? 0} />
                    <Text type="secondary">
                      ({item.rating?.count ?? 0})
                    </Text>
                  </div>
                </div>

                {/* rodapé */}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price)}
                  </Text>

                  {/* ✔ BUY */}
                  <Button
                    type="primary"
                    block
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleBuy(item)}
                  >
                    BUY
                  </Button>

                  <Space style={{ justifyContent: "center" }}>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </Button>

                    <Popconfirm
                      title="Deseja realmente excluir?"
                      onConfirm={() => handleDelete(item.id)}
                      okText="Sim"
                      cancelText="Não"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}

      {/* Modals */}
      <ProductEditDrawer
        open={editOpen}
        product={productToEdit}
        onClose={() => {
          setEditOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveEdit}
      />

      <NewProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(p) => {
          handleSaveLocalProduct(p);
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProductsPage;
