# 🎯 Kanban Board - Modern Task Management

A modern, production-ready Kanban board application built with React, Material-UI, Zustand, and React Query. Features smooth drag-and-drop, real-time search, and optimistic updates.

🚀 **[Live Demo](https://kanban-template-peach.vercel.app/)**

![React](https://img.shields.io/badge/React-19.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- ✅ **Drag & Drop** - Smooth task movement between columns using @hello-pangea/dnd
- ✅ **CRUD Operations** - Create, Read, Update, and Delete tasks with optimistic updates
- ✅ **Real-time Search** - Debounced search across task titles and descriptions
- ✅ **Responsive Design** - Mobile-first approach with flexible column layout
- ✅ **State Persistence** - Tasks and filters saved to localStorage
- ✅ **Error Boundaries** - Graceful error handling with retry functionality

## 🛠️ Tech Stack

- **React 19.1** - Latest React with concurrent features
- **Vite 7.1** - Lightning-fast build tool
- **Material-UI 7.3** - Comprehensive React component library
- **Zustand 5.0** - Lightweight state management with persist middleware
- **React Query 5.90** - Powerful data synchronization
- **@hello-pangea/dnd 18.0** - Beautiful drag-and-drop
- **Axios 1.13** - HTTP client with interceptors

## 📁 Project Structure

```
kanban-template/
├── src/
│   ├── api/                    # API client with Axios
│   ├── components/             # Reusable components
│   │   ├── AddTaskDialog/
│   │   ├── Board/
│   │   ├── Column/
│   │   ├── ErrorBoundary/
│   │   ├── SearchBar/
│   │   └── TaskCard/
│   ├── constants/              # App-wide constants
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route pages
│   ├── store/                  # Zustand store
│   ├── utils/                  # Helper functions
│   └── main.jsx                # Entry point
├── public/
├── db.json                     # json-server database
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

3. **Start the API server** (in a separate terminal)

```bash
npm run server
```

This will start json-server on http://localhost:4000

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

```
http://localhost:5173
```

## 📜 Available Scripts

```bash
npm run dev      # Start development server (Vite)
npm run server   # Start json-server API
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Usage

### Managing Tasks

- **Create Task**: Click the floating "+" button or the "+" icon in any column header
- **Edit Task**: Click the three-dot menu on any task card → Edit
- **Delete Task**: Click the three-dot menu → Delete
- **Move Task**: Drag and drop tasks between columns
- **Search Tasks**: Use the search bar to filter tasks by title or description

### Columns

- **Backlog** - New tasks and ideas
- **In Progress** - Tasks currently being worked on
- **Review** - Tasks ready for review
- **Done** - Completed tasks

## 🔧 Configuration

### API Configuration

Edit `src/constants/index.js`:

```javascript
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:4000",
    TIMEOUT: 10000,
};
```

### Column Customization

Modify columns in `src/constants/index.js`:

```javascript
export const COLUMNS = {
    BACKLOG: {
        id: "backlog",
        title: "Backlog",
        color: "#E3F2FD",
        accentColor: "#2196F3",
    },
    // Add or modify columns as needed
};
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify

**Note:** For production, replace json-server with a real backend API.

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

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) - UI component library
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - Drag-and-drop
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Query](https://tanstack.com/query) - Data fetching

---

**Built with ❤️ using React and Modern Web Technologies**
