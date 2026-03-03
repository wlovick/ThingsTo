import { useState, useRef, useEffect } from 'react';
import supabase from '../helper/supabaseClient';
import './TodosBase.css';

// Helper to get current user
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default function TodosBase() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const [user, setUser] = useState(null);

    // Fetch user and todos, and subscribe to realtime updates
    useEffect(() => {
        let todosSubscription = null;
        async function fetchUserAndTodos() {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            if (currentUser) {
                const { data, error } = await supabase
                    .from('todos')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .eq('deleted', false)
                    .order('id', { ascending: true });

                if (!error) setTodos(data || []);

            // Subscribe to realtime changes for this user's todos
            todosSubscription = supabase.channel('todos-realtime')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'todos',
                        filter: `user_id=eq.${currentUser.id}`
                    },
                    (payload) => {
                        if (payload.eventType === 'INSERT') {
                            setTodos((prev) => [...prev, payload.new]);
                        } else if (payload.eventType === 'UPDATE') {
                            setTodos((prev) => prev.map((t) => t.id === payload.new.id ? { ...t, ...payload.new } : t));
                        } else if (payload.eventType === 'DELETE') {
                            setTodos((prev) => prev.filter((t) => t.id !== payload.old.id));
                        }
                    }
                )
                .subscribe();
                }
            }
            fetchUserAndTodos();
            return () => {
                if (todosSubscription) {
                    supabase.removeChannel(todosSubscription);
                }
            };
        }, []);

    // Add todo
    async function handleAddTodo(e) {
        e.preventDefault();
        if (!user) return;
        const todoText = input.trim();
        if (todoText.length > 0) {
            const { data, error } = await supabase
                .from('todos')
                .insert([{ text: todoText, completed: false, user_id: user.id }])
                .select();
            if (!error && data) {
                setTodos([...todos, ...data]);
                setInput("");
                inputRef.current?.focus();
            }
        }
    }

    // Edit todo
    async function handleEditTodo(idx) {
        const todo = todos[idx];
        const newTodoText = window.prompt("Edit your thing todo:", todo.text);
        if (newTodoText !== null && user) {
            const { data, error } = await supabase
                .from('todos')
                .update({ text: newTodoText.trim() })
                .eq('id', todo.id)
                .eq('user_id', user.id)
                .select();
            if (!error && data) {
                const nextTodos = todos.map((t, i) =>
                    i === idx ? { ...t, text: newTodoText.trim() } : t
                );
                setTodos(nextTodos);
            }
        }
    }

    // Delete todo (soft delete)
    async function handleDeleteTodo(idx) {
        const todo = todos[idx];
        if (!user) return;
        const { error } = await supabase
            .from('todos')
            .update({ deleted: true })
            .eq('id', todo.id)
            .eq('user_id', user.id)
            .select();
        if (!error) {
            const nextTodos = todos.filter((_, i) => i !== idx);
            setTodos(nextTodos);
        }
    }

    // Toggle complete
    async function handleToggleComplete(idx) {
        const todo = todos[idx];
        if (!user) return;
        const { data, error } = await supabase
            .from('todos')
            .update({ completed: !todo.completed })
            .eq('id', todo.id)
            .eq('user_id', user.id)
            .select();
        if (!error && data) {
            const nextTodos = todos.map((t, i) =>
                i === idx ? { ...t, completed: !t.completed } : t
            );
            setTodos(nextTodos);
        }
    }

    return (
        <div className="wrapper">
            <form id="todo-form" onSubmit={handleAddTodo}>
                <input
                    id="todo-input"
                    type="text"
                    placeholder="What do you need to do?"
                    autoComplete="off"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    ref={inputRef}
                />
                <button id="add-button" type="submit">Add</button>
            </form>
            <ul id="todo-list">
                {todos.map((todo, idx) => {
                    const todoId = `todo-${todo.id || idx}`;
                    return (
                        <li className="todo" key={todoId}>
                            <input
                                type="checkbox"
                                id={todoId}
                                checked={todo.completed}
                                onChange={() => handleToggleComplete(idx)}
                            />
                            <label className="custom-checkbox" htmlFor={todoId}>
                                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                            </label>
                            <label htmlFor={todoId} className="todo-text">{todo.text}</label>
                            <button className="edit-button" type="button" onClick={() => handleEditTodo(idx)}>
                                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/></svg>
                            </button>
                            <button className="delete-button" type="button" onClick={() => handleDeleteTodo(idx)}>
                                <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}











