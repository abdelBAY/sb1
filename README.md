# BladiShare: Community Donation Platform 🌍🤝

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Backend: Django](https://img.shields.io/badge/Backend-Django-44B78B?logo=django)](https://www.djangoproject.com/)
[![Frontend: React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev/)

A web platform connecting donors, beneficiaries, and managers to facilitate item donations. Built with Django (Backend) and React (Frontend).

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features

### **User Roles**
| Role           | Permissions                              |
|----------------|------------------------------------------|
| Donors         | Create listings, manage donations       |
| Beneficiaries  | Search/claim items, save favorites      |
| Managers       | Moderate content, view analytics        |

### **Core Functionality**
- 🔐 **Secure Authentication**: JWT-based registration/login with role-based access.
- 📦 **Announcements**: 
  - Create listings with photos, videos, category, and condition.
  - Filter by city, map location, or item name.
- 🗺️ **Interactive Map**: Visualize nearby donations (Leaflet/Google Maps).
- 📊 **Dashboard**: Track donation statuses and user activity.

### **Optional Modules**
- 💬 Real-time chat (WebSocket/Sendbird integration).
- 🔔 Notifications (in-app/email/SMS).

---

## 🛠️ Tech Stack

| Layer          | Technology                               |
|----------------|------------------------------------------|
| **Frontend**   | React.js, Redux, Bootstrap               |
| **Backend**    | Django REST Framework, Django ORM        |
| **Database**   | PostgreSQL (with PostGIS for geodata)    |
| **Storage**    | AWS S3 (for media files)                 |
| **Auth**       | JWT Tokens                               |
| **Deployment** | Docker, NGINX, Gunicorn                  |

---

## 🚀 Installation

### **Prerequisites**
- Python 3.10+, Node.js 18+, PostgreSQL, Redis

### **Backend Setup**
```bash
# Clone repo
git clone https://github.com/yourusername/BridgeSphere.git
cd BridgeSphere/backend

# Install dependencies
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
