'use client';

import React, { useState } from 'react';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import EventModal from '@/components/EventModal';
import ThemeToggle from '@/components/ThemeToggle';
import { CalendarEvent } from '@/types/event';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      color: 'green',
      description: 'Weekly team sync meeting',
    },
    {
      id: '2',
      title: 'Client Call',
      date: new Date(Date.now() + 86400000), // tomorrow
      startTime: '14:00',
      endTime: '15:00',
      color: 'red',
      description: 'Important client discussion',
    },
  ]);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    selectedDate?: Date;
    selectedHour?: number;
    editingEvent?: CalendarEvent | null;
  }>({
    isOpen: false,
  });

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setModalState({
      isOpen: true,
      selectedDate: date,
      selectedHour: hour,
      editingEvent: null,
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    setModalState({
      isOpen: true,
      editingEvent: event,
    });
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (modalState.editingEvent) {
      // Update existing event
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === modalState.editingEvent!.id
            ? { ...eventData, id: event.id }
            : event
        )
      );
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false });
  };

  const handleCreateEvent = () => {
    setModalState({
      isOpen: true,
      selectedDate: new Date(),
      selectedHour: 9,
      editingEvent: null,
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Calendar App</h1>
          <p className="app-subtitle">Manage your events and stay organized</p>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button className="btn btn-primary create-btn" onClick={handleCreateEvent}>
            + Create Event
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="calendar-wrapper">
          <WeeklyCalendar
            events={events}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        </div>
      </main>

      <EventModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedDate={modalState.selectedDate}
        selectedHour={modalState.selectedHour}
        editingEvent={modalState.editingEvent}
      />

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          padding: 2rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .app-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, var(--primary-green)08 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--primary-red)06 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding: 2.5rem;
          background: var(--bg-primary);
          border-radius: 1.5rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .app-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .app-header:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-2px);
        }

        .header-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .app-title {
          font-size: 3rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
          background: var(--green-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.04em;
          line-height: 1.1;
        }

        .app-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin: 0.75rem 0 0 0;
          transition: color 0.3s;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          position: relative;
          z-index: 1;
        }

        .create-btn {
          font-size: 1rem;
          padding: 1rem 1.75rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          position: relative;
          overflow: hidden;
        }

        .create-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .create-btn:hover::before {
          left: 100%;
        }

        .main-content {
          max-width: 100%;
          margin: 0 auto;
        }

        .calendar-wrapper {
          background: transparent;
        }

        @media (max-width: 1024px) {
          .app-container::before {
            background: 
              radial-gradient(circle at 30% 20%, var(--primary-green)06 0%, transparent 40%),
              radial-gradient(circle at 70% 80%, var(--primary-red)04 0%, transparent 40%);
          }
        }

        @media (max-width: 768px) {
          .app-container {
            padding: 1rem;
          }

          .app-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
            padding: 2rem;
            margin-bottom: 2rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .create-btn {
            width: 100%;
            justify-content: center;
          }

          .app-title {
            font-size: 2.25rem;
          }

          .app-subtitle {
            font-size: 1.125rem;
          }
        }

        @media (max-width: 640px) {
          .app-container {
            padding: 0.75rem;
          }

          .app-header {
            padding: 1.5rem;
            border-radius: 1.25rem;
          }

          .app-title {
            font-size: 2rem;
          }

          .app-subtitle {
            font-size: 1rem;
          }

          .main-content {
            margin: 0 -0.25rem;
          }
        }

        @media (max-width: 480px) {
          .app-container {
            padding: 0.5rem;
          }

          .app-header {
            padding: 1.25rem;
            margin-bottom: 1.5rem;
          }

          .app-title {
            font-size: 1.75rem;
          }

          .header-actions {
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;