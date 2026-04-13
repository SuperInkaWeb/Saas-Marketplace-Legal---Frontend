import api from "@/lib/api";
import { ClientSearchResponse } from "../types";

export const clientService = {
  searchClients: async (query: string): Promise<ClientSearchResponse[]> => {
    if (!query || query.trim().length < 2) return [];
    const { data } = await api.get(`/clients/search?q=${encodeURIComponent(query)}`);
    return data;
  }
};
