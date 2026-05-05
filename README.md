# Video Generator

A full-stack application that handles image uploads and processes them to generate simulated video content. 

This project was built to demonstrate full-stack architecture, including file handling, external API integration, and database management, wrapped in a clean, modern user interface.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express, Multer (for file uploads)
- Database: SQLite (local file database)

## Project Structure
- /frontend: The React application.
- /backend: The Node.js API server.

## Installation and Setup

You need two separate terminal windows to run both the backend and frontend servers.

### 1. Backend Setup
The backend uses a local SQLite database that initializes automatically on the first run.

```bash
cd backend
npm install
node server.js
```
The backend API runs on `http://localhost:5000`.

### 2. Frontend Setup
In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
The frontend application will start and can be accessed at `http://localhost:5173`. 

## Features
- Image Upload: Users can select and preview an image from their device.
- API Integration: The backend processes the image and forwards it to the necessary endpoints.
- Simulated Video Generation: To work around static mock APIs, the frontend dynamically animates the uploaded image using CSS to simulate video generation.
- History: Previous generations are stored in the SQLite database and fetched automatically on load.
