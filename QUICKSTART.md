# ⚡ Quick Start Guide

Get the Kanban Dashboard up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- A code editor (VS Code recommended)

## 🚀 Installation (3 steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the API Server

```bash
npm run api
```

This starts json-server on port 4000 with sample data.

### 3. Start the Development Server

```bash
npm run dev
```

**Or run both at once:**

```bash
npm run dev:all
```

## 🌐 Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

The API is available at:

```
http://localhost:4000
```

## 🎮 Quick Tour

### Main Features

1. **Create a Task**
    - Click the "New Task" button (top right)
    - Or click the "+" icon in any column
    - Or use the floating action button (bottom right)

2. **Drag & Drop**
    - Click and hold any task card
    - Drag it to a different column
    - Release to drop

3. **Search Tasks**
    - Use the search bar at the top
    - Type to search by title or description
    - Results update in real-time (300ms debounce)

4. **Filter by Column**
    - Click on column chips below the search bar
    - Click again to remove the filter
    - Use "Clear All" to reset everything

5. **Edit a Task**
    - Click the "⋮" menu on any task card
    - Select "Edit"
    - Make changes and save

6. **Delete a Task**
    - Click the "⋮" menu on any task card
    - Select "Delete"
    - Confirm deletion

7. **View Task Details**
    - Click the "⋮" menu on any task card
    - Select "View Details"

## 📂 Project Structure

```
kanban-template/
├── src/
│   ├── api/           # API client with interceptors
│   ├── components/    # React components
│   ├── constants/     # Configuration
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Route pages
│   ├── store/         # Zustand state
│   └── utils/         # Helper functions
├── db.json            # Mock database
└── .env               # Environment variables
```

## 🔧 Configuration

### Change API URL

Edit `.env`:

```env
VITE_API_URL=http://localhost:4000
```

### Add Sample Tasks

Edit `db.json` and restart the API server.

### Modify Columns

Edit `src/constants/index.js`:

```javascript
export const COLUMNS = {
    BACKLOG: {
        id: "backlog",
        title: "Backlog",
        color: "#E3F2FD",
        accentColor: "#2196F3",
    },
    // Add more columns...
};
```

## 🎨 Customization

### Change Theme Colors

Edit `src/main.jsx`:

```javascript
const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // Change this
        },
    },
});
```

### Adjust Pagination

Edit `src/constants/index.js`:

```javascript
export const PAGINATION = {
    ITEMS_PER_PAGE: 10, // Change this
};
```

### Modify Debounce Delay

Edit `src/constants/index.js`:

```javascript
export const DEBOUNCE_DELAYS = {
    SEARCH: 300, // Change this (milliseconds)
};
```

## 🐛 Troubleshooting

### Port Already in Use

**Problem:** "Port 5173 is already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### API Connection Failed

**Problem:** "Failed to fetch tasks"

**Solutions:**

1. Make sure json-server is running: `npm run api`
2. Check if port 4000 is available
3. Verify `.env` has correct API URL
4. Check browser console for CORS errors

### Build Errors

**Problem:** Build fails with errors

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Cannot Find Module

**Problem:** "Cannot find module 'xxx'"

**Solution:**

```bash
# Reinstall dependencies
npm install
```

## 📝 Common Tasks

### Add a New Custom Hook

1. Create file in `src/hooks/useYourHook.js`
2. Export it from `src/hooks/index.js`
3. Use it in your components

### Add a New Component

1. Create folder in `src/components/YourComponent/`
2. Add `index.jsx` file
3. Import and use in other components

### Add a New Route

1. Create page in `src/pages/YourPage/`
2. Update `src/App.jsx` with new route
3. Add navigation link in `src/MainLayout/index.jsx`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a new task
- [ ] Edit an existing task
- [ ] Delete a task
- [ ] Drag task between columns
- [ ] Search for tasks
- [ ] Filter by column
- [ ] Collapse/expand columns
- [ ] Test on mobile device
- [ ] Test error scenarios

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [React Query Docs](https://tanstack.com/query)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [Vite Docs](https://vitejs.dev)

## 🆘 Get Help

1. Check the full [README.md](./README.md)
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
3. Read [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) for architecture details
4. Open an issue on GitHub
5. Check browser console for errors

## 🎯 Next Steps

1. ✅ Get the app running
2. 📖 Read the full README
3. 🎨 Customize the theme
4. 🔧 Add your own features
5. 🚀 Deploy to production
6. 🌟 Star the repository (if helpful!)

---

**Need more help?** Check the complete documentation in [README.md](./README.md)

**Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Happy coding! 🚀**
