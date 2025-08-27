'use client';

import React, { useState } from 'react';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import EventModal from '@/components/EventModal';
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
        <button className="btn btn-primary create-btn" onClick={handleCreateEvent}>
          + Create Event
        </button>
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
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
          padding: 2rem;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--gray-200);
        }

        .header-content {
          flex: 1;
        }

        .app-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0;
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .app-subtitle {
          font-size: 1.125rem;
          color: var(--gray-600);
          margin: 0.5rem 0 0 0;
        }

        .create-btn {
          font-size: 1rem;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        }

        .create-btn:hover {
          box-shadow: 0 6px 8px -1px rgba(16, 185, 129, 0.3);
          transform: translateY(-1px);
        }

        .main-content {
          max-width: 100%;
          margin: 0 auto;
        }

        .calendar-wrapper {
          background: transparent;
        }

        @media (max-width: 768px) {
          .app-container {
            padding: 1rem;
          }

          .app-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .app-title {
            font-size: 2rem;
          }

          .app-subtitle {
            font-size: 1rem;
          }
        }

        @media (max-width: 640px) {
          .app-header {
            padding: 1.5rem;
          }

          .app-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;