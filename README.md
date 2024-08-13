# 📚 BookHive 📚
![BookHive](https://res.cloudinary.com/dnizoc474/image/upload/v1723538181/book-covers/Screenshot_from_2024-08-13_17-34-01_ad7pn2.png)

Welcome to BookHive! This is a full-stack application built for book lovers. It's designed to help you manage books, explore different categories, rent books, and much more.

## 🚀 Features

- 📖 **Manage Books**: Create, update, and delete books with ease.
- 🏷️ **Categories**: Organize books by categories.
- 👥 **User Roles**: Support for different user roles (Admin, Owner, User).
- 💰 **Rental System**: Rent books and manage rentals.
- 🖼️ **Cover Images**: Upload beautiful cover images for books.
- 👤 **User Management**: Register, login, and manage user profiles.

## 🛠️ Built With

- [React](https://reactjs.org/) - For building user interface
- [TypeScript](https://www.typescriptlang.org/) - For type checking
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Backend framework
- [Prisma](https://www.prisma.io/) - ORM for database management
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Containerization

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm or yarn
- PostgreSQL
- Docker (for containerized deployment)

### Installation

1. **Clone the repository**:

```sh
git clone https://github.com/Abenu10/BookHive.git

```
2.  **Install the dependencies:**:

```sh
cd BookHive
cd server
yarn install
cd ../client
yarn install
```

3. **Set up environment variables**:

Create a `.env` file in the server directory and add necessary environment variables, including `DATABASE_URL`.



4. **Start the backend server:**:

```sh
cd server
yarn start
```
The server should now be running at http://localhost:8001.

5. **Start the frontend server:**

```sh
cd client
yarn run dev
```
The application should now be running at http://localhost:5173.

## 🐳 Docker Deployment

This application is set up to run in Docker containers. Here's how you can get started:

### Prerequisites

- Docker
- Docker Compose

1.  **Building the Docker Image:**

To build the Docker image for the backend service, run the following command:

```sh
docker build -t bookhive-backend:latest ./server
```

## 🐳 You can also pull the Docker image from Docker Hub: 🐳

```sh
docker pull abenu/bookhive-backend
```

## 🚀 CI/CD

This project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/main.yml`.


## 📁 Project Structure

- `server/`: Contains the backend Node.js application
  - `src/`: Source code for the server
    - `controllers/`: Contains controller logic
    - `routes/`: Defines API routes
  - `prisma/`: Prisma ORM configuration and migrations
  - `Dockerfile`: Defines the Docker image for the backend


