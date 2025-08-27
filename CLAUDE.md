# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

This is a Next.js 14 calendar application built with TypeScript and React 18. The app uses the App Router pattern with client-side state management.

### Core Structure

- **App Directory (`/app`)**: Contains the main application layout and pages using Next.js App Router
  - `layout.tsx`: Root layout with global styles and metadata
  - `page.tsx`: Main calendar page with event state management
  - `globals.css`: Global styles with CSS custom properties for theming

- **Components (`/components`)**: Reusable UI components
  - `WeeklyCalendar.tsx`: Main calendar grid with weekly view, navigation, and time slots
  - `EventModal.tsx`: Modal for creating/editing events with form validation

- **Types (`/types`)**: TypeScript type definitions
  - `event.ts`: CalendarEvent interface defining event structure

- **Hooks (`/hooks`)**: Empty directory for custom React hooks

### State Management

The application uses React's built-in `useState` for state management. Event data is stored in the main page component and passed down to child components via props.

### Key Dependencies

- **Next.js 14**: React framework with App Router
- **date-fns**: Date manipulation and formatting library used throughout calendar components
- **TypeScript**: Strict typing enabled

### Path Mapping

The project uses `@/*` path aliases that map to the root directory (`"./*"`), configured in `tsconfig.json`.

### Styling Approach

- CSS-in-JS using styled-jsx for component-specific styles
- CSS custom properties (CSS variables) for consistent theming
- Green, red, and white color scheme with predefined CSS variables
- Responsive design with mobile-first approach

### Event System

Events are typed with the `CalendarEvent` interface and support:
- Time-based scheduling (startTime/endTime)
- Color coding (green/red)
- Date association using JavaScript Date objects
- Optional descriptions

### Component Communication

- Parent-child prop passing for data flow
- Event callbacks for user interactions (onEventClick, onTimeSlotClick)
- Modal state management through the main page component