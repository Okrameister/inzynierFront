import React from 'react';
import '../styles/ScheduleBlock.css';

function ScheduleBlock({ blockData, onBlockClick }) {
    const { subject, room, classType } = blockData;

    const getClassNameByClassType = (type) => {
        switch (type) {
            case 'Wykład':
                return 'schedule-block-lecture';
            case 'Ćwiczenia':
                return 'schedule-block-exercise';
            case 'Laboratoria':
                return 'schedule-block-lab';
            case 'Zajęcia pozalekcyjne':
                return 'schedule-block-other';
            default:
                return 'schedule-block-empty';
        }
    };

    return (
        <div
            className={`schedule-block ${getClassNameByClassType(classType)}`}
            onClick={onBlockClick}
        >
            {subject ? (
                <>
                    <div className="schedule-block-subject">{subject}</div>
                    <div className="schedule-block-room">Sala: {room}</div>
                    <div className="schedule-block-type">{classType}</div>
                </>
            ) : (
                <div className="schedule-block-empty-text">Dodaj zajęcia</div>
            )}
        </div>
    );
}

export default ScheduleBlock;
