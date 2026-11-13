# 🏥 Hospital IVR Management System

A full-stack Hospital IVR (Interactive Voice Response) Management System that helps hospitals automate patient interactions through phone calls while providing an admin dashboard to manage hospital operations.

The system is being developed using **React.js, Node.js, Express.js, MongoDB, and Twilio**.

---

## 📌 About the Project

The Hospital IVR Management System allows patients to interact with a hospital through an automated phone-based menu.

Patients can use their phone keypad to navigate different services, while administrators can manage doctors, departments, patients, appointments, call records, billing, lab reports, and IVR configurations through a web-based dashboard.

The project aims to reduce manual call handling, improve patient accessibility, and simplify hospital administration.

## ✨ Key Features

### Patient IVR System
- Automated incoming call handling using Twilio.
- Hindi and English language selection.
- Interactive keypad-based menu (DTMF).
- Appointment booking and management.
- Existing appointment assistance.
- Department and emergency assistance.
- Billing and lab report information.
- Customer care support.

### Admin Dashboard
- Admin authentication.
- Dashboard with hospital statistics.
- Doctor management.
- Department management.
- Patient management.
- Appointment management.
- Call logs and call session tracking.
- Billing management.
- Lab report management.
- Patient feedback management.
- IVR configuration.

### Communication
- Twilio voice integration.
- Automated appointment confirmation SMS.
- Appointment cancellation notifications.
- Appointment rescheduling notifications.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| JavaScript | Application programming |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | Database modeling |
| Axios | API communication |
| React Router | Frontend navigation |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Twilio | Voice calls and SMS |
| TwiML | Voice call instructions |

## 🏗️ Project Structure

```text
HOSPITAL-IVR-SYSTEM/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhav0076/HOSPITAL-IVR-SYSTEM.git
```

Navigate to the project directory:

```bash
cd HOSPITAL-IVR-SYSTEM
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder and configure:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

Start the backend server:

```bash
npm run dev
```

The backend server will run at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## ☎️ IVR Menu Structure

The planned patient-facing IVR menu includes:

| Key | Option |
|---|---|
| 1 | Book Appointment |
| 2 | Existing Appointment |
| 3 | Talk to Department |
| 4 | Emergency |
| 5 | Billing |
| 6 | Lab Reports |
| 7 | Customer Care |
| 8 | Repeat Menu |
| 9 | End Call |

Patients can select their preferred language:
- Press 1 for Hindi.
- Press 2 for English.

## 🔐 Environment Variables

Sensitive credentials must be stored in environment files and must never be committed to GitHub.

Required backend variables:

- `PORT` – Backend server port.
- `MONGO_URI` – MongoDB connection string.
- `JWT_SECRET` – Secret used for JWT authentication.
- `CLIENT_URL` – Frontend application URL.
- `TWILIO_ACCOUNT_SID` – Twilio account SID.
- `TWILIO_AUTH_TOKEN` – Twilio authentication token.
- `TWILIO_PHONE_NUMBER` – Twilio phone number.

Required frontend variable:

- `VITE_API_URL` – Backend API base URL.

**Never publish your actual `.env` files, database passwords, JWT secrets, or Twilio credentials.**

## 🚧 Development Status

This project is currently under development.

The backend foundation, database models, API controllers, frontend pages, and initial Twilio integration have been created.

The remaining work includes completing all IVR workflows, connecting and testing the frontend with backend APIs, configuring Twilio webhooks, and performing end-to-end testing.

## 🎯 Project Goal

To develop a smart and accessible hospital communication system that automates routine patient interactions, simplifies appointment management, and improves hospital operational efficiency.

## 👨‍💻 Author

**Vaibhav Kumar Raghuvanshi**

GitHub: [@vaibhav0076](https://github.com/vaibhav0076)

Project Repository: [HOSPITAL-IVR-SYSTEM](https://github.com/vaibhav0076/HOSPITAL-IVR-SYSTEM)

---

⭐ If you find this project interesting, consider giving the repository a star!
