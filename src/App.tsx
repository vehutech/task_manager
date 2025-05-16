import { FaClipboard, FaPen } from "react-icons/fa";
import TodoList from "./components/TodoList";
import Notifications from "./components/Notifications";

const App = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="flex items-center gap-2 p-4 bg-blue-600 text-white zilla-slab-semibold">
                <FaPen />
                <h1>Task Manager</h1>
                <FaClipboard />
            </nav>
            <Notifications />
            <TodoList />
        </div>
    );
};

export default App;