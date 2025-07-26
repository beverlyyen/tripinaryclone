import React from "react";
import "./day_card.css";

export default function DayCard({ day, items, onSelectPlace }) {
    return (
        <div className="day-row">
            <div className="day-label">{day}</div>

            <div className="time-box">
                <ul>
                    {items && items.length > 0 ? (
                        items.map((entry, index) => (
                            <li key={index} onClick={() => onSelectPlace(entry)}>
                                <strong>{entry.time}</strong>: {entry.activity}
                            </li>
                        ))
                    ) : (
                        <li>No activities planned for this day.</li> // In case empty
                    )}
                </ul>
            </div>
        </div>
    );
}
