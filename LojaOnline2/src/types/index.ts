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
  id: number | string;
  email: string;
  username: string;
  password?: string; // Opcional, não vamos usar, mas está na API
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    geolocation: {
      lat: string;
      long: string;
    };
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
  phone: string;
  createdAt: string; // Adicionaremos esta propriedade na busca da API para ordenação
  status: "activated" | "deactivated"; // Adicionaremos esta propriedade
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