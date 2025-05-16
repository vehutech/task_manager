import { useState, type Dispatch, type SetStateAction } from "react";
import TodoService from "../TodoService";
import type { TodoTypes } from "../todo";

interface PropTypes {
    setTodos: Dispatch<SetStateAction<TodoTypes[]>>;
}

const TodoForm: React.FC<PropTypes> = ({ setTodos }) => {
    const [newTodoText, setNewTodoText] = useState<string>("");
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [dueDate, setDueDate] = useState<string>("");

    const handleAddTodo = () => {
        if (newTodoText.trim() !== "") {
            const newTodo = TodoService.addTodos(newTodoText, priority, dueDate);
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            setNewTodoText("");
            setPriority('low');
            setDueDate("");
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg">
            <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                autoFocus={true}
                placeholder="Add a Task"
                className="p-2 border rounded zilla-slab-regular"
            />
            <div className="flex gap-2">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="p-2 border rounded zilla-slab-regular"
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="p-2 border rounded zilla-slab-regular"
                />
            </div>
            <button
                onClick={handleAddTodo}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 zilla-slab-medium"
            >
                Add Todo
            </button>
        </div>
    );
};

export default TodoForm;