import { useEffect, useState } from 'react';
import TodoService from '../TodoService';
// import type { TodoTypes } from '../todo';

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        const checkDueDates = () => {
            const todos = TodoService.getTodos();
            const now = new Date();
            const alerts: string[] = [];

            todos.forEach((todo) => {
                if (todo.dueDate) {
                    const due = new Date(todo.dueDate);
                    const timeDiff = due.getTime() - now.getTime();
                    const hoursDiff = timeDiff / (1000 * 60 * 60);
                    if (hoursDiff <= 24 && hoursDiff > 0 && !todo.completed) {
                        alerts.push(`Task "${todo.text}" is due on ${due.toLocaleDateString()}!`);
                    }
                }
            });

            setNotifications(alerts);
        };

        checkDueDates();
        const interval = setInterval(checkDueDates, 60 * 60 * 1000); // Check every hour
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4">
            {notifications.length > 0 && (
                <div className="bg-yellow-100 border border-yellow-400 p-4 rounded zilla-slab-regular">
                    <h3 className="font-bold">Upcoming Due Dates</h3>
                    <ul>
                        {notifications.map((notification, index) => (
                            <li key={index} className="text-yellow-700">{notification}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notifications;