import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/GroupCreator.css"; // Import pliku CSS

export default function GroupCreator() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredGroupId, setHoveredGroupId] = useState(null); // ID grupy najechanej myszką
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

    async function handleAddGroup(parentGroup) {
        const name = prompt(`Podaj nazwę nowej grupy (podgrupa dla "${parentGroup.name}")`);
        if (!name) return;

        try {
            const newGroup = {
                name: name.trim(),
                parentGroup: { id: parentGroup.id },
            };

            await axios.post("/api/groups", newGroup, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchGroups();
        } catch (err) {
            console.error("Błąd tworzenia grupy:", err);
        }
    }

    async function handleEditGroup(group, parentGroupId) {
        const newName = prompt("Nowa nazwa grupy:", group.name);
        if (!newName) return;

        try {
            const payload = {
                id: group.id,
                name: newName.trim(),
                parentGroup: parentGroupId,
            };

            await axios.put(`/api/groups/${group.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchGroups();
        } catch (err) {
            console.error("Błąd edycji grupy:", err);
        }
    }

    async function handleDeleteGroup(group) {
        const confirmDel = window.confirm(
            `Na pewno usunąć grupę "${group.name}" i jej podgrupy?`
        );
        if (!confirmDel) return;

        try {
            await axios.delete(`/api/groups/${group.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchGroups();
        } catch (err) {
            console.error("Błąd usuwania grupy:", err);
        }
    }

    function renderGroup(group, depth = 0, parentGroup) {
        const marginLeft = depth * 20;

        return (
            <div
                key={group.id}
                className="group-item"
                style={{ marginLeft }}
                onMouseEnter={() => setHoveredGroupId(group.id)}
                onMouseLeave={() => setHoveredGroupId(null)}
            >
                {group.id !== 0 && (
                    <div>
                        <span className="group-name">{group.name}</span>
                        {hoveredGroupId === group.id && (
                            <div className="group-icons">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="icon"
                                    onClick={() => handleAddGroup(group)}
                                />
                                <FontAwesomeIcon
                                    icon={faPen}
                                    className="icon"
                                    onClick={() => handleEditGroup(group, parentGroup)}
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="icon"
                                    onClick={() => handleDeleteGroup(group)}
                                />
                            </div>
                        )}
                    </div>
                )}
                {group.subGroups?.map((sub) => renderGroup(sub, depth + 1, group))}
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

    return (
        <div className="group-creator-container">
            <h2 className="group-creator-title">Grupy zajęciowe</h2>
            <FontAwesomeIcon
                icon={faPlus}
                className="icon"
                onClick={() => handleAddGroup(rootGroup)}
            />
            {renderGroup(rootGroup, 0, null)}
        </div>
    );
}
