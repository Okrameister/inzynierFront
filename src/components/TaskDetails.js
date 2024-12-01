// TaskDetails.jsx
import React, { useEffect, useState } from 'react';
import '../styles/TaskDetails.css'; // Importowanie stylów CSS

const TaskDetails = ({ task, token }) => {
    const [solutions, setSolutions] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetch(`/api/tasks/${task.id}/solutions`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.json())
            .then(data => setSolutions(data))
            .catch(error => console.error('Błąd podczas pobierania rozwiązań:', error));
    }, [task.id, token]);

    const uploadSolution = () => {
        if (!selectedFile) {
            alert('Proszę wybrać plik do przesłania.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch(`/api/tasks/${task.id}/solutions`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(response => response.json())
            .then(solution => {
                setSolutions([...solutions, solution]);
                setSelectedFile(null);
                alert('Rozwiązanie zostało przesłane.');
            })
            .catch(error => console.error('Błąd podczas przesyłania rozwiązania:', error));
    };

    const downloadSolution = (solutionId, fileName) => {
        fetch(`/api/tasks/${task.id}/solutions/${solutionId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd podczas pobierania pliku');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(error => console.error('Błąd podczas pobierania rozwiązania:', error));
    };

    return (
        <div className="task-details">
            <h2>{task.title}</h2>
            <p>{task.description}</p>

            <h3>Przesłane rozwiązania</h3>
            <ul>
                {solutions.map(solution => (
                    <li key={solution.id}>
                        {solution.uploader.firstName} {solution.uploader.lastName} - {solution.fileName}
                        <button onClick={() => downloadSolution(solution.id, solution.fileName)}>Pobierz</button>
                    </li>
                ))}
            </ul>

            <h3>Dodaj swoje rozwiązanie</h3>
            <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button onClick={uploadSolution}>Prześlij rozwiązanie</button>
        </div>
    );
};

export default TaskDetails;
