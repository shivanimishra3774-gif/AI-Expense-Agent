# AI Expense Management Agent 🚀

A modern, AI-powered enterprise web application designed to automate the expense verification and approval process. Built with a premium UI tailored for the Indian context (INR currency, GST tracking).

---

## 📖 Project Overview

The **AI Expense Management Agent** acts as an intelligent assistant for finance teams. Employees can upload receipts or invoices, and the agent automatically extracts key details, checks them against company policy, flags anomalies, and recommends an approval action. It also features a real-time analytics dashboard to track spend and visualize category breakdowns.

## ⚠️ Problem Statement

In many organizations, employees submit expense receipts manually for reimbursement. Verifying these receipts is time-consuming, prone to errors, and can lead to duplicate claims or policy violations. Finance teams spend a significant amount of operational time reviewing expenses before approval, leading to delayed reimbursements and potential fraud.

## ✨ Features

- **Automated Receipt Processing**: Upload images/PDFs and extract Vendor, Date, Amount, and Category.
- **Smart Policy Compliance**: Automatically flags expenses that violate company policy (e.g., meals over ₹3,000 or general expenses over ₹10,000).
- **Contextualized for India**: Supports ₹ (INR) formatting, calculates 18% GST approximations, and recognizes major local vendors (IRCTC, Ola, MakeMyTrip, etc.).
- **Approval Workflow Recommendations**: AI suggests whether to *Approve*, *Reject*, or flag for *Manual Review*.
- **Analytics Dashboard**: Interactive charts visualizing spend categories and monthly summaries using Chart.js.
- **Premium Enterprise UI**: A beautiful, responsive frontend featuring a sleek dark mode, glassmorphism effects, and smooth micro-animations.

## 🛠 Tech Stack

**Frontend:**
- HTML5
- CSS3 (Vanilla, Glassmorphism design, CSS Variables)
- JavaScript (Vanilla, Fetch API)
- Chart.js (Data visualization)

**Backend:**
- Python 3
- FastAPI (High-performance API framework)
- Uvicorn (ASGI web server)
- Pandas (Data processing)

---

## 🚀 Installation Steps

Follow these steps to run the project locally on your machine.

### Prerequisites
- Python 3.8+ installed
- Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/shivanimishra3774-gif/AI-Expense-Agent.git
cd AI-Expense-Agent
```

### 2. Setup the Python Backend
Navigate to the backend directory and install the required Python packages.
```bash
cd backend
pip install -r requirements.txt
```

### 3. Start the Backend Server
Run the FastAPI application using Uvicorn.
```bash
uvicorn main:app --reload
```
*The backend server will start running on `http://localhost:8000`.*

### 4. Start the Frontend
Open a new terminal window in the root directory of the project (`AI-Expense-Agent`) and start a local HTTP server:
```bash
python -m http.server 3000
```
*You can now access the application by navigating to `http://localhost:3000` in your web browser.*

---

## 💡 Usage Instructions

1. **Dashboard Overview**: Upon opening the application, view the overall monthly spend, pending approvals, and a list of recent historical expenses.
2. **Upload a Receipt**: Click on "Upload Receipt" in the sidebar.
3. **Simulate AI Extraction**: Drag and drop a receipt image (or PDF) into the upload zone. The simulated AI engine will process the file, extract data, check company policies, and return a result with specific compliance flags.
4. **View Analytics**: Navigate to the "Analytics" tab to see a breakdown of expenses by category (Travel, Meals, Accommodation, etc.) and read AI-generated insights.

---

## 📂 Project Structure

```text
AI-Expense-Agent/
│
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # Main API endpoints and server config
│   ├── ai_engine.py          # AI logic, mock OCR extraction, policy rules
│   └── requirements.txt      # Backend Python dependencies
│
├── index.html                # Main frontend dashboard structure
├── styles.css                # Premium styling and glassmorphism effects
├── app.js                    # Frontend logic and API integration
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

---

## 🔮 Future Enhancements

- **Real OCR Integration**: Connect to the **Google Gemini Vision API** or Tesseract OCR to extract actual text from uploaded receipt images in real-time.
- **Database Integration**: Replace mock memory arrays with SQLite or PostgreSQL to persist user data, historical receipts, and analytics.
- **Authentication**: Add JWT-based user login to separate "Employee View" (uploading) from "Finance Team View" (approving).
- **Duplicate Detection**: Implement image hashing and text matching to automatically detect and reject duplicate invoice submissions.

---

## 📸 Screenshots

*(Add screenshots of your application here after taking them!)*

- **Dashboard View**:  
  `![Dashboard Screenshot](link_to_image)`
- **Upload & AI Analysis**:  
  `![Upload Screenshot](link_to_image)`
- **Analytics View**:  
  `![Analytics Screenshot](link_to_image)`

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it.
