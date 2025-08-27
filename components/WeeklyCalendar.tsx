'use client';

import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { CalendarEvent } from '@/types/event';

interface WeeklyCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  events,
  onEventClick,
  onTimeSlotClick,
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDateAndHour = (date: Date, hour: number) => {
    return events.filter(event => {
      if (!isSameDay(event.date, date)) return false;
      const eventHour = parseInt(event.startTime.split(':')[0]);
      return eventHour === hour;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(direction === 'prev' ? subWeeks(currentWeek, 1) : addWeeks(currentWeek, 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="week-navigation">
          <button 
            className="btn btn-secondary nav-btn"
            onClick={() => navigateWeek('prev')}
          >
            &#8249;
          </button>
          <h2 className="week-title">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </h2>
          <button 
            className="btn btn-secondary nav-btn"
            onClick={() => navigateWeek('next')}
          >
            &#8250;
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="time-column">
          <div className="day-header">Time</div>
          {hours.map(hour => (
            <div key={hour} className="time-slot">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            <div className="day-header">
              <div className="day-name">{format(day, 'EEE')}</div>
              <div className={`day-number ${isSameDay(day, new Date()) ? 'today' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
            {hours.map(hour => {
              const eventsInSlot = getEventsForDateAndHour(day, hour);
              return (
                <div
                  key={hour}
                  className="time-slot-cell"
                  onClick={() => onTimeSlotClick?.(day, hour)}
                >
                  {eventsInSlot.map(event => (
                    <div
                      key={event.id}
                      className={`event-block ${event.color}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      <div className="event-title">{event.title}</div>
                      <div className="event-time">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .calendar-container {
          background: var(--bg-primary);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px var(--shadow-medium);
          border: 1px solid var(--border-primary);
          transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
        }

        .calendar-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
          color: white;
        }

        .week-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.2rem;
          font-weight: bold;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .week-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .calendar-grid {
          display: flex;
          background: var(--bg-primary);
          transition: background-color 0.3s;
        }

        .time-column {
          width: 80px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-primary);
          transition: background-color 0.3s, border-color 0.3s;
        }

        .day-column {
          flex: 1;
          border-right: 1px solid var(--border-primary);
          transition: border-color 0.3s;
        }

        .day-column:last-child {
          border-right: none;
        }

        .day-header {
          height: 80px;
          padding: 1rem;
          background: var(--bg-secondary);
          border-bottom: 2px solid var(--border-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .day-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color 0.3s;
        }

        .day-number {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0.25rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .day-number.today {
          background: var(--primary-green);
          color: white;
        }

        .time-slot {
          height: 60px;
          padding: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-primary);
          transition: color 0.3s, border-color 0.3s;
        }

        .time-slot-cell {
          height: 60px;
          border-bottom: 1px solid var(--border-primary);
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.3s;
        }

        .time-slot-cell:hover {
          background: var(--bg-secondary);
        }

        .event-block {
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          border-radius: 4px;
          padding: 0.25rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .event-block:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .event-block.green {
          background: var(--light-green);
          border: 1px solid var(--primary-green);
          color: var(--dark-green);
        }

        .event-block.red {
          background: var(--light-red);
          border: 1px solid var(--primary-red);
          color: var(--dark-red);
        }

        .event-title {
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
          line-height: 1.2;
        }

        .event-time {
          font-size: 0.625rem;
          font-weight: 400;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default WeeklyCalendar;