import React, { useEffect, useState } from 'react';
import './PartyTable.css';

const PartyTable = () => {
    const [partyData, setPartyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchPartyData = async () => {
            try {
                const response = await fetch(`${API_URL}/partyData`);
                if (response.ok) {
                    const data = await response.json();
                    setPartyData(data);
                } else {
                    setError("Failed to fetch party data.");
                }
            } catch (error) {
                setError("Error fetching party data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartyData();
    }, []);

    const downloadCSV = () => {
        const csvRows = [];
        const headers = ["Party Name", "Guest Name", "RSVP", "Allergies"];
        csvRows.push(headers.join(","));

        Object.entries(partyData).forEach(([partyName, details]) => {
            details.members.forEach((member) => {
                const row = [
                    `"${partyName}"`,
                    `"${member.firstname} ${member.lastname}"`,
                    `"${member.rsvp || "No response"}"`,
                    `"${(member.allergies || "None").replace(/"/g, '""')}"`, // Escape double quotes
                ];
                csvRows.push(row.join(","));
            });
        });

        const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "party_table.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="party-table-container">
            <h1>RSVP Status</h1>
            <button onClick={downloadCSV} className="download-csv-button">
                Download Table as CSV
            </button>
            <table className="party-table">
                <thead>
                    <tr>
                        <th>Party Name</th>
                        <th>Guest Name</th>
                        <th>RSVP</th>
                        <th>Allergies</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(partyData).map(([partyName, details]) =>
                        details.members.map((member, index) => (
                            <tr key={`${partyName}-${index}`}>
                                <td>{partyName}</td>
                                <td>{`${member.firstname} ${member.lastname}`}</td>
                                <td>{member.rsvp || "No response"}</td>
                                <td>{member.allergies || "None"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PartyTable;
