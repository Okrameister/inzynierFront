import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import "../styles/UserGroupAssigner.css";

export default function UserGroupAssigner() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignedGroupId, setAssignedGroupId] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchGroups();
    }, []);

    async function fetchGroups() {
        setLoading(true);
        try {
            const response = await axios.get("/api/groups", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroups(response.data);
        } catch (err) {
            console.error("Błąd pobierania grup:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAssignToGroup(groupId) {
        try {
            await axios.put(`/api/users/group/${groupId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignedGroupId(groupId);
        } catch (err) {
            console.error("Błąd przypisywania do grupy:", err);
        }
    }

    function renderGroup(group, depth = 0) {
        const marginLeft = depth * 20;

        return (
            <div key={group.id} className="uga-group-item" style={{ marginLeft }}>
                {group.id !== 0  && (
                    <div>
                    <span className="uga-group-name">{group.name}</span>
                    <FontAwesomeIcon
                        icon={assignedGroupId === group.id ? faCheck : faUserPlus}
                        className={`uga-icon ${assignedGroupId === group.id ? "uga-assigned" : "uga-assign"}`}
                        onClick={() => handleAssignToGroup(group.id)}
                    />
                </div>
                )}

                {group.subGroups?.map((sub) => renderGroup(sub, depth + 1))}
            </div>
        );
    }

    if (loading) {
        return <div>Ładowanie grup...</div>;
    }

    const rootGroup = groups.find((g) => g.id === 0);
    if (!rootGroup) {
        return <div>Nie znaleziono grupy głównej (id=0)!</div>;
    }

    const handleAccept = () => {
        window.location.href = "/auth";
    };

    return (
        <div className="uga-container">
            <h2 className="uga-title">Zapisz się do grup!</h2>
            {renderGroup(rootGroup, 0)}
            <button className="uga-button" onClick={handleAccept}>Zaakceptuj</button>
        </div>
    );
}