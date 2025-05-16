import type { TodoTypes } from "./todo";

const LOCAL_STORAGE_KEY = "todos";

const TodoService = {
    // Get Todos
    getTodos: (): TodoTypes[] => {
        const todoStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        return todoStr ? JSON.parse(todoStr) : [];
    },

    // Adding Todos
    addTodos: (text: string, priority: 'low' | 'medium' | 'high' = 'low', dueDate?: string): TodoTypes => {
        const todos = TodoService.getTodos();
        const newTodo: TodoTypes = {
            id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
            text,
            completed: false,
            priority,
            dueDate,
            starred: false,
        };

        const updatedTodos = [...todos, newTodo];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
        return newTodo;
    },

    // Updating The Todo
    updateTodo: (todo: TodoTypes): TodoTypes => {
        const todos = TodoService.getTodos();
        const updatedTodos = todos.map((t) => (t.id === todo.id ? todo : t));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
        return todo;
    },

    // Deleting the Todo
    deleteTodo: (id: number): void => {
        const todos = TodoService.getTodos();
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
    },

    // Toggle Starred Status
    toggleStarred: (id: number): TodoTypes => {
        const todos = TodoService.getTodos();
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, starred: !todo.starred } : todo
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
        return updatedTodos.find((todo) => todo.id === id)!;
    },

    // Toggle Completed Status
    toggleCompleted: (id: number): TodoTypes => {
        const todos = TodoService.getTodos();
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
        return updatedTodos.find((todo) => todo.id === id)!;
    },
};

export default TodoService;