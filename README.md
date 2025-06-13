# 9jaschoolhubBackend

## 1. Description

9jaSchoolsHub is a platform that aims to centralize information about Nigerian universities in one accessible directory. The goal is to help users easily access up-to-date details about institutions, courses, admission requirements, and other key data relevant to prospective students and academic stakeholders. The platform will help bridge gaps in the accessibility of university-related information and provide users with a user-friendly interface for searching and comparing schools.

## 2. Features

- **UNIVERSITIES MANAGEMENT**: Users can create and manage Universities.
- **Security**: Implements security best practices like rate limiting, helmet for HTTP headers, and data sanitization.

## 3. Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using Mongoose for schema modeling)
- **Authentication**: API keys
- **Testing**: Postman for API testing
- **Version Control**: Git, GitHub for version control
- **Deployment**: Render for deployment; MongoDB Atlas for the cloud database

## 4. Getting Started

### 4.1 Prerequisites

- [Node.js](https://nodejs.org/) - Ensure you have Node.js installed on your system.
- [MongoDB](https://www.mongodb.com/) - You need a MongoDB instance for your database.

### 4.2 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/arnite/9jaschoolhubBackend.git
   cd 9jaschoolhubBackend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL
PORT
NODE_ENV
API_KEYS
```

4. Run the server:

   ```bash
   npm start
   ```

The server will run on the following URL depending on the environment:

- **Local (development)**: `http://localhost:3000`
- **Production (live server)**: The server URL will be defined based on your environment configuration.

## 5. API Endpoints

### **UNIVERSITIES MANAGEMENT**

- **GET `/universityRoute`**
  _Retrieve all University_

- **POST `/universityRoute`**
  _Create University_

- **PATCH `/universityRoute/:id**
  _Update University by id_

- **DELETE `/universityRoute/:id**
  _Delete University by id_

## 6. API Documentation

You can find the Postman collection for this API [here](https://documenter.getpostman.com/view/37611500/2sB2x6mXd8)

### How to Use the Postman Collection:

1. Click on the link to open the Postman collection.
2. Import the collection into your Postman app.
3. Set up any required environment variables or authentication tokens.
4. Run the requests to interact with the API.

This collection includes all the available endpoints for the API and their respective methods, parameters, and expected responses.

## 7. Deployed App
You can view the deplyed app here.