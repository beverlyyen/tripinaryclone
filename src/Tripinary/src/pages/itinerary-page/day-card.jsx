import React from "react";
import "./day-card.css";

export default function DayCard({ title, times, place }) {
  return (
    <div className="day-row">
      <div className="day-label">{title}</div>

      <div className="time-box">
        <p className="place-name">{place}</p>
        <ul>
          {times.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}