# DocReminder 📄
**Track, organize, and never miss a document expiry**
A family-friendly PWA to manage document expiration dates, share them across a family group, and receive email reminders before they expire.

## ✨ Key Features

### Document Tracking
- Add documents with **expiry dates** and receive alerts before they expire
- Organize documents by **category/type**
- Dashboard overview of **upcoming and expired documents**

### Family Group Management
- Create or join a **family group** to share documents
- Multiple users can manage the **same document pool**

### Notifications
- Automatic **email reminders** via SendGrid before documents expire
- Mobile-native UX with **haptic feedback** and **Badging API**

### Security & System
- Full user **authentication** (register, login, JWT-based sessions)
- Separate **access and refresh tokens** for secure session handling

## 🛠️ Tech Stack

| Layer       | Main Technologies                        |
|-------------|------------------------------------------|
| Frontend    | React • Material-UI (MUI) • Vite         |
| Backend     | Node.js • Express • MySQL                |
| Email       | Resend                                   |
| Auth        | JWT (access + refresh tokens)            |
| Other       | dotenv, bcrypt                           |

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js ≥ 18
- MySQL 8+
- Accounts & API keys: SendGrid

```bash
# 1. Clone the repo
git clone https://github.com/FGiannini95/DocReminder.git
cd docreminder

# 2. Backend
cd server
npm install
cp .env.example .env          # Fill in your values (see below)
npm run dev

# 3. Frontend
cd client
npm install
npm run dev
```

### Environment Variables (`server/.env`)

```env
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
DB_PORT=
SECRET=
PORT=
CLIENT_URL=
RESEND_API_KEY=
RESEND_FROM=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
FRONTEND_URL=
BACKEND_URL=
NODE_ENV=
```

## 🚀 Quick Start (Production)
- Visit the web => https://docreminders.es/
