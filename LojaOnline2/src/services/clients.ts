// src/services/clients.ts
import type { Client } from "../types";
import { capitalizeFirstLetter } from "../utils/formatters";
import { generateRandomDate } from "../utils/helpers"; // Vamos criar isso depois

const API_URL = "https://fakestoreapi.com/users";

export async function getClients(): Promise<Client[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }

  const clientsData = await response.json();

  // Mapeia e formata os dados da API
  const clients: Client[] = clientsData.map((client: any, index: number) => {
    
    // Gerar uma data de criação aleatória para fins de ordenação
    const randomDate = generateRandomDate(); // Gerar data aleatória

    return {
      id: client.id,
      email: client.email,
      username: client.username,
      name: {
        // Capitaliza a primeira letra dos nomes
        firstname: capitalizeFirstLetter(client.name.firstname),
        lastname: capitalizeFirstLetter(client.name.lastname),
      },
      address: {
        ...client.address,
        // Garante que a cidade seja capitalizada
        city: capitalizeFirstLetter(client.address.city),
      },
      phone: client.phone,
      createdAt: randomDate, // Adiciona a data aleatória
      // Adiciona o status (alternando para ter exemplos de ambos)
      status: index % 3 === 0 ? "deactivated" : "activated", 
    };
  });

  return clients;
}