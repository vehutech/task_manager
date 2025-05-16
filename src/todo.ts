export interface TodoTypes {
    id: number;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string; // ISO string for due date (e.g., "2025-05-20")
    starred: boolean;
}