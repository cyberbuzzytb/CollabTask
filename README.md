# CollabTask - Task Management Application

A modern task management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring a Kanban board, task filtering, and real-time updates.

## Features

- Create, read, update, and delete tasks
- Drag and drop tasks between status columns
- Filter tasks by priority, subject, and status
- Search and sort tasks
- Responsive design for mobile and desktop
- Dark mode support
- Real-time updates

## Tech Stack

- Frontend: React, Material UI
- Backend: Node.js, Express
- Database: MongoDB
- Drag and Drop: @hello-pangea/dnd

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/collabtask.git
cd collabtask
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment Variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `PORT`: 5000

### Frontend Deployment (Render)

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`
   - Environment Variables:
     - `VITE_API_URL`: Your backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
