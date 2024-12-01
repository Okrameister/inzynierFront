// TaskComponent.jsx
import React, { useState } from 'react';
import TaskList from './TaskList';
import CreateTaskForm from './CreateTaskForm';
import TaskDetails from './TaskDetails';
import '../styles/Task.css'; // Importowanie stylów CSS

const Task = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const token = localStorage.getItem('token'); // Pobieramy token z localStorage

    const handleTaskCreated = (task) => {
        setSelectedTask(task);
    };

    return (
        <div className="task-container">
            <TaskList onSelectTask={setSelectedTask} token={token} />
            <div className="task-content">
                {selectedTask ? (
                    <TaskDetails task={selectedTask} token={token} />
                ) : (
                    <CreateTaskForm token={token} onTaskCreated={handleTaskCreated} />
                )}
            </div>
        </div>
    );
};

export default Task;
