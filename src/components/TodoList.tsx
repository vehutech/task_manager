import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { TodoTypes } from '../todo';
import TodoService from '../TodoService';
import { FaEdit, FaCheck, FaStar } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import TodoForm from './TodoForm';

interface TodoItemProps {
    todo: TodoTypes;
    index: number;
    moveTodo: (fromIndex: number, toIndex: number) => void;
    handleEditStart: (id: number, text: string) => void;
    handleEditSave: (id: number) => void;
    handleEditCancel: () => void;
    handleDeleteTodo: (id: number) => void;
    handleToggleCompleted: (id: number) => void;
    handleToggleStarred: (id: number) => void;
    editingTodoId: number | null;
    editedTodoText: string;
    setEditedTodoText: (text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
    todo,
    index,
    moveTodo,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    handleDeleteTodo,
    handleToggleCompleted,
    handleToggleStarred,
    editingTodoId,
    editedTodoText,
    setEditedTodoText,
}) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TODO',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'TODO',
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveTodo(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => drag(drop(node))}
            className={`flex items-center gap-2 p-2 mb-2 border rounded ${
                todo.completed ? 'bg-green-100' : todo.priority === 'high' ? 'bg-red-100' : 'bg-white'
            } ${isDragging ? 'opacity-50' : ''}`}
        >
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleCompleted(todo.id)}
                className="h-5 w-5"
            />
            {editingTodoId === todo.id ? (
                <div className="flex gap-2 flex-1">
                    <input
                        type="text"
                        value={editedTodoText}
                        onChange={(e) => setEditedTodoText(e.target.value)}
                        autoFocus={true}
                        className="p-2 border rounded flex-1 zilla-slab-regular"
                    />
                    <button
                        onClick={() => handleEditSave(todo.id)}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        <FaCheck />
                    </button>
                    <button
                        onClick={handleEditCancel}
                        className="p-2 bg-gray-500 text-white rounded"
                    >
                        <GiCancel />
                    </button>
                </div>
            ) : (
                <div className="flex-1">
                    <span className={`zilla-slab-regular ${todo.completed ? 'line-through' : ''}`}>
                        {todo.text}
                    </span>
                    {todo.dueDate && (
                        <span className="ml-2 text-sm text-gray-500">
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                    )}
                    <span className="ml-2 text-sm text-gray-500">({todo.priority})</span>
                </div>
            )}
            <button
                onClick={() => handleToggleStarred(todo.id)}
                className={`p-2 ${todo.starred ? 'text-yellow-500' : 'text-gray-500'}`}
            >
                <FaStar />
            </button>
            <button
                onClick={() => handleEditStart(todo.id, todo.text)}
                className="p-2 text-blue-500"
            >
                <FaEdit />
            </button>
            <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="p-2 text-red-500"
            >
                <RiDeleteBin5Fill />
            </button>
        </div>
    );
};

const TodoList = () => {
    const [todos, setTodos] = useState<TodoTypes[]>(TodoService.getTodos());
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [editedTodoText, setEditedTodoText] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [sortBy, setSortBy] = useState<'none' | 'priority' | 'dueDate'>('none');

    // Update todos when local storage changes
    useEffect(() => {
        setTodos(TodoService.getTodos());
    }, []);

    // Handle drag and drop
    const moveTodo = (fromIndex: number, toIndex: number) => {
        const updatedTodos = Array.from(todos);
        const [movedTodo] = updatedTodos.splice(fromIndex, 1);
        updatedTodos.splice(toIndex, 0, movedTodo);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
    };

    // Handle edit actions
    const handleEditStart = (id: number, text: string) => {
        setEditingTodoId(id);
        setEditedTodoText(text);
    };

    const handleEditCancel = () => {
        setEditingTodoId(null);
        setEditedTodoText("");
    };

    const handleEditSave = (id: number) => {
        if (editedTodoText.trim() !== '') {
            const updatedTodo = TodoService.updateTodo({
                ...todos.find((todo) => todo.id === id)!,
                text: editedTodoText,
            });
            setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)));
            setEditingTodoId(null);
            setEditedTodoText("");
        }
    };

    // Handle delete todo
    const handleDeleteTodo = (id: number) => {
        TodoService.deleteTodo(id);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    // Toggle completed status
    const handleToggleCompleted = (id: number) => {
        const updatedTodo = TodoService.toggleCompleted(id);
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    };

    // Toggle starred status
    const handleToggleStarred = (id: number) => {
        const updatedTodo = TodoService.toggleStarred(id);
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    };

    // Filter and sort todos
    const filteredTodos = todos
        .filter((todo) =>
            todo.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((todo) =>
            filter === 'all' ? true : filter === 'completed' ? todo.completed : !todo.completed
        )
        .sort((a, b) => {
            if (sortBy === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            if (sortBy === 'dueDate' && a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            return 0;
        });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="p-4">
                {/* Filters */}
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded zilla-slab-regular"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'incomplete')}
                        className="p-2 border rounded zilla-slab-regular"
                    >
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'none' | 'priority' | 'dueDate')}
                        className="p-2 border rounded zilla-slab-regular"
                    >
                        <option value="none">No Sort</option>
                        <option value="priority">Sort by Priority</option>
                        <option value="dueDate">Sort by Due Date</option>
                    </select>
                </div>

                <TodoForm setTodos={setTodos} />

                <div className="mt-4">
                    {filteredTodos.map((todo, index) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            index={index}
                            moveTodo={moveTodo}
                            handleEditStart={handleEditStart}
                            handleEditSave={handleEditSave}
                            handleEditCancel={handleEditCancel}
                            handleDeleteTodo={handleDeleteTodo}
                            handleToggleCompleted={handleToggleCompleted}
                            handleToggleStarred={handleToggleStarred}
                            editingTodoId={editingTodoId}
                            editedTodoText={editedTodoText}
                            setEditedTodoText={setEditedTodoText}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
};

export default TodoList;