# Socializer - MERN Stack

This repository contains the code for a simple social media application (Socializer) built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application allows users to register, log in, create posts with images and descriptions, like posts, and manage their own posts. Authentication is handled using JWT (JSON Web Tokens) for secure user authentication, and authorization ensures that only the original poster can delete or edit their posts.

## Features

1. **User Authentication**

   - Implemented user registration and login functionality using JWT for secure authentication.

2. **Post Creation**

   - Authenticated users can create posts, each including an image and a description.

3. **Post Interaction**

   - Users can like posts created by others, and the number of likes for each post is displayed.

4. **Post Management**
   - Only the user who created a post has the ability to delete it.

## Installation Guide

### Prerequisites

Before you proceed with the installation, make sure you have the following installed on your system:

- Node.js: [Download & Install Node.js](https://nodejs.org/).
- MongoDB: [Download & Install MongoDB](https://www.mongodb.com/try/download/community).

### Clone the Repository

First, clone this repository to your local machine using Git:

```bash
git clone https://github.com/chiragh12/Socializer-app-MERN-stack.git
```

```bash
cd Socializer-app-MERN-stack
```

Open the folder in VS code

Change directory

```bash
cd backend
```

Run this command to install dependencies

```bash
npm install
```

Create a folder config and in backend using the following command

```bash
mkdir config
```

Create a .env file

Enter following credentials according to you

```bash
PORT = 4000
MONO_URI=Your MONO_URI
JWT_SECRET_KEY=Tour JWT_SECRET_KEY
JWT_EXPIRES=5d
COOKIE_EXPIRE=5
FRONTEND_URI=http://localhost:5173/
CLOUDINARY_CLIENT_NAME= Your CLOUDINARY_CLIENT_NAME
CLOUDINARY_CLIENT_API = Your CLOUDINARY_CLIENT_API
CLOUDINARY_CLIENT_SECRET = Your CLOUDINARY_CLIENT_SECRET
```

Change directory

```bash
cd ..
cd client
```

Run this command to install dependencies

```bash
npm install

```

Go to previous directory

```bash
cd ..
cd backend
```

Run this command

```bash
npm run get

```

Copy this and paste it in your browser

```bash
http://localhost:5173/
```

This README provides step-by-step instructions for cloning the repository, setting up the backend and client, and running the application.
