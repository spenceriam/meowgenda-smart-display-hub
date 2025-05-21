# MeowGenda Smart Display Hub

## Project Overview

MeowGenda is a modern, all-in-one personal information hub designed to help you stay organized and informed. It provides a centralized dashboard for managing your daily activities, notes, tasks, and more.

### Key Features

- **Calendar**: Manage events and appointments with an interactive calendar
- **Notes**: Create, edit, and organize personal notes with color coding
- **Tasks**: Track to-do items with completion status
- **Weather**: View current weather conditions and forecasts
- **News**: Browse news from various RSS feed sources by categories
- **Settings**: Customize the application appearance and integrations

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/spenceriam/meowgenda-smart-display-hub.git

# Step 2: Navigate to the project directory
cd meowgenda-smart-display-hub

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at http://localhost:8080

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm run build:dev` - Create a development build
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## Technologies

MeowGenda is built with modern web technologies:

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Navigation and routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - UI component collection
- **React Query** - Data fetching and state management
- **Lucide React** - Icon library
- **date-fns** - Date manipulation

## Application Structure

The application is organized into feature-based components:

- `/src/components` - UI components organized by feature
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and libraries
- `/src/pages` - Main route pages
- `/src/types` - TypeScript type definitions

## Data Persistence

MeowGenda uses the browser's localStorage to persist data, including:

- Notes
- Tasks
- Calendar events
- News sources and articles
- Weather location and data
- Application settings

## Responsive Design

The application is fully responsive and supports both desktop and mobile devices:

- Collapsible sidebar navigation
- Adaptive layouts for different screen sizes
- Mobile-optimized UI elements and interactions

## Editing and Contributing

There are several ways to edit and contribute to this codebase:

**Use your preferred IDE**

Clone this repository and make changes locally using your preferred development environment.

**Edit directly in GitHub**

- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon) at the top right of the file view
- Make your changes and commit them

**Use GitHub Codespaces**

- Navigate to the main page of your repository
- Click on the "Code" button (green button) near the top right
- Select the "Codespaces" tab
- Click on "New codespace" to launch a new Codespace environment
