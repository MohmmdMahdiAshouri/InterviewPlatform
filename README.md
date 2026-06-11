# 🎥 InterviewHub – Live Coding Interview Platform

> Real-time HD video call + instant messaging for remote technical interviews

![MERN](https://img.shields.io/badge/MERN-Stack-green)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime%20Chat-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📌 Table of Contents
- [Overview](#overview)
- [Live Demo & Credentials](#live-demo--credentials)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [Running with Git (Two‑Branch Strategy)](#running-with-git-twobranch-strategy)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🧠 Overview
**InterviewHub** is a full‑stack web application built for **live technical interviews**.  
It combines:
- Peer‑to‑peer **HD video/audio**
- Real‑time **chat messaging** with Socket.io
- **User authentication** (JWT + HTTP‑only cookies)
- **Room management** (create / join interview rooms)

This project demonstrates my ability as a **Junior Full‑Stack Developer** to integrate modern web technologies, manage Git workflows, and write clean, maintainable code – all evaluated during a **live coding interview** session.

## 🎯 Live Demo & Credentials
> _Demo will be available after deployment_  
> **Test credentials:**  
> Email: `demo@interviewhub.com`  
> Password: `demo1234`

## ✨ Key Features

| Module | Capability |
|--------|-------------|
| 🔐 Auth | Signup, login, JWT, protected routes |
| 🎥 Video Call | HD video/audio, mute/unmute, screen sharing (coming soon) |
| 💬 Chat | Real‑time messages, emojis, typing indicators |
| 🚪 Room System | Create room with unique ID, join via link |
| 👥 Participant List | See who’s in the call |
| 📱 Responsive | Works on desktop & tablet (mobile partially) |

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React 18, Tailwind CSS, Socket.io‑client, PeerJS |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Real‑time** | Socket.io (signaling & chat), WebRTC (media) |
| **Auth** | JSON Web Token, bcryptjs |
| **DevOps** | Git (feature branching), GitHub Actions (CI), Render / Vercel |

## 📁 Project Structure
