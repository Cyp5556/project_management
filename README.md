🧩 Project Management & Documentation Tool

A Confluence-style collaborative editor combined with a Jira-style Kanban board, built as part of a take-home assignment.
The project focuses on real-time collaboration, rich-text editing, and intuitive Kanban workflows — providing a modern interface for project documentation and planning.

🚀 Objective

The goal of this project is to design and implement a frontend system capable of:

Real-time, rich-text collaboration.

Fluid Kanban-style task management.

Seamless project and team navigation.

Role-based UI and access simulation.

🏗️ Tech Stack

Frontend:

⚡ React (Vite-based setup)

🎨 TailwindCSS

🧭 React Beautiful DnD (for Kanban drag-and-drop)

✨ Framer Motion (animations)

🧱 Lucide React (icons)

🧩 Context API for global state management

Backend / Mock Setup:

Local mock API or static JSON data for demo purposes

WebSocket/State-sync simulation (for collaboration)


⚙️ Features Implemented
📝 Collaborative Rich Text Editor

Real-time content updates (mocked multi-user presence).

Rich formatting support: headings, lists, checkboxes, code blocks, inline links.

Markdown shortcuts and autosave.

Hierarchical page navigation and breadcrumbs.

📜 Page Versioning & History

Every major change generates a version snapshot.

Restore or compare previous versions (with diff highlighting).

🗂️ Kanban Boards

Configurable columns (To Do, In Progress, Done).

Smooth drag-and-drop cards using react-beautiful-dnd.

Inline card editing (no modals).

Each card supports title, description, assignee, labels, due date.

Linked documentation pages for context.

🔔 Activity Feed

Real-time feed of edits and movements.

Filters by user, project, or resource.

🧭 Multi-Project Support

Sidebar for switching between projects.

Each project has isolated boards and pages.

🔐 Role-Based Access (UI Enforcement)

Mock roles: Owner, Admin, Editor, Viewer.

Restricted actions hidden or disabled based on current role.

📩 Notification Simulation

Local toast or popup on mentions/assignments.

🎨 UI/UX Highlights

Responsive layout (desktop + tablet).

Smooth transitions and micro-interactions.

Consistent color theme (Light/Dark mode).

Clean typography and spacing for minimal cognitive load.

📁 Folder Structure
src/
├── App.jsx                      # Main app wrapper with providers
├── main.jsx                     # Entry point
├── index.css                    # Global styles
├── contexts/
│   ├── ThemeContext.jsx        # Theme management
│   └── AppContext.jsx          # Global state management
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx          # Main layout with Header + Sidebar
│   │   ├── Header.jsx          # Top navigation bar
│   │   └── Sidebar.jsx         # Left sidebar with projects
│   ├── Pages/
│   │   └── PageView.jsx        # Individual page view with editor
│   ├── Editor/
│   │   └── RichTextEditor.jsx  # Markdown editor component
│   ├── Kanban/
│   │   ├── KanbanBoard.jsx     # Board container
│   │   ├── KanbanColumn.jsx    # Column component
│   │   └── KanbanCard.jsx      # Card component
│   ├── Activity/
│   │   ├── ActivityFeed.jsx    # Activity feed page
│   │   └── ActivityItem.jsx    # Individual activity item
│   ├── Common/
│   │   ├── Toast.jsx           # Toast notifications
│   │   └── Modal.jsx           # Reusable modal
│   └── Dashboard/
│       └── Dashboard.jsx       # Dashboard/home page
├── utils/
│   ├── permissions.js          # Role-based permission checks
│   └── helpers.js              # Utility functions
├── data/
│   └── mockData.js             # Mock users and projects
└── routes/
    └── routes.jsx              # React Router configuration
    

🧠 Setup Guide
1️⃣ Clone Repository
git clone https://github.com/<your-username>/project-management-tool.git
cd project-management-tool

2️⃣ Install Dependencies
npm install

3️⃣ Run the App
npm run dev

4️⃣ Build for Production
npm run build

🧾 Documentation

Located in the /docs folder:

🧩 Component Architecture Diagram

🧠 Collaboration Logic & Editor Architecture

⚙️ Setup and Configuration Guide

🧭 Known Limitations & Future Enhancements

🔍 Known Limitations

Real-time sync simulated locally (no live backend).

Authentication & role handling mocked with context.

Version comparison simplified (text-level diff only).

🌱 Future Improvements

Add backend (Firebase / Supabase / Socket.io) for true real-time sync.

Implement full document comments & threads.

Add slash-command quick insert menu.

Integrate GitHub issues or Google Calendar API.

🎥 Demo Video

A short (~2 min) demo video covers:

Real-time editing and collaboration.

Version restore.

Kanban workflow.

Activity feed in action.

🏁 Deliverables

✅ Source code on GitHub

✅ Deployed application (Vercel link)

✅ /docs folder with documentation

✅ Demo video

🧩 Evaluation Focus

Robust frontend architecture and state management.

Fluid and intuitive UX interactions.

Rich, modular component design.

Clear communication of design and technical reasoning.
