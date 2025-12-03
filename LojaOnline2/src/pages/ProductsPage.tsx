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
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { getProducts } from "../services/products";
import type { Product } from "../types/index";
import { ProductEditDrawer } from "../components/ProductEditDrawer";
import { NewProductModal } from "../components/NewProductModal";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../store/productSlice";

import { EyeFilled } from "@ant-design/icons";
import defaultProductImg from "../assets/default-product.png";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;
const { Search } = Input;

export const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reduxProducts = useSelector((s: RootState) => s.products); // Seus produtos locais
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados dos Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hook para detectar tamanho da tela (para ajustes finos se precisar)
  const screens = useBreakpoint();

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

  // Mescla produtos locais (Redux) com API
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

  const handleBuy = (p: Product) => {
    notification.success({
      title: "Produto adicionado ao carrinho!",
      description: `${p.title} foi incluído com sucesso.`,
    });
  };

  const openEdit = (p: Product) => {
    setProductToEdit(p);
    setEditOpen(true);
  };

  const handleSaveEdit = (p: Product) => {
    dispatch(updateProduct(p));
    notification.success({ title: "Produto atualizado com sucesso!" });
  };

  const handleDelete = (id: number | string) => {
    dispatch(deleteProduct(id));
    notification.success({ title: "Produto excluído com sucesso!" });
  };

  return (
    <div style={{ padding: screens.xs ? 16 : 24 }}> 
        
        {/* CABEÇALHO REORGANIZADO: Título, Busca e Botão na mesma linha (desktop) */}
        <Row 
            justify="space-between" 
            align="middle" 
            style={{ marginBottom: 32 }} /* Aumentei a margem inferior */
            gutter={[16, 16]} // Espaçamento entre colunas
        >
            {/* COLUNA 1: Título "List of Products" (Ocupa 24 no mobile, 8 no desktop) */}
            <Col xs={24} sm={8} md={6}>
                <Title level={3} style={{ margin: 0 }}>
                    List of Products
                </Title>
            </Col>

            {/* COLUNA 2: BARRA DE BUSCA (Ocupa 24 no mobile, 10 no desktop) */}
            <Col xs={24} sm={8} md={10} style={{ 
                textAlign: 'center', 
                order: screens.xs ? 3 : 0
            }}>
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
            
            {/* COLUNA 3: Botão "New Product" (Ocupa 24 no mobile, 6 no desktop) */}
            <Col xs={24} sm={8} md={8} style={{ 
                textAlign: screens.sm ? 'right' : 'left',
                order: screens.xs ? 2 : 0 
            }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalOpen(true)}
                    block={screens.xs} // Botão ocupa largura total no mobile
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
            xxl: 5   
          }}
          dataSource={filteredProducts}
          locale={{ emptyText: "Nenhum produto encontrado" }}
          renderItem={(item) => (
            <List.Item>
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  padding: 16,
                  height: "100%",
                  minHeight: 450, // Altura mínima para alinhar os cards
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >
                {/* Imagem + Infos Principais */}
                <div>
                    <div style={{ textAlign: 'center' }}>
                        <Image
                        src={item.image}
                        alt={item.title}
                        fallback={defaultProductImg} // Usa a imagem importada
                        style={{
                            objectFit: "contain",
                            height: 160,
                            marginBottom: 12,
                            borderRadius: 8,
                        }}
                        preview={{ mask: <EyeFilled style={{ fontSize: 20 }} /> }}
                        />
                    </div>
                    
                    <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 8, minHeight: 45 }}>
                    {item.title}
                    </Title>
                    
                    <Paragraph ellipsis={{ rows: 3 }} style={{ color: '#666', fontSize: '14px', minHeight: 65 }}>
                    {item.description}
                    </Paragraph>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Rate disabled allowHalf value={item.rating?.rate ?? 0} style={{ fontSize: 14 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>({item.rating?.count ?? 0})</Text>
                    </div>
                </div>

                {/* Preço e Botões (Fixo no fundo do card) */}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <Text strong style={{ fontSize: 18, color: '#040404ff' }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price)}
                  </Text>
                  
                  <Button
                    type="primary"
                    block
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleBuy(item)}
                    style={{ fontWeight: 600 }}
                  >
                    BUY
                  </Button>
                  
                  {/* Botões de Ação (Só aparecem se o produto tiver ID não numérico, ou seja, local) 
                      Ou remova a verificação se quiser editar todos */}
                  <Space style={{ justifyContent: "center", width: '100%' }}>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Tem certeza que deseja excluir?"
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

      {/* Drawers e Modals */}
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