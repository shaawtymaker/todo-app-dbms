
import { apiClient } from "./api";
import { API_ENDPOINTS } from "../config/api";
import { Todo } from "@/contexts/TodoContext";

// Interface for todo that matches our backend schema
export interface TodoDTO {
  id: string;
  text: string;
  completed: boolean;
  list_id: string;
  created_at: string;
}

// Convert from backend to frontend format
const mapToTodo = (dto: TodoDTO): Todo => ({
  id: dto.id,
  text: dto.text,
  completed: dto.completed,
  listId: dto.list_id,
  createdAt: new Date(dto.created_at).getTime(),
});

// Convert from frontend to backend format
const mapToDTO = (todo: Partial<Todo>): Partial<TodoDTO> => ({
  ...(todo.id && { id: todo.id }),
  ...(todo.text && { text: todo.text }),
  ...(todo.completed !== undefined && { completed: todo.completed }),
  ...(todo.listId && { list_id: todo.listId }),
});

export const todoService = {
  // Get all todos
  async getAllTodos(): Promise<Todo[]> {
    const response = await apiClient.get<TodoDTO[]>(API_ENDPOINTS.todos);
    return response.map(mapToTodo);
  },
  
  // Get todos by list ID
  async getTodosByList(listId: string): Promise<Todo[]> {
    const response = await apiClient.get<TodoDTO[]>(`${API_ENDPOINTS.todos}?list_id=${listId}`);
    return response.map(mapToTodo);
  },
  
  // Create a new todo
  async createTodo(todo: { text: string; listId: string }): Promise<Todo> {
    const response = await apiClient.post<TodoDTO>(API_ENDPOINTS.todos, mapToDTO(todo));
    return mapToTodo(response);
  },
  
  // Update a todo
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const response = await apiClient.put<TodoDTO>(`${API_ENDPOINTS.todos}/${id}`, mapToDTO(updates));
    return mapToTodo(response);
  },
  
  // Toggle todo completion status
  async toggleTodo(id: string): Promise<Todo> {
    const response = await apiClient.put<TodoDTO>(`${API_ENDPOINTS.todos}/${id}/toggle`, {});
    return mapToTodo(response);
  },
  
  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.todos}/${id}`);
  }
};
