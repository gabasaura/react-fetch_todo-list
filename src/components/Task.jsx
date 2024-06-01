import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus } from "react-icons/fa";
import Tarea from './tarea';

function Task() {

    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const username = 'gaba';

    useEffect(() => {
        fetch(`https://playground.4geeks.com/todo/users/gaba`)
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

    //POST - NEW TASK

    const addTask = (task) => {
        const url = 'https://playground.4geeks.com/todo/todos/gaba';
        const options = {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                label: task.text,
                is_done: false
            })
        };
        fetch(url, options)
            .then(response => response.json())
            .then(datos => {
                console.log('tarea agregada', datos)
                setTasks([...tasks, datos])
            })
            .catch(error => console.error('error al agregar tareas:', error))
    };


    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const newTask = e.target.value
            setInputValue(newTask)
        }
    };

    const clearForm = () => {
        setInputValue('')
    }

    const sendTask = (e) => {
        e.preventDefault()
        const task = { text: inputValue }
        addTask(task)
        setInputValue('')
        clearForm()

    }

    const handleDeleteTask = (id) => {
        const url = `https://playground.4geeks.com/todo/todos/${id}`;
        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(url, options)
            .then(response => {
                if (response.status === 204) {
                    console.log('tarea eliminada:', id)
                    const tareasActualizadas = tasks.filter(task => task.id !== id)
                    setTasks(tareasActualizadas)
                }
            })
            .catch(error => console.error('error al eliminar tarea:', error))

    };

    const handleAddTask = () => {
        if (inputValue.trim() !== '') {
            const newTask = { label: inputValue, is_done: false };
            //const updatedTasks = [...tasks, newTask];
            //setTasks(updatedTasks);
            setInputValue('');
            //updateTasks(updatedTasks);
        }
    };

    //DELETE REMOVE USER

    const handleCleanAllTasks = () => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`, {
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
            {tasks.length === 0 ? (
                <h6 className="text-primary mx-3 mt-5 text-center">NO HAY TAREAS PENDIENTES</h6>
            ) : (
                <h6 className="text-primary mx-3 mt-5 text-center">WEEEE~ ÁNIMO FALTA POQUITO</h6>
            )}
            <li className="list-group-item border border-0 mt-3">
                <form onSubmit={sendTask}>
                    <input
                        className="form-control shadow-none"
                        type="text"
                        onKeyDown={handleKeyDown}
                        placeholder="¿Que tienes que hacer?"
                        name="text"
                        onChange={handleInputChange}
                    />
                </form>
            </li>

            <ul className="list-group list-group-flush rounded-0">
                {tasks.map((task) => (
                    <li key={task.id} className="list-group-item border border-0">
                        <div className="input-group">
                            <input
                                className="form-control shadow-none"
                                type="text"
                                value={task.label || ''}
                                readOnly

                            />
                            <button
                                className="btn btn-outline-success"
                                onClick={() => handleDeleteTask(task.id)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <p className='border border-primary p-1 m-3 rounded-2 text-center'>
                <small>Total tareas pendientes: <strong>{tasks.filter(task => !task.is_done).length}</strong></small>
            </p>

            <button
                className="btn btn-outline-danger m-3"
                type="button"
                onClick={handleCleanAllTasks}
            >
                <FaTrash className='mb-1' /> BORRAME
            </button>
        </>
    );
}

export default Task;
