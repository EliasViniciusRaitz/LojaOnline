// src/types/index.ts (Atualizado)

// Tipagem básica para Endereço, pois a API retorna um objeto complexo
export interface Address {
  city: string;
  street: string;
  number: number;
  zipcode: string;
}

// Tipagem para o Cliente (Baseado na API de Users + Requisitos do trabalho)
export interface Client {
  id: number;
  email: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
  address: Address;
  // Campos adicionais dos requisitos:
  createdAt: string; // Data formatada que vamos gerar
  status: 'activated' | 'deactivated'; // Para o componente Tag
  isLocal?: boolean; // Para identificar clientes cadastrados via Modal
}

// Reutilizamos o tipo Product da Atividade I e II
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Tipo para o estado do usuário logado (usado no App.tsx)
export interface User {
  id: number;
  email: string;
  name: {
    firstname: string;
    lastname: string;
  };
}