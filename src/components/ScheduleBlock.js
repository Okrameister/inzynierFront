import React from 'react';
import '../styles/ScheduleBlock.css';

function ScheduleBlock({ blockData, onBlockClick }) {
    const { subject, room, classType } = blockData;

    const getColorByClassType = (type) => {
        switch (type) {
            case 'Wykład':
                return '#D6EAF8'; // Jasnoniebieski
            case 'Ćwiczenia':
                return '#D5F5E3'; // Jasnozielony
            case 'Laboratoria':
                return '#FCF3CF'; // Jasnożółty
            default:
                return '#FFFFFF'; // Biały dla pustych bloków
        }
    };

    return (
        <div
            className="schedule-block"
            style={{ backgroundColor: getColorByClassType(classType) }}
            onClick={onBlockClick}
        >
            {subject ? (
                <>
                    <div className="schedule-block-subject">{subject}</div>
                    <div className="schedule-block-room">Sala: {room}</div>
                    <div className="schedule-block-type">
                        {classType}
                    </div>
                </>
            ) : (
                <div style={{ color: '#ccc' }}>Dodaj zajęcia</div>
            )}
        </div>
    );
}

export default ScheduleBlock;
