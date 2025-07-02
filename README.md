# SprintSync


## Application URL
```bash
https://sprintsync-backend.vercel.app
```

A lean, cloud‑ready React web application for SprintSync—an internal tool that lets engineers log work, track time, and lean on AI for quick planning help. This repo serves as a reference for clear frontend development.

## 📦 Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js  
- **Database**: MongoDB (via Mongoose)  
- **Auth**: JWT (Bearer tokens)  
- **Docs**: Swagger UI (OpenAPI 3.0)  
- **Email**: Nodemailer (Gmail SMTP)  
- **Logging**: console (structured JSON)  
- **Containerization**: Docker & docker‑compose  

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/johnabednego/sprintsync-frontend.git
cd sprintsync-frontend
npm install --legacy-peer-deps
```
# Run the npm install command with "--legacy-peer-deps"
# And any other package to be installed newly for  "react": "^19.1.0" and "react-beautiful-dnd": "^13.1.1" conflicts
# In deployment, that command "npm install --legacy-peer-deps" is required to not run into errors.


### 2. Run Locally

```bash
npm run dev
```

Your Application will be available at `http://localhost:5173`.


## 🗒️ Estimates & Time Logging

See [estimates.csv](./estimates.csv) for initial vs. actual hours:

| Task                           | Estimated (h) | Actual (h) |
| ------------------------------ | ------------- | ---------- |
| Initialize React project & directory structure (Vite)
                                 | 0.5           | 0.3        |
| Set up Tailwind CSS (with custom gradient theme) or Styled Components
                                 | 0.6           | 0.3        |
| …                              | …             | …          |
| **Record a short clip demoing the frontend**             
                                 | 0.6           | 0.1        |

This CSV is updated as work progresses—demonstrating realistic estimation and reflection.

## Deployment
**Deploy** on Render / Railway / Fly / AWS / Vercel
   *I deployed on Vercel* 

## 📺 Demo & Video

End‑user demo of the frontend application ( 5 mins)

**Video Link**
```bash
https://drive.google.com/file/d/1sQnnH-9gm6TpsE55hnysSG1XHbyWWS0H/view?usp=sharing
```

## 📞 Questions & Notes

Feel free to raise any questions or suggestions. Enjoy exploring and extending SprintSync!


**SprintSync** · Built with ❤️ for GenAI.Labs Challenge