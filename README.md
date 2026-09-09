# FindIt

### A Smart Lost & Found Platform for Students

FindIt is a full-stack Lost & Found web application designed to make it easier for students to report, discover, claim, and recover lost belongings.

Losing an item on a college campus often means relying on WhatsApp groups, asking around, or hoping that someone posts about it. FindIt brings the entire process into one platform where users can report lost or found items, browse listings, submit claims, receive notifications, and manage their activity.

The project was built as a hands-on learning experience to move beyond tutorials and understand what it actually takes to build, connect, debug, and deploy a complete full-stack application.

---

## Live Demo

**Live Website:**
https://findit-recover.vercel.app/

**GitHub Repository:**
https://github.com/shoum217-cpu/lost-and-found

---

# Table of Contents

* [About the Project](#about-the-project)
* [Problem Statement](#problem-statement)
* [Features](#features)
* [Authentication](#authentication)
* [Item Management](#item-management)
* [Claim System](#claim-system)
* [Notifications](#notifications)
* [AI Features](#ai-features)
* [Location Features](#location-features)
* [Tech Stack](#tech-stack)
* [Project Architecture](#project-architecture)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Running the Project](#running-the-project)
* [Deployment](#deployment)
* [My Contribution](#my-contribution)
* [Collaboration](#collaboration)
* [Challenges](#challenges)
* [What We Learned](#what-we-learned)
* [Future Improvements](#future-improvements)

---

# About the Project

FindIt is a centralized Lost & Found platform built for students.

The application allows users to report items they have lost or found and makes those listings accessible to other users through a simple web interface.

Instead of information being scattered across different messaging groups or social media posts, FindIt provides a dedicated platform for managing lost and found items.

The project includes both frontend and backend functionality, allowing users to interact with a complete system rather than just a static interface.

Some of the core functionality includes:

* User registration and login
* Google Authentication
* Secure authentication using JWT
* Reporting lost items
* Reporting found items
* Browsing item listings
* Viewing item details
* Uploading item images
* Claiming items
* Claim-related notifications
* User dashboard
* Location-based functionality
* AI-powered features
* Item management
* Backend API integration

FindIt is fully deployed and accessible online.

---

# Problem Statement

Lost items are a common problem on college campuses.

Students often lose items such as:

* ID cards
* Wallets
* Earphones
* Keys
* Chargers
* Bags
* Books
* Electronic devices
* Personal belongings

When an item is lost, students usually depend on:

* WhatsApp groups
* Friends
* Social media posts
* Asking around campus
* Physical Lost & Found offices

This process can be inefficient because information is scattered and difficult to search.

FindIt aims to provide a centralized platform where students can:

1. Report a lost item.
2. Report an item they have found.
3. Browse existing listings.
4. View detailed information.
5. Submit claims for items.
6. Receive updates regarding their activity.

The goal is simple:

> Make the process of finding and returning lost belongings easier and more organized.

---

# Features

## User Authentication

FindIt includes a complete authentication system.

Users can:

* Create an account
* Log in using email and password
* Sign in using Google
* Access protected functionality
* Maintain authenticated sessions
* Securely interact with the application

Authentication is used to ensure that important actions such as reporting items and managing claims are associated with users.

The authentication system uses secure practices such as:

* Password hashing
* JWT-based authentication
* Protected routes
* Authentication middleware
* User verification

---

# Google Authentication

FindIt supports Google Sign-In to make the login experience faster and more convenient.

Users can authenticate using their Google account instead of manually creating and managing credentials.

Google Authentication was integrated alongside the traditional authentication system.

This allows the application to support multiple ways for users to access the platform.

---

# Item Management

The core functionality of FindIt revolves around managing Lost and Found listings.

Users can report items that they have:

* Lost
* Found

Each listing can contain relevant information that helps other users identify the item.

Depending on the item, this may include:

* Item name
* Description
* Category
* Location
* Images
* Additional details

Users can browse available listings and view individual item details.

---

## Lost Items

When a user loses an item, they can create a Lost Item report.

The report helps other users identify the item and provides relevant information about where or when it was lost.

---

## Found Items

When a user finds an item, they can create a Found Item report.

Other users who believe the item belongs to them can view the listing and take the appropriate action to claim it.

---

## Item Details

Users can view detailed information about individual items.

This provides more context than simply viewing an item in a list.

The item details page helps users determine whether a particular listing matches the item they lost or found.

---

## Delete Item

Users can manage their listings and remove items that are no longer relevant.

For example, an item can be removed when:

* The owner has recovered it
* The item is no longer available
* The listing was created accidentally
* The user no longer wants the listing to remain active

This helps keep the platform clean and relevant.

---

# Image Uploads

FindIt supports image uploads for Lost and Found listings.

Images can make it significantly easier to identify an item.

For example, instead of describing a backpack only through text, a user can upload an image that helps other users immediately recognize it.

Image functionality improves:

* Item identification
* Listing quality
* User experience
* Claim accuracy

---

# Claim System

FindIt includes functionality that allows users to claim items.

When a user finds an item listed on the platform that they believe belongs to them, they can submit a claim.

The claim system helps connect users who have lost an item with users who have found it.

The functionality includes:

* Submitting claims
* Receiving claim requests
* Managing claim activity
* Viewing claim-related information

This creates a more structured recovery process compared to simply posting messages in a group.

---

# Notifications

FindIt includes notification functionality for important activity.

Users can receive updates related to actions such as:

* Claim activity
* Claim requests
* Updates related to their items

Notifications help users stay informed without constantly checking every listing manually.

---

# User Dashboard

The dashboard provides users with a central place to manage their activity.

Users can view information related to:

* Their Lost Item reports
* Their Found Item reports
* Claim activity
* Notifications
* Account-related actions

The dashboard brings important user activity together in one place.

---

# AI Features

FindIt integrates AI-powered functionality using the Google Gemini API.

AI was included as part of the project to explore how modern AI services can be integrated into a real-world web application.

The Gemini API provides AI capabilities that can enhance the Lost & Found experience and demonstrates how external AI services can be connected to a full-stack application.

The integration involved:

* Connecting the application to the Gemini API
* Handling API requests
* Managing API responses
* Integrating AI functionality with the application

---

# Location Features

Location can play an important role when searching for lost items.

FindIt includes location-based functionality to provide additional context about where an item was lost or found.

Interactive maps are implemented using Leaflet.

This allows location information to be presented in a more visual and useful way.

---

# Tech Stack

FindIt was built using modern web technologies.

| Layer                 | Technology        |
| --------------------- | ----------------- |
| Frontend              | React             |
| Build Tool            | Vite              |
| Styling               | Tailwind CSS      |
| Routing               | React Router      |
| Icons                 | Lucide React      |
| Backend               | Node.js           |
| Server Framework      | Express.js        |
| Database              | MongoDB           |
| ODM                   | Mongoose          |
| Authentication        | JWT               |
| Password Security     | Bcrypt / Bcryptjs |
| Google Authentication | Google OAuth      |
| AI                    | Google Gemini API |
| Maps                  | Leaflet           |
| React Maps            | React Leaflet     |
| Deployment            | Vercel            |

---

# Project Architecture

FindIt follows a client-server architecture.

```text id="zixsqz"
                        USER
                          │
                          ▼
                   ┌─────────────┐
                   │  FRONTEND   │
                   │    React    │
                   │    Vite     │
                   └──────┬──────┘
                          │
                          │ API Requests
                          ▼
                   ┌─────────────┐
                   │   BACKEND   │
                   │ Node.js     │
                   │ Express.js  │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   MongoDB   │
                   │  Database   │
                   └─────────────┘
```

The frontend is responsible for:

* User interface
* Pages
* Components
* User interactions
* API communication

The backend is responsible for:

* API endpoints
* Authentication
* Authorization
* Database operations
* Business logic
* Item management
* Claim functionality
* Notifications

MongoDB is responsible for storing application data.

---

# Project Structure

The project is organized into separate frontend and backend directories.

```text id="hl50a5"
FindIt/
│
├── Frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   └── Reusable UI components
│   │   │
│   │   ├── pages/
│   │   │   └── Application pages
│   │   │
│   │   ├── services/
│   │   │   └── API communication
│   │   │
│   │   ├── assets/
│   │   │   └── Images and static assets
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
│
├── Backend/
│   │
│   ├── config/
│   │   └── Database configuration
│   │
│   ├── controllers/
│   │   └── Application logic
│   │
│   ├── middleware/
│   │   └── Authentication and custom middleware
│   │
│   ├── models/
│   │   └── MongoDB schemas
│   │
│   ├── routes/
│   │   └── API routes
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# Backend Architecture

The backend follows a structured approach to keep the application organized.

## Config

The `config` directory handles configuration such as database connections.

Example:

```text id="vtm5qn"
config/
└── db.js
```

---

## Models

Models define how data is structured in MongoDB.

Examples may include:

* User
* Item
* Claim
* Notification

Mongoose is used to define schemas and interact with MongoDB.

---

## Controllers

Controllers contain the main application logic.

They handle operations such as:

* Creating items
* Fetching items
* Updating items
* Deleting items
* User registration
* User login
* Authentication
* Claims
* Notifications

---

## Routes

Routes define the API endpoints used by the application.

The frontend communicates with the backend through these routes.

---

## Middleware

Middleware handles operations that occur between incoming requests and the final controller logic.

Examples include:

* Authentication
* Token verification
* Request validation
* Error handling

---

# Getting Started

Follow these steps to run FindIt locally.

---

## 1. Clone the Repository

```bash id="fkvqrv"
git clone https://github.com/shoum217-cpu/lost-and-found.git
```

Navigate to the project directory:

```bash id="avqvse"
cd lost-and-found
```

---

## 2. Install Frontend Dependencies

Navigate to the frontend directory:

```bash id="vgr3vn"
cd Frontend
```

Install dependencies:

```bash id="zw4hgo"
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal and navigate to the backend directory:

```bash id="r4uvky"
cd Backend
```

Install dependencies:

```bash id="6d6l2r"
npm install
```

---

# Environment Variables

Environment variables are used to store sensitive configuration information.

Create a `.env` file inside the Backend directory.

Example:

```env id="3gw2x9"
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Depending on your Google Authentication and deployment setup, additional environment variables may be required.

For example:

```env id="efnmzt"
GOOGLE_CLIENT_ID=your_google_client_id
```

The frontend may also require environment variables for services configured using Vite.

Example:

```env id="kskmnk"
VITE_API_URL=your_backend_api_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Never upload sensitive environment variables to GitHub.

Make sure your `.env` file is included in `.gitignore`.

---

# Running the Project

## Start the Backend

Navigate to the Backend directory:

```bash id="uovpvy"
cd Backend
```

Run:

```bash id="ic6erf"
npm run dev
```

The backend should start on the configured port.

Example:

```text id="c9g94d"
Server running on port 5000
MongoDB Connected
```

---

## Start the Frontend

Open another terminal.

Navigate to the Frontend directory:

```bash id="a8xh0s"
cd Frontend
```

Run:

```bash id="wbmylx"
npm run dev
```

Vite will provide a local URL.

Open the displayed URL in your browser.

---

# API Communication

The frontend communicates with the backend using API requests.

The general flow looks like this:

```text id="zb1cz2"
User Action
    │
    ▼
Frontend
    │
    ▼
API Request
    │
    ▼
Express Backend
    │
    ▼
Controller
    │
    ▼
MongoDB
    │
    ▼
API Response
    │
    ▼
Frontend Update
```

This structure allows the frontend and backend to operate independently while communicating through defined APIs.

---

# Authentication Flow

FindIt uses secure authentication to protect user functionality.

The general authentication flow is:

```text id="b3agwv"
User
 │
 ▼
Login / Register
 │
 ▼
Backend
 │
 ▼
Verify Credentials
 │
 ▼
Generate JWT
 │
 ▼
Send Token
 │
 ▼
Authenticated User
```

For protected actions:

```text id="0zdhsv"
User Request
     │
     ▼
JWT Token
     │
     ▼
Authentication Middleware
     │
     ▼
Verify Token
     │
     ▼
Allow Access
```

---

# Deployment

FindIt is deployed and publicly accessible.

## Live Application

https://findit-recover.vercel.app/

The project deployment involved configuring the application for production and ensuring that the frontend could communicate correctly with the backend services.

Deployment also required handling configuration such as:

* Environment variables
* Production URLs
* API URLs
* Authentication configuration
* External service integration

---

# My Contribution

### Shoumil Mandal

I primarily focused on the backend and the core functionality of FindIt.

My work included:

## Backend Development

* Setting up the Node.js backend
* Building the Express server
* Creating API endpoints
* Structuring controllers and routes
* Implementing backend logic
* Connecting frontend and backend

---

## Database Integration

* Setting up MongoDB
* Configuring database connections
* Creating Mongoose models
* Managing application data
* Debugging database issues
* Working with MongoDB Atlas for deployment

---

## Authentication

* User registration
* User login
* Password hashing
* Bcrypt integration
* JWT implementation
* Authentication middleware
* Protected routes
* Google Authentication integration

Authentication was one of the major areas I worked on while developing the project.

---

## Core Functionality

I also worked on implementing and integrating functionality such as:

* Item APIs
* Claim functionality
* Notification functionality
* Backend logic
* API integration
* Data handling
* Error handling
* Debugging

---

## Deployment & Debugging

I worked on resolving issues related to:

* Backend configuration
* Environment variables
* Database connections
* API communication
* Authentication
* Deployment
* Git branches
* Merge conflicts
* Dependency conflicts

A significant part of building the project involved debugging issues that don't usually appear while following tutorials.

---

# Collaboration

FindIt was built collaboratively.

The project was divided based on the areas we wanted to explore and build.

## Backend & Core Functionality

Handled primarily by:

**Shoumil Mandal**

Responsibilities included:

* Backend development
* Database integration
* Authentication
* Google Sign-In
* APIs
* Claims
* Notifications
* Core application functionality
* Backend debugging
* Deployment integration

---

## Frontend & User Experience

The frontend was developed collaboratively with a focus on:

* User interface
* Components
* Pages
* Layouts
* Responsive design
* User experience
* Frontend functionality

The project required continuous collaboration because frontend and backend systems needed to work together.

---

# Challenges

Building FindIt involved several challenges.

Some of the major challenges included:

## Connecting Frontend and Backend

A frontend interface alone is not enough.

The application needed to communicate with the backend correctly.

This involved:

* API URLs
* HTTP requests
* Responses
* Error handling
* Data formats
* CORS configuration

---

## Authentication

Authentication required multiple components to work together correctly.

These included:

* User registration
* Login
* Password hashing
* JWT generation
* Token verification
* Protected routes
* Google Authentication

A small issue in any part of the authentication flow could prevent users from accessing the application correctly.

---

## Database Configuration

Database issues included:

* Connection strings
* Environment variables
* Local database setup
* MongoDB Atlas
* Data persistence
* Schema design

---

## Git Collaboration

Since multiple developers worked on the project, Git collaboration was also an important part of development.

Challenges included:

* Multiple branches
* Fetching remote changes
* Comparing branches
* Merge conflicts
* Selectively bringing frontend changes
* Maintaining working backend functionality

This was one of the most practical learning experiences during the project.

---

## Deployment

Deploying a project introduces challenges that often do not appear during local development.

Some of these included:

* Environment variables
* Production URLs
* API configuration
* Database access
* Authentication configuration
* Deployment errors

Getting the application from a local machine to a publicly accessible website required additional debugging and configuration.

---

# What We Learned

FindIt taught us much more than simply writing code.

## Full-Stack Development

We learned how different parts of an application connect together.

Including:

```text id="sdo9z5"
Frontend
   ↓
API
   ↓
Backend
   ↓
Database
```

---

## Authentication

We gained practical experience with:

* JWT
* Password hashing
* Protected routes
* Authentication middleware
* Google Authentication

---

## Database Development

We learned how to:

* Connect MongoDB
* Design schemas
* Store data
* Retrieve data
* Update data
* Delete data

---

## APIs

We gained experience with:

* Creating APIs
* Consuming APIs
* API integration
* Request handling
* Response handling
* Error handling

---

## External Services

FindIt involved working with external services such as:

* Google Authentication
* Gemini API
* MongoDB Atlas
* Map services

---

## Deployment

We learned about:

* Production environments
* Environment variables
* Deployment configuration
* Public URLs
* Production debugging

---

## Git Collaboration

Working on the project collaboratively gave us practical experience with:

* Branches
* Remote repositories
* Fetching
* Comparing changes
* Merging
* Resolving conflicts
* Selective file integration

---

# Future Improvements

FindIt can be expanded further with additional functionality.

Some possible improvements include:

## AI-Based Item Matching

Use AI to automatically compare:

* Lost item descriptions
* Found item descriptions
* Images
* Categories

This could help automatically suggest possible matches.

---

## Advanced Search

Improve search functionality with:

* Categories
* Locations
* Dates
* Keywords
* Item status

---

## Real-Time Notifications

Add real-time notifications using technologies such as:

* Socket.io
* WebSockets

This would allow users to receive updates instantly.

---

## Better Claim Verification

Improve the claim system by allowing users to provide additional information to verify ownership.

For example:

* Unique identifying details
* Description verification
* Images
* Additional questions

---

## Item Status

Add clearer item statuses such as:

* Lost
* Found
* Claimed
* Returned
* Resolved

---

## Campus Integration

Future versions could potentially integrate with:

* College student systems
* Campus email authentication
* University Lost & Found departments

---

## Mobile Application

A dedicated mobile application could make FindIt more accessible and convenient for students.

---

# Contributors

## Shoumil Mandal

**Backend & Core Functionality**

* Backend Development
* Database Integration
* Authentication
* Google Authentication
* APIs
* JWT
* Claims
* Notifications
* Backend Integration
* Debugging

GitHub: https://github.com/shoum217-cpu

---

## Frontend Contributor

**Frontend & User Experience**

* UI Development
* Components
* Pages
* Layouts
* Frontend Integration
* User Experience

---

# Project Status

**Status: Completed and Deployed**

FindIt is a completed full-stack project built as a hands-on learning experience.

The project evolved from a simple idea into a complete application involving:

* Frontend development
* Backend development
* Database integration
* Authentication
* Google Sign-In
* APIs
* AI integration
* Image functionality
* Claims
* Notifications
* Maps
* Deployment

---

# Final Thoughts

FindIt started with a simple question:

**What if students had one place to report and find lost belongings?**

The project began as a way to gain practical experience with technologies we were learning.

Instead of only watching tutorials, we decided to build something real.

That decision introduced us to much more than just writing code.

We dealt with:

* Bugs
* Failed API requests
* Authentication issues
* Database problems
* Git conflicts
* Dependency errors
* Deployment failures
* Configuration problems

But solving those problems was where most of the learning happened.

FindIt may have started as a simple idea, but turning that idea into a fully functional and deployed application was the real achievement.

---

## Try FindIt

**Live Website:**
https://findit-recover.vercel.app/

**GitHub Repository:**
https://github.com/shoum217-cpu/lost-and-found

---

Built with curiosity, collaboration, debugging, and a lot of trial and error.
