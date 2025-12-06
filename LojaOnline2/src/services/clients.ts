// src/services/clients.ts
import type { Client } from "../types";
import { capitalizeFirstLetter } from "../utils/formatters";
import { generateRandomDate } from "../utils/helpers"; 

const API_URL = "https://fakestoreapi.com/users";

export async function getClients(): Promise<Client[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }

  const clientsData = await response.json();


  const clients: Client[] = clientsData.map((client: any, index: number) => {
    
    const randomDate = generateRandomDate(); 

    return {
      id: client.id,
      email: client.email,
      username: client.username,
      name: {
        firstname: capitalizeFirstLetter(client.name.firstname),
        lastname: capitalizeFirstLetter(client.name.lastname),
      },
      address: {
        ...client.address,
        city: capitalizeFirstLetter(client.address.city),
      },
      phone: client.phone,
      createdAt: randomDate, 
      status: index % 3 === 0 ? "deactivated" : "activated", 
    };
  });

  return clients;
}