# 📚 Reading List Tracker

A localhost-only, browser-based reading list tracker built with React, TypeScript, and localStorage. Track your books, add notes, and never lose your data with automatic backups!

## ✨ Features

- **Book Management**: Add, edit, and delete books with title, author, and reading status
- **Reading Statuses**: Want to Read, Currently Reading, Finished
- **Notes**: Add unlimited notes to any book with rich text support (up to 10,000 characters)
- **Quick Notes**: Add notes directly from the book list without navigating away
- **Smart Filtering**: Filter books by reading status with persistent filter preferences
- **Auto-Backup**: Automatic JSON backups every 10 changes or 60 minutes
- **Manual Export/Import**: Export and import your entire reading list as JSON
- **Storage Monitoring**: Get warnings when approaching localStorage capacity
- **Friendly UX**: Whimsical error messages and encouraging success toasts
- **Sample Data**: 5 fun sample books to get you started

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5175`

### Building for Production

```bash
npm run build
```

## 🎨 Tech Stack

- **Frontend**: React 18 + TypeScript 5
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3
- **Storage**: Browser localStorage API
- **No Backend**: Completely self-contained frontend-only app

## 📖 Usage

### Adding Books

1. Click the **+ Add Book** button
2. Enter the book title and author
3. Select a reading status
4. Click **Add Book**

### Managing Notes

1. Click on any book card to view details
2. Click **+ Add Note** to add a new note
3. Edit or delete existing notes from the book detail page
4. Use **+ Quick Note** from the book list for fast note-taking

### Filtering Books

Use the filter buttons at the top of the list to view:
- All Books
- Want to Read
- Currently Reading
- Finished

Your filter preference is saved automatically.

### Backups

**Automatic**: Backups download every 10 changes or hourly (if changes exist)

**Manual**: Click the export button in the top-right corner to download a backup anytime

**Restore**: Click the import button and select a backup JSON file

## 🗂️ Data Storage

All data is stored in your browser's localStorage:

- `books` - Your book collection
- `notes` - All notes across all books
- `readingList_activeFilter` - Your current filter preference

**Important**: localStorage is tied to your browser and domain. Clearing browser data will delete your reading list! Use the export feature to create backups.

## 🎭 Sample Data

On first load, the app includes 5 whimsical sample books:

- "The Hitchhiker's Guide to the Galaxy" by Douglas Adams
- "Where's Waldo in the Quantum Realm?" by Schrödinger's Cat
- "Cooking with Chaos: A Dragon's Guide to BBQ" by Smaug the Magnificent
- "101 Uses for a Dead Laptop" by Marie Kondo
- "Procrastination for Dummies (Coming Soon)" by Anonymous

Feel free to delete or keep them!

## 🛠️ Development

### Project Structure

```
reading-list/
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components (BookList, BookDetail)
│   ├── services/       # Data services (books, notes, backup)
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (validation, formatting)
│   ├── App.tsx         # Main app with routing
│   └── main.tsx        # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 🧪 Testing

This is a personal project optimized for localhost use. Manual testing covers:

- ✅ CRUD operations for books and notes
- ✅ Filtering and search
- ✅ Data persistence across page refreshes
- ✅ Auto-backup triggers
- ✅ Export/import functionality
- ✅ Storage warnings
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)

## 🌟 Future Enhancements

Potential ideas for V2:
- Search functionality
- Tags and categories
- Reading progress tracking (pages read)
- Book cover images
- Dark mode
- Statistics dashboard
- Multi-device sync (would require backend)

## 📄 License

MIT License - feel free to use this for your own reading list!

## 🤝 Contributing

This is a personal project, but if you'd like to fork and enhance it, go for it! PRs welcome.

## 💡 Tips

- **Backup regularly**: Use the export feature to keep JSON backups
- **Check storage**: The app warns you at 80% capacity
- **Be descriptive**: Add detailed notes about what you're reading
- **Use Quick Notes**: Perfect for capturing thoughts while browsing your list

---

**Built with ❤️ using React, TypeScript, and way too much coffee ☕**
