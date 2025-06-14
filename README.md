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

## 4. Live Documentation

You can view and test the API via Postman using the link below:

[Postman Docs (Public Link)](https://documenter.getpostman.com/view/45852787/2sB2x6msLJ)

### How to Use the Postman Collection:

1. Click on the link to open the Postman collection.
2. Import the collection into your Postman app.
3. Set up any required environment variables or authentication tokens.
4. Run the requests to interact with the API.

This collection includes all the available endpoints for the API and their respective methods, parameters, and expected responses.

## 5. Getting Started

### 5.1 Prerequisites

- [Node.js](https://nodejs.org/) - Ensure you have Node.js installed on your system.
- [MongoDB](https://www.mongodb.com/) - You need a MongoDB instance for your database.

### 5.2 Installation

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

## 6. API Endpoints

### **UNIVERSITIES MANAGEMENT**

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| POST   | `/universityModel/`    | Create a new university   |
| GET    | `/universityModel/`    | Get all universities      |
| GET    | `/universityModel/:id` | Get a university by ID    |
| PATCH  | `/universityModel/:id` | Update a university by ID |
| DELETE | `/universityModel/:id` | Delete a university by ID |

> Base URL: `http://localhost:3000/universityModel`

## 7. Sample Request (Create University)

```json
POST /universityModel/

{
  "universityName": "Obafemi Awolowo University",
  "location": "Ile-Ife",
  "type": "Federal",
  "website": "https://oauife.edu.ng",
  "email": "info@oauife.edu.ng",
  "programmes": ["Law", "Computer Science"],
  "requirements": [
    "Minimum JAMB score of 200",
    "5 credits including Math and English"
  ]
}
```

## 8. Rate Limiting

To prevent abuse, the API limits requests to:

* **100 request every 2 hours**
* Returns `429 Too Many Requests` if exceeded

## 9. Deployed App

Not yet deployed.
