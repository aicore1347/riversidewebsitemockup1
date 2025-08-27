'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '@/types/event';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (eventId: string) => void;
  selectedDate?: Date;
  selectedHour?: number;
  editingEvent?: CalendarEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  selectedHour,
  editingEvent,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState<'green' | 'red'>('green');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDate(format(editingEvent.date, 'yyyy-MM-dd'));
      setStartTime(editingEvent.startTime);
      setEndTime(editingEvent.endTime);
      setColor(editingEvent.color);
      setDescription(editingEvent.description || '');
    } else if (selectedDate) {
      setDate(format(selectedDate, 'yyyy-MM-dd'));
      if (selectedHour !== undefined) {
        const hourStr = selectedHour.toString().padStart(2, '0');
        setStartTime(`${hourStr}:00`);
        const endHour = selectedHour + 1;
        setEndTime(`${endHour.toString().padStart(2, '0')}:00`);
      }
      setTitle('');
      setDescription('');
      setColor('green');
    }
  }, [editingEvent, selectedDate, selectedHour, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !startTime || !endTime) return;

    onSave({
      title: title.trim(),
      date: new Date(date),
      startTime,
      endTime,
      color,
      description: description.trim() || undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDate('');
    setStartTime('09:00');
    setEndTime('10:00');
    setColor('green');
    setDescription('');
    onClose();
  };

  const handleDelete = () => {
    if (editingEvent && onDelete) {
      onDelete(editingEvent.id);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Event Title</label>
            <input
              type="text"
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="color" className="form-label">Color</label>
              <select
                id="color"
                className="input"
                value={color}
                onChange={(e) => setColor(e.target.value as 'green' | 'red')}
              >
                <option value="green">Green</option>
                <option value="red">Red</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime" className="form-label">Start Time</label>
              <input
                type="time"
                id="startTime"
                className="input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime" className="form-label">End Time</label>
              <input
                type="time"
                id="endTime"
                className="input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <textarea
              id="description"
              className="input textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            {editingEvent && onDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Event
              </button>
            )}
            <div className="action-buttons">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: modalOverlayFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalOverlayFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }

        .modal-content {
          background: var(--bg-primary);
          border-radius: 1.5rem;
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-2xl);
          border: 1px solid var(--border-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          animation: modalContentSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalContentSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          border-bottom: 1px solid var(--border-primary);
          background: var(--green-gradient);
          color: white;
          border-radius: 1.5rem 1.5rem 0 0;
          transition: border-color 0.3s;
          position: relative;
          overflow: hidden;
        }

        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
          position: relative;
          z-index: 1;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 1.5rem;
          color: white;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
          position: relative;
          z-index: 1;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .close-btn:active {
          transform: scale(0.95);
        }

        .modal-form {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          transition: color 0.3s;
          letter-spacing: -0.01em;
        }

        .textarea {
          resize: vertical;
          min-height: 100px;
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-primary);
          transition: border-color 0.3s;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .modal-content {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .modal-header {
            padding: 1.5rem;
          }

          .modal-form {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .action-buttons {
            flex-direction: column;
            width: 100%;
            gap: 0.75rem;
          }
          
          .modal-actions {
            flex-direction: column;
            gap: 1.25rem;
            align-items: stretch;
          }

          .modal-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EventModal;