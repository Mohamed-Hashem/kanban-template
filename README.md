# 🎯 Kanban Dashboard - Advanced Task Management System

A modern, feature-rich Kanban board application built with React, Material-UI, and advanced state management. This project demonstrates production-ready code architecture with drag-and-drop, real-time search, infinite scroll, and comprehensive error handling.

![React](https://img.shields.io/badge/React-19.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality

- ✅ **Drag & Drop**: Smooth task movement between columns using @hello-pangea/dnd
- ✅ **CRUD Operations**: Create, Read, Update, and Delete tasks with optimistic updates
- ✅ **Real-time Search**: Debounced search across all tasks (300ms delay)
- ✅ **Column Filtering**: Filter tasks by specific columns
- ✅ **Infinite Scroll**: Pagination support in each column (10 items per page)
- ✅ **Responsive Design**: Mobile-first approach with collapsible sidebar

### Advanced Features

- 🚀 **Optimistic Updates**: Instant UI feedback before server confirmation
- 🔄 **Auto Retry**: Failed API requests retry automatically (3 attempts)
- 💾 **State Persistence**: Tasks and filters saved to localStorage
- 🎨 **Custom Theming**: Material-UI theme with custom colors and styles
- 📱 **PWA Ready**: Responsive and mobile-optimized
- 🔍 **Error Boundaries**: Graceful error handling with retry functionality
- 🎭 **Loading States**: Skeleton screens and progress indicators

## 🛠️ Tech Stack

### Frontend Framework

- **React 19.1** - Latest React with concurrent features
- **Vite 7.1** - Lightning-fast build tool
- **React Router 7.9** - Client-side routing with lazy loading

### UI Library

- **Material-UI 7.3** - Comprehensive React component library
- **@mui/icons-material** - Material Design icons
- **@emotion** - CSS-in-JS styling

### State Management

- **Zustand 5.0** - Lightweight state management
- **Zustand Middleware**:
    - `persist` - LocalStorage persistence
    - `immer` - Immutable state updates

### Data Fetching

- **React Query 5.90** - Powerful data synchronization
- **Axios 1.13** - HTTP client with interceptors

### Drag & Drop

- **@hello-pangea/dnd 18.0** - Beautiful drag-and-drop (maintained fork of react-beautiful-dnd)

### Utilities

- **react-infinite-scroll-component 6.1** - Infinite scroll pagination
- **Custom Hooks** - useDebounce, useLocalStorage, useDragAndDrop, etc.

## 📁 Project Structure

```
kanban-template/
├── src/
│   ├── api/                    # API layer with Axios
│   │   └── index.js            # API client, interceptors, endpoints
│   ├── assets/                 # Static assets
│   ├── components/             # Reusable components
│   │   ├── AddTaskDialog/      # Task creation modal
│   │   ├── Board/              # Main Kanban board with DnD
│   │   ├── Column/             # Column with infinite scroll
│   │   ├── ErrorBoundary/      # Error handling boundary
│   │   ├── SearchBar/          # Search and filter UI
│   │   └── TaskCard/           # Task card with actions
│   ├── constants/              # App-wide constants
│   │   └── index.js            # Columns, API config, query keys
│   ├── context/                # React Context providers
│   ├── features/               # Feature-based modules
│   │   └── kanban/             # Kanban-specific features
│   ├── hooks/                  # Custom React hooks
│   │   ├── index.js            # Barrel export
│   │   ├── useTasks.js         # Task management hook
│   │   ├── useDebounce.js      # Debounce hook
│   │   ├── useLocalStorage.js  # LocalStorage hook
│   │   ├── useDragAndDrop.js   # Drag state management
│   │   └── useWindowSize.js    # Responsive hooks
│   ├── MainLayout/             # Main app layout
│   │   └── index.jsx           # Shell with navigation
│   ├── pages/                  # Route pages
│   │   ├── Home/               # Dashboard page
│   │   └── About/              # About page
│   ├── store/                  # Zustand stores
│   │   └── taskStore.js        # Task state management
│   ├── utils/                  # Helper functions
│   │   ├── index.js            # Barrel export
│   │   ├── taskHelpers.js      # Task utilities
│   │   └── dateHelpers.js      # Date formatting
│   ├── App.css                 # Global styles
│   ├── App.jsx                 # Root component
│   ├── index.css               # Base CSS
│   └── main.jsx                # Entry point
├── public/                     # Public assets
├── .env.example                # Environment variables template
├── eslint.config.js            # ESLint configuration
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- json-server (for local API)

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd kanban-template
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` if needed:

    ```env
    VITE_API_URL=http://localhost:4000
    VITE_APP_TITLE=Kanban Dashboard
    VITE_ENABLE_DEVTOOLS=true
    ```

4. **Set up the API (json-server)**

    Create `db.json` in the project root:

    ```json
    {
        "tasks": [
            {
                "id": 1,
                "title": "Design homepage",
                "description": "Create a modern, responsive homepage design",
                "column": "backlog",
                "priority": "high",
                "createdAt": "2025-10-30T10:00:00.000Z",
                "updatedAt": "2025-10-30T10:00:00.000Z"
            },
            {
                "id": 2,
                "title": "Implement authentication",
                "description": "Add user login and registration",
                "column": "in-progress",
                "priority": "medium",
                "createdAt": "2025-10-30T11:00:00.000Z",
                "updatedAt": "2025-10-30T11:00:00.000Z"
            }
        ]
    }
    ```

5. **Start the API server** (in a separate terminal)

    ```bash
    npx json-server --watch db.json --port 4000
    ```

6. **Start the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

7. **Open your browser**
    ```
    http://localhost:5173
    ```

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🎨 Features Breakdown

### 1. Drag & Drop

- Smooth animations during drag
- Visual feedback with hover states
- Column highlighting on drag over
- Optimistic updates before API confirmation

### 2. Search & Filter

- Real-time search with 300ms debounce
- Search across title and description
- Column-based filtering
- Clear all filters button

### 3. Task Management

- **Create**: Modal form with validation
- **Read**: View detailed task information
- **Update**: Edit task inline or via modal
- **Delete**: Confirmation dialog before deletion

### 4. State Management

- **Zustand Store**: Global state with middleware
- **React Query**: Server state with caching
- **LocalStorage**: Persistence across sessions
- **Optimistic Updates**: Instant UI feedback

### 5. API Integration

- **Axios Interceptors**: Request/response handling
- **Retry Logic**: Automatic retry on failure
- **Error Handling**: User-friendly error messages
- **Request Logging**: Development mode logging

## 🔧 Configuration

### API Configuration

Edit `src/constants/index.js`:

```javascript
export const API_CONFIG = {
    BASE_URL: "http://localhost:4000",
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};
```

### Column Configuration

Customize columns in `src/constants/index.js`:

```javascript
export const COLUMNS = {
    BACKLOG: {
        id: "backlog",
        title: "Backlog",
        color: "#E3F2FD",
        accentColor: "#2196F3",
    },
    // ... more columns
};
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

## 🧪 Testing Strategy

Recommended testing approach:

- **Unit Tests**: Utility functions, hooks
- **Integration Tests**: Component interactions
- **E2E Tests**: User flows with Playwright/Cypress

## 📝 Code Quality

- **ESLint**: Code linting with React rules
- **Prettier**: Consistent code formatting
- **Error Boundaries**: Graceful error handling
- **PropTypes**: Runtime type checking (optional)

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Task assignments and collaborators
- [ ] Due dates and reminders
- [ ] File attachments
- [ ] Comments and activity log
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Export/Import tasks (JSON, CSV)
- [ ] WebSocket for real-time updates
- [ ] Advanced filtering (by date, priority, assignee)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the component library
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag-and-drop
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [React Query](https://tanstack.com/query) for data fetching

---

**Built with ❤️ using React and Modern Web Technologies**
