import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus } from "react-icons/fa";

function Task() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Fetch tasks from the server when the component mounts
    useEffect(() => {
        fetch('https://playground.4geeks.com/todo/users/gaba')
            .then(resp => resp.json())
            .then(data => {
                if (data && Array.isArray(data.todos)) {
                    setTasks(data.todos);
                } else {
                    console.error('Unexpected data format:', data);
                    setTasks([]);
                }
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                setTasks([]); // Set to empty array on error
            });
    }, []);

    // Update tasks on the server
    const updateTasks = (todos) => {
        fetch('https://playground.4geeks.com/todo/todos/gaba', {
            method: "PUT",
            body: JSON.stringify(todos),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                console.log(resp.ok); // true if the response is successful
                console.log(resp.status); // status code 200, 400, etc.
                return resp.json(); // parse the result as JSON
            })
            .then(data => {
                if (data && Array.isArray(data.todos)) {
                    setTasks(data.todos); // update the tasks state with the latest data from the server
                } else {
                    console.error('Unexpected data format after update:', data);
                }
            })
            .catch(error => {
                console.error('Error updating tasks:', error);
            });
    };

    // Handle input change for the new task input field
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Handle Enter key press to add a new task
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    // Handle delete task
    const handleDeleteTask = (index) => {
        const updatedTasks = tasks.filter((task, i) => i !== index);
        setTasks(updatedTasks);
        updateTasks(updatedTasks);
    };

    // Handle add task
    const handleAddTask = () => {
        if (inputValue.trim() !== '') {
            const newTask = { label: inputValue, is_done: false };
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            setInputValue('');
            updateTasks(updatedTasks);
        }
    };

    // Handle clean all tasks
    const handleCleanAllTasks = () => {
        fetch('https://playground.4geeks.com/todo/users/gaba', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                if (resp.ok) {
                    setTasks([]);
                } else {
                    console.error('Error cleaning tasks:', resp.status);
                }
            })
            .catch(error => {
                console.error('Error cleaning tasks:', error);
            });
    };

    return (
        <>
            {Array.isArray(tasks) && tasks.length === 0 ? (
                <h6 className="text-primary mx-3 mt-5 text-center">NO HAY TAREAS PENDIENTES</h6>
            ) : (
                <h6 className="text-primary mx-3 mt-5 text-center">WEEEE~ ÁNIMO FALTA POQUITO</h6>
            )}
            <li className="list-group-item border border-0 mt-3">
                <div className="input-group">
                    <input
                        className="form-control shadow-none"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="¿Que tienes que hacer?"
                    />
                    <button
                        className="btn btn-outline-primary pt-1"
                        type="button"
                        id="button-addon1"
                        onClick={handleAddTask}
                    >
                        <FaPlus />
                    </button>
                </div>
            </li>

            <ul className="list-group list-group-flush rounded-0">
                {Array.isArray(tasks) && tasks.map((task, index) => (
                    <li key={index} className="list-group-item border border-0">
                        <div className="input-group">
                            <input
                                className="form-control shadow-none"
                                type="text"
                                value={task.label || inputValue}
                            />
                            <button
                                className="btn btn-outline-success"
                                onClick={() => handleDeleteTask(index)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <p className='border border-primary p-1 m-3 rounded-2 text-center'>
                <small>Total tareas pendientes: <strong>{Array.isArray(tasks) ? tasks.filter(task => !task.is_done).length : 0}</strong></small>
            </p>

            <button
                className="btn btn-outline-danger m-3"
                type="button"
                onClick={handleCleanAllTasks}
            >
                <FaTrash className='mb-1' /> FATAL RED BTN
            </button>
        </>
    );
}

export default Task;
