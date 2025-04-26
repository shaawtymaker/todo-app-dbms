
import { apiClient } from "./api";
import { API_ENDPOINTS } from "../config/api";
import { TodoList } from "@/contexts/TodoContext";

// Interface for list that matches our backend schema
export interface ListDTO {
  id: string;
  name: string;
  color: string;
}

export const listService = {
  // Get all lists
  async getAllLists(): Promise<TodoList[]> {
    const response = await apiClient.get<ListDTO[]>(API_ENDPOINTS.lists);
    return response;
  },
  
  // Create a new list
  async createList(list: { name: string; color: string }): Promise<TodoList> {
    const response = await apiClient.post<ListDTO>(API_ENDPOINTS.lists, list);
    return response;
  },
  
  // Update a list
  async updateList(id: string, updates: { name?: string; color?: string }): Promise<TodoList> {
    const response = await apiClient.put<ListDTO>(`${API_ENDPOINTS.lists}/${id}`, updates);
    return response;
  },
  
  // Delete a list
  async deleteList(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.lists}/${id}`);
  }
};
