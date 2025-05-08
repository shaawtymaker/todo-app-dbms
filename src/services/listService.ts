
import { apiClient } from "./api";
import { API_ENDPOINTS } from "../config/api";
import { TodoList } from "@/contexts/TodoContext";

// Interface for list that matches our backend schema
export interface ListDTO {
  id: string;
  name: string;
  color: string;
}

// Default lists in case of API failure
const defaultLists: TodoList[] = [
  { id: 'inbox', name: 'Inbox', color: '#3b82f6' },
  { id: 'personal', name: 'Personal', color: '#8b5cf6' },
  { id: 'work', name: 'Work', color: '#10b981' }
];

export const listService = {
  // Get all lists
  async getAllLists(): Promise<TodoList[]> {
    try {
      const response = await apiClient.get<ListDTO[]>(API_ENDPOINTS.lists);
      
      // Ensure response is an array
      if (!Array.isArray(response)) {
        console.error('Invalid lists response:', response);
        return defaultLists;
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching lists:', error);
      return defaultLists;
    }
  },
  
  // Create a new list
  async createList(list: { name: string; color: string }): Promise<TodoList> {
    try {
      const response = await apiClient.post<ListDTO>(API_ENDPOINTS.lists, list);
      return response;
    } catch (error) {
      console.error('Error creating list:', error);
      // Return a temporary list with a uuid that will be replaced when sync works
      return {
        id: `temp_${Date.now()}`,
        ...list
      };
    }
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
