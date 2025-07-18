import React from "react";
import "./day-card.css";

export default function DayCard({ title, times, place }) {
    return (
        <div className="day-row">
            <div className="day-label">{title}</div>

            <div className="time-box">
                <ul>
                    {times.map((entry, index) => (
                        <li key={index}>
                            <strong>{entry.time}</strong>: {entry.activity}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
