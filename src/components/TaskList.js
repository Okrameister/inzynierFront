// TaskList.jsx
import React, { useEffect, useState } from 'react';
import '../styles/TaskList.css';

const groupId = localStorage.getItem("groupId");

const TaskList = ({ onSelectTask, token }) => {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        fetch('/api/tasks/group/'+groupId, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Otrzymane dane z /api/tasks:', data);
                setTasks(data);
            })
            .catch(error => console.error('Błąd podczas pobierania zadań:', error));
    }, [token]);

    return (
        <div className="task-list">
            <button className="create-task-button" onClick={() => onSelectTask(null)}>
                Utwórz nowe zadanie
            </button>
            <ul>
                {tasks?.map?.(task => (
                    <li key={task.id} onClick={() => onSelectTask(task)}>
                        {task.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
