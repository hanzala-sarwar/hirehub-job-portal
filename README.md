 # 🚀 HireHub – Full Stack Job Portal

HireHub is a **modern full-stack job portal platform** built with Next.js where **users can search and apply for jobs**, while **admins manage companies, post jobs, and review applications**.

The platform provides a smooth workflow for job seekers and recruiters by supporting **resume uploads, company management, and application approval**.

---

# 📌 Project Overview

HireHub connects **job seekers** with **companies** through an easy-to-use recruitment platform.

The application includes:

* User authentication and profile management
* Resume and profile image uploads
* Job search and applications
* Admin job and company management
* Application approval or rejection

This project demonstrates **modern full-stack development using Next.js, Redux, MongoDB, and Cloudinary**.

---

# ✨ Features

## 👤 User Features

* User registration and login
* Upload profile photo
* Upload resume
* Search jobs by title or keyword
* Browse available jobs
* View detailed job descriptions
* Apply for jobs
* Track job applications

---

## 🧑‍💼 Admin Features

* Register companies
* Manage company listings
* Post jobs under registered companies
* View job applicants
* Accept or reject job applications
* View uploaded resumes

---

# 🧰 Tech Stack

## Frontend

* Next.js (App Router)
* React
* Tailwind CSS
* Redux Toolkit

## Backend

* Next.js API Routes

## Database

* MongoDB

## File Uploads

* Cloudinary (for profile images and resumes)

## Authentication

* JWT Authentication

---

# ⚙️ Application Workflow

1️⃣ Admin registers companies
2️⃣ Admin posts jobs under companies
3️⃣ Users create accounts and upload profiles
4️⃣ Users search and browse jobs
5️⃣ Users apply for jobs with their resume
6️⃣ Admin reviews applications
7️⃣ Admin accepts or rejects candidates

---

# 📂 Project Structure

```
hirehub/
│
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── redux/               # Redux store & slices
├── models/              # MongoDB models
├── api/                 # API routes
├── utils/               # Helper functions
├── public/              # Static assets
└── README.md
```

---

# 🛠 Installation

### 1. Clone the repository

```
git clone https://github.com/your-username/hirehub.git
```

### 2. Navigate to the project directory

```
cd hirehub
```

### 3. Install dependencies

```
npm install
```

---

# 🔑 Environment Variables

Create a `.env.local` file in the root directory and add:

```
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# ▶️ Running the Application

Start the development server:

```
npm run dev
```

Open in your browser:

```
http://localhost:3000
```

---

# 🌐 Deployment

The application can be easily deployed using **Vercel**.

Steps:

1. Push the project to GitHub
2. Connect the repository to Vercel
3. Configure environment variables
4. Deploy the project

---

# 📸 Screenshots

Example screenshots you can include:

* Home Page
* Job Search Page
* Job Application Page
* Admin Dashboard
* Company Registration Page

You can add screenshots like this:

```
![Homepage](screenshots/homepage.png)
```

---

# 🔮 Future Improvements

* Email notifications
* Saved jobs feature
* Admin analytics dashboard
* Resume preview inside the platform
* Pagination for job listings

---

# 🤝 Contributing

Contributions are welcome.

Steps to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**hanzala sarwar**

If you like this project, consider giving it a ⭐ on GitHub.
