
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useTodo } from "@/contexts/TodoContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useTodo();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<{ id: string, name: string, color: string } | null>(null);
  
  const handleDeleteList = (id: string) => {
    if (id !== 'inbox') {
      dispatch({ type: 'DELETE_LIST', payload: id });
    }
  };
  
  const handleEditList = () => {
    if (editingList && editingList.name.trim()) {
      dispatch({
        type: 'EDIT_LIST',
        payload: {
          id: editingList.id,
          name: editingList.name.trim(),
          color: editingList.color
        }
      });
      setIsDialogOpen(false);
      setEditingList(null);
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

  return (
    <div className="space-y-8 animate-slide-in">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-toggle" className="font-medium">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle between dark and light theme</p>
            </div>
            <Switch 
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Lists</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.lists.map(list => (
            <div key={list.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: list.color }}
                />
                <span>{list.name}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingList({ id: list.id, name: list.name, color: list.color });
                    setIsDialogOpen(true);
                  }}
                  disabled={list.id === 'inbox'}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteList(list.id)}
                  disabled={list.id === 'inbox'}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          
          {state.lists.length === 1 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The Inbox list cannot be deleted or edited.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-list-name">Name</Label>
              <Input 
                id="edit-list-name"
                value={editingList?.name || ''}
                onChange={(e) => setEditingList(prev => prev ? {...prev, name: e.target.value} : null)}
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
                    onClick={() => setEditingList(prev => prev ? {...prev, color} : null)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      editingList?.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditList}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
