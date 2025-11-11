# 🎯 Kanban Board - Modern Task Management

A modern, production-ready Kanban board application built with React, Material-UI, and React Query. Features smooth drag-and-drop with persistent ordering, real-time search, optimistic updates, and beautiful sync indicators.

🚀 **[Live Demo](https://kanban-template-peach.vercel.app/)**

![React](https://img.shields.io/badge/React-19.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-purple)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality

- ✅ **Drag & Drop with Persistent Order** - Smooth task reordering between and within columns using @hello-pangea/dnd with order persistence
- ✅ **Optimistic Updates** - Instant UI feedback using React's `useOptimistic` hook before server confirmation
- ✅ **CRUD Operations** - Full Create, Read, Update, and Delete operations with proper error handling
- ✅ **Real-time Search** - Debounced search (300ms) across task titles and descriptions
- ✅ **Responsive Design** - Mobile-first approach with flexible 1/2/4 column layouts

### User Experience

- ✅ **Beautiful Sync Indicators** - Subtle overlay and loading states during server updates
- ✅ **Loading Fallback** - Elegant loading screen until data is fetched
- ✅ **Error Boundaries** - Graceful error handling with detailed error display in development
- ✅ **Task Metadata** - Priority badges, relative timestamps, and task details modal
- ✅ **Collapsible Columns** - Expand/collapse columns with smooth transitions
- ✅ **Form Validation** - Client-side validation for task creation and editing

### Technical Highlights

- ✅ **React Query Integration** - Smart caching, refetching on focus/reconnect, and query invalidation
- ✅ **Context API** - Global UI state management for search and task selection
- ✅ **Custom Hooks** - Reusable hooks for tasks, debouncing, and UI state
- ✅ **JSONBin & Local Server Support** - Flexible API adapter supporting both json-server and JSONBin
- ✅ **Code Splitting** - Lazy-loaded pages for optimal bundle size
- ✅ **Clean Architecture** - Organized folder structure with separation of concerns

## 🛠️ Tech Stack

- **React 19.1** - Latest React with concurrent features (`useOptimistic`, `useTransition`)
- **Vite 7.2** - Lightning-fast build tool with HMR
- **Material-UI 7.3** - Comprehensive React component library
- **React Query 5.90** - Powerful async state management and data synchronization
- **@hello-pangea/dnd 18.0** - Beautiful and accessible drag-and-drop
- **Axios 1.13** - HTTP client with interceptors and error handling
- **json-server 1.0** - Local REST API for development

## 📁 Project Structure

```
kanban-template/
├── src/
│   ├── api/                    # API client with Axios and JSONBin adapter
│   ├── components/             # Reusable components
│   │   ├── AddTaskDialog/      # Task creation modal with validation
│   │   ├── Board/              # Main board with drag-drop logic
│   │   ├── Column/             # Column component with sorted tasks
│   │   ├── ErrorBoundary/      # Error boundary with retry functionality
│   │   ├── LoadingFallback/    # Loading screen component
│   │   ├── SearchBar/          # Debounced search input
│   │   └── TaskCard/           # Task card with edit/delete/view
│   ├── config/                 # Configuration files
│   │   ├── queryClient.js      # React Query configuration
│   │   └── theme.js            # Material-UI theme
│   ├── constants/              # App-wide constants and column definitions
│   ├── context/                # React Context for UI state
│   │   └── TaskUIContext.jsx   # Search and task selection context
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTasks.js         # Tasks CRUD operations with React Query
│   │   ├── useDebounce.js      # Debounce hook for search
│   │   └── useTaskUI.js        # UI state management hook
│   ├── pages/                  # Route pages
│   │   └── Home/               # Main home page
│   ├── utils/                  # Helper functions
│   │   ├── taskHelpers.js      # Task validation and grouping
│   │   └── dateHelpers.js      # Date formatting and relative time
│   └── main.jsx                # Entry point with providers
├── public/
├── db.json                     # json-server database with task order
├── .env.development            # Development environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Mohamed-Hashem/kanban-template.git
cd kanban-template
```

2. **Install dependencies**

```bash
npm install
```

3. **Start both servers concurrently**

```bash
npm run dev:all
```

This will start both:

- Vite dev server on http://localhost:5173
- json-server API on http://localhost:4000

**Or run them separately:**

```bash
# Terminal 1 - API Server
npm run api

# Terminal 2 - Dev Server
npm run dev
```

4. **Open your browser**

```
http://localhost:5173
```

## 📜 Available Scripts

```bash
npm run dev        # Start development server (Vite)
npm run api        # Start json-server API
npm run dev:all    # Start both Vite and json-server concurrently
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🎨 Usage

### Managing Tasks

- **Create Task**: Click the floating "+" button (bottom right) or the "+" icon in any column header
- **View Task Details**: Click the three-dot menu on any task card → View Details
- **Edit Task**: Click the three-dot menu → Edit (updates with optimistic UI)
- **Delete Task**: Click the three-dot menu → Delete (with confirmation dialog)
- **Reorder Tasks**: Drag and drop tasks within a column to change order (persists to database)
- **Move Between Columns**: Drag tasks between columns to update status
- **Search Tasks**: Use the search bar to filter tasks by title or description (debounced)
- **Collapse Columns**: Click the expand/collapse icon to minimize columns

### Task Properties

Each task includes:

- **Title** (required, max 100 characters)
- **Description** (optional, max 500 characters)
- **Priority** (Low, Medium, High) with colored badges
- **Status/Column** (Backlog, In Progress, Review, Done)
- **Order** (automatically managed for drag-drop positioning)
- **Timestamps** (created and updated dates with relative time display)

### Columns

- **Backlog** 🔵 - New tasks and ideas
- **In Progress** 🟠 - Tasks currently being worked on
- **Review** 🟣 - Tasks ready for review
- **Done** 🟢 - Completed tasks

## 🔧 Configuration

### Environment Variables

- Configure API endpoints for development and production
- Support for both json-server and JSONBin backends

### API Configuration

- Automatic API type detection (json-server or JSONBin)
- Configurable timeout and base URL
- See `src/constants/index.js`

### React Query Configuration

- Smart caching with 5-minute stale time
- Automatic refetching on window focus, mount, and reconnect
- Configurable retry logic
- See `src/config/queryClient.js`

### Column Customization

- Fully customizable column colors and accent colors
- Add, remove, or modify columns as needed
- See `src/constants/index.js`

### Theme Customization

- Material-UI theme configuration
- Customize colors, typography, spacing, and more
- See `src/config/theme.js`

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**
    - Go to [vercel.com](https://vercel.com)
    - Click "Add New Project"
    - Import your GitHub repository
    - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables**
    - Add `VITE_API_URL` in Vercel project settings
    - Use JSONBin or your own backend API URL

4. **Deploy**
    - Vercel will automatically deploy on every push to main

**Or use Vercel CLI:**

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

1. **Build the project**

```bash
npm run build
```

2. **Deploy via Netlify CLI**

```bash
npm i -g netlify-cli
netlify deploy --prod
```

3. **Or drag and drop** the `dist` folder to [Netlify](https://app.netlify.com)

### Production Backend Options

For production, you have several options:

1. **JSONBin** (Quick & Easy)
    - Create a bin at [jsonbin.io](https://jsonbin.io)
    - Set `VITE_API_URL` to your bin URL
    - Add `VITE_JSONBIN_API_KEY` for authentication

2. **Serverless Functions** (Vercel/Netlify)
    - Create API routes using serverless functions
    - Connect to a database (MongoDB, PostgreSQL, etc.)

3. **Custom Backend**
    - Build a REST API with Node.js/Express
    - Deploy to services like Railway, Render, or Heroku
    - Update `VITE_API_URL` to your API endpoint

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

**Mohamed Hashem**

- GitHub: [@Mohamed-Hashem](https://github.com/Mohamed-Hashem)
- Repository: [kanban-template](https://github.com/Mohamed-Hashem/kanban-template)

## � Key Implementation Details

### Drag & Drop Order Persistence

Tasks are ordered using integer values with spacing (1000, 2000, 3000...). When a task is moved:

1. Calculate the new order based on surrounding tasks
2. Use fractional positioning: `newOrder = Math.floor((prevOrder + nextOrder) / 2)`
3. Update optimistically in UI using `useOptimistic`
4. Persist to server asynchronously

### Optimistic Updates Flow

```javascript
// 1. Update UI immediately
startTransition(() => {
    updateOptimisticTasks({ taskId, newColumn, newOrder });
});

// 2. Send to server
patchTask.mutate({ id, updates: { column, order } });

// 3. React Query handles cache invalidation and refetch
```

### Search Implementation

- Debounced with 300ms delay using custom `useDebounce` hook
- Filters tasks by title and description (case-insensitive)
- Updates URL/state without triggering excessive re-renders

### Error Handling

- **Error Boundary**: Catches React component errors with retry functionality
- **API Errors**: Axios interceptors handle network errors with user-friendly messages
- **Query Errors**: React Query automatic retry (2 attempts) with error states
- **Rollback**: Optimistic updates rollback on mutation failure

## �🙏 Acknowledgments

- [Material-UI](https://mui.com/) - Comprehensive UI component library
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - Accessible drag-and-drop
- [React Query](https://tanstack.com/query) - Powerful data synchronization
- [json-server](https://github.com/typicode/json-server) - Quick REST API for prototyping
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

---

**Built with ❤️ using React 19 and Modern Web Technologies**
