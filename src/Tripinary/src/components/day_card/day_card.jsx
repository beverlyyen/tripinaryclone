import React from "react";
import "./day_card.css";

export default function DayCard({ title, times, place, onItemClick }) {
    return (
        <div className="day-row">
            <div className="day-label">{title}</div>

            <div className="time-box">
                <ul>
                    {times.map((entry, index) => (
                        <li key={index} onClick={() => onItemClick && onItemClick(entry.activity)}>
                            <strong>{entry.time}</strong>: {entry.activity}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
