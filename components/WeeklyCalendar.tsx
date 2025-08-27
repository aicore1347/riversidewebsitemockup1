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
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
        }

        .calendar-container:hover {
          box-shadow: var(--shadow-xl);
        }

        .calendar-header {
          padding: 2rem;
          background: var(--green-gradient);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .calendar-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .week-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .nav-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          font-size: 1.25rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .nav-btn:active {
          transform: translateY(0);
        }

        .week-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .calendar-grid {
          display: flex;
          background: var(--bg-primary);
          transition: background-color 0.3s;
        }

        .time-column {
          width: 90px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .day-column {
          flex: 1;
          border-right: 1px solid var(--border-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .day-column:last-child {
          border-right: none;
        }

        .day-column:hover {
          background: var(--hover-overlay);
        }

        .day-header {
          height: 88px;
          padding: 1.25rem;
          background: var(--bg-secondary);
          border-bottom: 2px solid var(--border-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .day-header:hover {
          background: var(--bg-tertiary);
        }

        .day-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 0.3s;
          margin-bottom: 0.25rem;
        }

        .day-number {
          font-size: 1.375rem;
          font-weight: 700;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text-primary);
        }

        .day-number.today {
          background: var(--green-gradient);
          color: white;
          box-shadow: var(--shadow-md);
          transform: scale(1.05);
        }

        .time-slot {
          height: 70px;
          padding: 0.75rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          line-height: 1.2;
        }

        .time-slot:hover {
          background: var(--hover-overlay);
          color: var(--text-primary);
        }

        .time-slot-cell {
          height: 70px;
          border-bottom: 1px solid var(--border-primary);
          position: relative;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .time-slot-cell:hover {
          background: var(--hover-overlay);
        }

        .time-slot-cell:hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--green-gradient);
          opacity: 0.05;
          pointer-events: none;
        }

        .event-block {
          position: absolute;
          top: 4px;
          left: 4px;
          right: 4px;
          bottom: 4px;
          border-radius: 12px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-sm);
          backdrop-filter: blur(8px);
          overflow: hidden;
          position: relative;
        }

        .event-block::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: exclude;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }

        .event-block:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: var(--shadow-lg);
        }

        .event-block:active {
          transform: translateY(-1px) scale(1.01);
        }

        .event-block.green {
          background: linear-gradient(135deg, var(--lighter-green) 0%, var(--light-green) 100%);
          border: 1px solid var(--primary-green);
          color: var(--darker-green);
        }

        .event-block.red {
          background: linear-gradient(135deg, var(--lighter-red) 0%, var(--light-red) 100%);
          border: 1px solid var(--primary-red);
          color: var(--darker-red);
        }

        .event-title {
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .event-time {
          font-size: 0.6875rem;
          font-weight: 600;
          opacity: 0.85;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .calendar-header {
            padding: 1.5rem;
          }

          .week-title {
            font-size: 1.5rem;
          }

          .nav-btn {
            width: 44px;
            height: 44px;
            font-size: 1.125rem;
          }

          .time-column {
            width: 70px;
          }

          .day-header {
            height: 76px;
            padding: 1rem;
          }

          .day-name {
            font-size: 0.75rem;
            margin-bottom: 0.125rem;
          }

          .day-number {
            font-size: 1.25rem;
            width: 36px;
            height: 36px;
          }

          .time-slot {
            height: 64px;
            padding: 0.5rem;
            font-size: 0.75rem;
          }

          .time-slot-cell {
            height: 64px;
          }

          .event-block {
            top: 3px;
            left: 3px;
            right: 3px;
            bottom: 3px;
            padding: 0.5rem;
          }

          .event-title {
            font-size: 0.75rem;
            margin-bottom: 0.125rem;
          }

          .event-time {
            font-size: 0.625rem;
          }
        }

        @media (max-width: 640px) {
          .calendar-container {
            border-radius: 1.25rem;
          }

          .calendar-header {
            padding: 1.25rem;
          }

          .week-title {
            font-size: 1.25rem;
          }

          .nav-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
            border-radius: 10px;
          }

          .time-column {
            width: 60px;
          }

          .day-header {
            height: 68px;
            padding: 0.75rem;
          }

          .day-name {
            font-size: 0.6875rem;
          }

          .day-number {
            font-size: 1.125rem;
            width: 32px;
            height: 32px;
            border-radius: 10px;
          }

          .time-slot {
            height: 56px;
            padding: 0.375rem;
            font-size: 0.6875rem;
          }

          .time-slot-cell {
            height: 56px;
          }

          .event-block {
            border-radius: 10px;
            padding: 0.375rem;
          }

          .event-title {
            font-size: 0.6875rem;
          }

          .event-time {
            font-size: 0.5625rem;
          }
        }

        @media (max-width: 480px) {
          .calendar-header {
            padding: 1rem;
          }

          .week-navigation {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .week-title {
            font-size: 1.125rem;
            order: -1;
            width: 100%;
            text-align: center;
          }

          .time-column {
            width: 50px;
          }

          .time-slot {
            font-size: 0.625rem;
            padding: 0.25rem;
          }

          .day-header {
            height: 60px;
            padding: 0.5rem;
          }

          .day-name {
            font-size: 0.625rem;
          }

          .day-number {
            font-size: 1rem;
            width: 28px;
            height: 28px;
            border-radius: 8px;
          }

          .time-slot-cell, .time-slot {
            height: 48px;
          }

          .event-block {
            border-radius: 8px;
            padding: 0.25rem;
          }

          .event-title {
            font-size: 0.625rem;
            line-height: 1.2;
          }

          .event-time {
            font-size: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WeeklyCalendar;