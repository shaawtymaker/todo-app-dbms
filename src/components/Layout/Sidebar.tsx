
import { useTodo } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import { ListPlus, Plus, Settings, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  onNavItemClick?: () => void;
}

export function Sidebar({ onNavItemClick }: SidebarProps) {
  const { state, dispatch } = useTodo();
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState('#8b5cf6');
  const { user } = useAuth();
  const location = useLocation();
  
  const handleCreateList = () => {
    if (newListName.trim()) {
      dispatch({
        type: 'ADD_LIST',
        payload: { name: newListName.trim(), color: newListColor }
      });
      setNewListName('');
      setNewListColor('#8b5cf6');
      setIsNewListDialogOpen(false);
    }
  };
  
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#10b981', // green
    '#ef4444', // red
    '#f59e0b', // amber
    '#ec4899', // pink
  ];

  // Make sure lists is always an array
  const lists = Array.isArray(state.lists) ? state.lists : [];

  return (
    <aside className="flex flex-col h-full">
      {/* App title */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Todo App</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {/* Dashboard link */}
          <li>
            <Link 
              to="/"
              onClick={onNavItemClick}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}
              `}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          </li>

          {lists.map(list => (
            <li key={list.id}>
              <Link 
                to={`/lists/${list.id}`}
                onClick={onNavItemClick}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${location.pathname === `/lists/${list.id}` ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}
                `}
              >
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: list.color }}
                />
                <span>{list.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {Array.isArray(state.todos) ? state.todos.filter(todo => todo.listId === list.id && !todo.completed).length : 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Add list button */}
        <div className="px-4 mt-4">
          <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <ListPlus size={16} />
                <span>New List</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="list-name">Name</Label>
                  <Input 
                    id="list-name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="List name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewListColor(color)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          newListColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateList}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings" onClick={onNavItemClick}>
              <Settings size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
