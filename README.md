BlogBot AI 🤖
BlogBot AI is a powerful content creation assistant designed to streamline the process of writing, refining, and scheduling blog posts. Leveraging the power of Google's Generative AI, this full-stack application provides a seamless interface for generating high-quality content that matches a specific brand voice, managing a content calendar, and saving valuable posts to a persistent library.

✨ Key Features
AI-Powered Content Generation: Engage in a conversational chat interface to generate complete, well-structured blog posts on any topic.

Content Refinement: Paste your own raw text and use the AI to automatically format it with proper headings, bolding, and underlining, enhancing readability and professionalism.

Automated Scheduling: Schedule blog posts to be generated and published at a specific date and time. The system uses a cron job to handle generation automatically.

Dynamic Content Calendar: View all scheduled, completed, and failed blog posts in an organized, filterable list.

Persistent Blog Library: Save your favorite or most important generated posts to a permanent library for future reference and use.

Markdown Editor & Preview: Edit generated content in a simple Markdown editor and preview the final, beautifully rendered output.

Responsive & Modern UI: A clean, professional, and responsive user interface built with React and Tailwind CSS, featuring a collapsible, overlapping sidebar for a great user experience.

🛠️ Tech Stack
This project is a full-stack MERN application with some key modern technologies:

Frontend:

React: A JavaScript library for building user interfaces.

Vite: A blazing-fast frontend build tool.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Backend:

Node.js: A JavaScript runtime environment.

Express.js: A minimal and flexible Node.js web application framework.

MongoDB: A NoSQL database for storing all blog data (scheduled posts, saved posts, etc.).

Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.

Google Generative AI API (Gemini): The core AI service used for content generation and refinement.

node-cron: A simple cron-like job scheduler for Node.js to handle automated post generation.

/******/

📂 Project Structure
/blog-ai/
├── backend/
│   ├── models/
│   │   └── blog.js         # Mongoose schema for blogs
│   ├── .env                # Environment variables (API keys, DB URI)
│   ├── company-data.js     # Reference material for the AI prompt
│   └── server.js           # Express server, API routes, and cron job logic
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable React components (Sidebar, ChatView, etc.)
    │   ├── App.jsx         # Main application component and state logic
    │   └── index.css       # Tailwind CSS setup
    └── ...                 # Other Vite and React config files

🚀 Setup and Installation
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later recommended)

npm (or yarn/pnpm)

MongoDB Atlas account (or a local MongoDB instance)

A Google Generative AI API Key

Backend Setup
Clone the repository:

git clone https://github.com/your-username/BlogBot-AI.git
cd BlogBot-AI/backend

Install NPM packages:

npm install

Create an environment file:
Create a file named .env in the backend directory and add the following variables:

# Your MongoDB connection string



# Your Google Generative AI API Key


# The port for the server to run on
PORT=5000


The React application should now be running and accessible at http://localhost:5173 (or another port specified by Vite).

📖 Usage
New Chat: Start a conversation with BlogBot to generate a blog post from scratch.

View Schedule: See all your scheduled and completed posts. You can filter by status or search by topic.

Refine Content: Paste your own text, provide a title, and let the AI format it professionally. From there, you can either save it to your library or schedule it.

Save to Library: Once a scheduled blog is completed, you can save it to your permanent library for easy access from the sidebar.
