import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ScheduleBlock from './ScheduleBlock';
import ScheduleForm from './ScheduleForm';
import '../styles/ScheduleGrid.css';

function ScheduleGrid() {
    const daysOfWeek = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
    const startTime = 8.5; // 8:30
    const blockDuration = 1.5; // 1.5h
    const blocksPerDay = 6; // np. od 8:30 do 17:00

    const [scheduleData, setScheduleData] = useState({});
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const scheduleContainerRef = useRef(null); // Referencja do całego widoku

    const normalizeTime = (timeStr) => {
        if (!timeStr) {
            return null;
        }
        const [hours, minutes] = timeStr.split(':');
        const normalizedHours = hours.length === 1 ? '0' + hours : hours;
        return `${normalizedHours}:${minutes}`;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/schedule', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const formattedData = {};
                data.forEach((item) => {
                    const day = item.dayOfWeek;
                    const time = normalizeTime(item.startTime);

                    if (!formattedData[day]) {
                        formattedData[day] = {};
                    }
                    formattedData[day][time] = item;
                });
                setScheduleData(formattedData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleBlockClick = (day, time) => {
        const blockData =
            scheduleData[day] && scheduleData[day][time]
                ? scheduleData[day][time]
                : { dayOfWeek: day, startTime: time };
        setSelectedBlock(blockData);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (formData) => {
        const method = selectedBlock.id ? 'PUT' : 'POST';
        const url = selectedBlock.id
            ? `/api/schedule/${selectedBlock.id}`
            : '/api/schedule';

        const token = localStorage.getItem('token');
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...selectedBlock,
                ...formData,
            }),
        })
            .then((response) => response.json())
            .then((savedItem) => {
                setScheduleData((prevData) => {
                    const updatedData = { ...prevData };
                    const day = savedItem.dayOfWeek;
                    const time = normalizeTime(savedItem.startTime);

                    if (!updatedData[day]) {
                        updatedData[day] = {};
                    }
                    updatedData[day][time] = savedItem;
                    return updatedData;
                });
                setIsFormOpen(false);
            });
    };

    const handleFormDelete = (id) => {
        const token = localStorage.getItem('token');
        fetch(`/api/schedule/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                setScheduleData((prevData) => {
                    const updatedData = { ...prevData };
                    delete updatedData[selectedBlock.dayOfWeek][selectedBlock.startTime];
                    return updatedData;
                });
                setIsFormOpen(false);
            })
            .catch((error) => {
                console.error('Error deleting data:', error);
            });
        window.location.reload();
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
    };

    const renderGrid = () => {
        const timeSlots = [];
        for (let i = 0; i < blocksPerDay; i++) {
            const time = startTime + i * blockDuration;
            const hours = Math.floor(time);
            const minutes = (time % 1) * 60;
            const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes === 0 ? '00' : '30'}`;
            timeSlots.push(formattedTime);
        }

        return (
            <table className="schedule-grid">
                <thead>
                <tr>
                    <th>Godzina</th>
                    {daysOfWeek.map((day) => (
                        <th key={day}>{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {timeSlots.map((time) => (
                    <tr key={time}>
                        <td>{time}</td>
                        {daysOfWeek.map((day) => (
                            <td key={day}>
                                <ScheduleBlock
                                    blockData={
                                        (scheduleData[day] && scheduleData[day][time]) || {}
                                    }
                                    onBlockClick={() => handleBlockClick(day, time)}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    const exportToPDF = async () => {
        if (scheduleContainerRef.current) {
            const canvas = await html2canvas(scheduleContainerRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('schedule.pdf');
        }
    };

    const clearSchedule = () => {
        if (scheduleData) {
            Object.keys(scheduleData).forEach((day) => {
                Object.keys(scheduleData[day]).forEach((time) => {
                    const block = scheduleData[day][time];
                    if (block && block.id) {
                        handleFormDelete(block.id);
                    }
                });
            });
        }
    };


    return (
        <div>
            <button onClick={exportToPDF} className="schedule-export-button">
                Eksportuj do PDF
            </button>

            <button onClick={clearSchedule} className="schedule-clear-button">
                Wyczyść plan
            </button>

        <div ref={scheduleContainerRef} className="schedule-container">
            {renderGrid()}

            {isFormOpen && (
                <ScheduleForm
                    onSubmit={handleFormSubmit}
                    onClose={handleFormClose}
                    initialData={selectedBlock}
                    onDelete={handleFormDelete}
                />
            )}
        </div>
        </div>
    );
}

export default ScheduleGrid;
