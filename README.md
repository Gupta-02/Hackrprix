# 🎙️ Auralis AI

> **Build intelligent voice agents that listen, understand, and respond naturally in real time.**

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-blue)
![Sarvam AI](https://img.shields.io/badge/STT-Sarvam%20AI-orange)
![ElevenLabs](https://img.shields.io/badge/TTS-ElevenLabs-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Overview

Auralis AI is a next-generation voice AI platform that enables users to create, customize, and deploy intelligent conversational voice agents.

Powered by **Google Gemini**, **Sarvam AI**, and **ElevenLabs**, Auralis provides natural voice interactions through real-time speech recognition, contextual reasoning, and expressive speech synthesis.

Whether you're building customer support assistants, personal AI companions, educational tutors, or business automation agents, Auralis AI delivers a seamless voice-first experience.


<img width="1890" height="827" alt="image" src="https://github.com/user-attachments/assets/21c16766-220f-47b2-bc20-94cd15c5ac7a" />


---

## ✨ Features

### 🎤 Real-Time Voice Conversations

* Speech-to-text using Sarvam AI
* Low-latency voice processing
* Continuous conversation flow
* Multi-language speech support

<img width="1872" height="715" alt="image" src="https://github.com/user-attachments/assets/5e08dc8b-264e-4cbe-af4f-6c6f1ddcf276" />



### 🧠 AI-Powered Intelligence

* Google Gemini integration
* Context-aware responses
* Conversation memory
* Dynamic prompt engineering



### 🤖 Custom Voice Agents

* Create personalized AI assistants
* Custom personalities and instructions
* Multiple agent configurations
* Specialized use-case agents

### 🔊 Natural Voice Synthesis

* ElevenLabs voice generation
* High-quality neural voices
* Human-like speech delivery
* Configurable voice settings

<img width="1652" height="817" alt="image" src="https://github.com/user-attachments/assets/fcf59010-260d-4780-8206-021ede906e9f" />


### 📊 Analytics Dashboard

* Conversation tracking
* Agent performance metrics
* Usage insights
* Interaction statistics

<img width="1702" height="696" alt="image" src="https://github.com/user-attachments/assets/000c5c6d-b1c7-4ec8-8e1a-b2e0e3eaab9a" />

### 🔐 Secure & Scalable

* Authentication support
* Protected API routes
* Environment-based secrets
* Production-ready architecture

---

# 🏗️ Architecture

User Speech
↓
Sarvam AI (Speech-to-Text)
↓
Google Gemini (Reasoning Engine)
↓
Generated Response
↓
ElevenLabs (Text-to-Speech)
↓
Audio Playback

---

## 🛠️ Tech Stack

### Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Radix UI
* Lucide React

### AI & Voice

* Google Gemini
* Sarvam AI
* ElevenLabs

### Backend

* Next.js API Routes
* Axios
* Server Actions

### Storage & State

* PostgreSQL
* Supabase
* React Context
* Local Storage

### Authentication

* NextAuth.js
* Google OAuth

---

## 📂 Project Structure

```bash
Auralis-AI/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── agents/
│   └── settings/
│
├── components/
│
├── hooks/
│
├── lib/
│
├── public/
│
├── styles/
│
├── prisma/
│
└── types/
```

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/Pravehaspa/AURALIS-AI.git

cd AURALIS-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create:

```bash
.env.local
```

Add:

```env
# Gemini
GEMINI_API_KEY=

# Sarvam AI
SARVAM_API_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:

```bash
http://localhost:3000
```

## 🔌 API Endpoints

### Agents

```http
GET    /api/agents
POST   /api/agents
PUT    /api/agents/:id
DELETE /api/agents/:id
```

### Conversations

```http
POST /api/chat
POST /api/generate-response
```

### Voice

```http
POST /api/speech-to-text
POST /api/text-to-speech
GET  /api/voices
```

### Analytics

```http
GET /api/analytics
```

### System

```http
GET /api/health
```

## 🎯 Use Cases

### Customer Support Agent

Provide instant voice support for users.

### AI Tutor

Interactive educational assistant with natural conversations.

### Interview Preparation

Practice technical and behavioral interviews.

### Personal Assistant

Task management and daily productivity support.

### Business Automation

Voice-enabled workflows and operations.

---

## 📈 Performance Highlights

* Real-time speech processing
* Fast Gemini response generation
* Low-latency voice playback
* Scalable serverless architecture
* Optimized Next.js rendering

---

## 🔒 Security

* OAuth Authentication
* Protected API Routes
* Secure Secret Management
* Input Validation
* Rate Limiting Support

---

## 🧪 Testing

```bash
npm run test
```

```bash
npm run test:watch
```

```bash
npm run test:coverage
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Configure environment variables and deploy directly from GitHub.

### Alternative Platforms

* Railway
* AWS
* Render
* Netlify

---

## 🤝 Contributing

```bash
# Fork Repository

# Create Branch
git checkout -b feature/amazing-feature

# Commit Changes
git commit -m "Add amazing feature"

# Push Branch
git push origin feature/amazing-feature
```

Create a Pull Request and describe your changes.



## 📜 License

Licensed under the MIT License.

---

