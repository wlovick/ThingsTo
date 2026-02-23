import { useState, useRef } from 'react';
import './TodosBase.css';

function getTodosFromStorage() {
    const todos = localStorage.getItem('todos') || '[]';
    return JSON.parse(todos);
}

export default function TodosBase() {
    const [todos, setTodos] = useState(getTodosFromStorage());
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    function saveTodos(nextTodos) {
        localStorage.setItem('todos', JSON.stringify(nextTodos));
    }

    function handleAddTodo(e) {
        e.preventDefault();
        const todoText = input.trim();
        if (todoText.length > 0) {
            const nextTodos = [...todos, { text: todoText, completed: false }];
            setTodos(nextTodos);
            saveTodos(nextTodos);
            setInput("");
            inputRef.current?.focus();
        }
    }

    function handleEditTodo(idx) {
        const newTodoText = window.prompt("Edit your thing todo:", todos[idx].text);
        if (newTodoText !== null) {
            const nextTodos = todos.map((todo, i) =>
                i === idx ? { ...todo, text: newTodoText.trim() } : todo
            );
            setTodos(nextTodos);
            saveTodos(nextTodos);
        }
    }

    function handleDeleteTodo(idx) {
        const nextTodos = todos.filter((_, i) => i !== idx);
        setTodos(nextTodos);
        saveTodos(nextTodos);
    }

    function handleToggleComplete(idx) {
        const nextTodos = todos.map((todo, i) =>
            i === idx ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(nextTodos);
        saveTodos(nextTodos);
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
                    const todoId = `todo-${idx}`;
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











