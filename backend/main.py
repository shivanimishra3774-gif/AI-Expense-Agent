from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ai_engine import process_receipt_mock, get_mock_history, get_mock_analytics, get_settings, update_settings
from pydantic import BaseModel
import uuid

class SettingsUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    auto_approval_limit: int | None = None
    currency: str | None = None


app = FastAPI(title="AI Expense Management Agent API")

# Configure CORS so our local HTML file can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Expense Management API is running"}

@app.post("/api/upload")
async def upload_receipt(file: UploadFile = File(...)):
    """
    Endpoint to receive a receipt image/PDF.
    Uses our AI engine mock to extract data.
    """
    contents = await file.read()
    
    # Process with mock AI
    extracted_data = process_receipt_mock(file.filename, contents)
    
    return {
        "success": True,
        "message": "Receipt processed successfully",
        "expense_id": f"EXP-{str(uuid.uuid4())[:4].upper()}",
        "data": extracted_data
    }

@app.get("/api/expenses")
def get_expenses():
    """
    Returns recent expenses for the dashboard.
    """
    return get_mock_history()

@app.get("/api/analytics")
def get_analytics():
    """
    Returns analytics summary data.
    """
    return get_mock_analytics()

@app.get("/api/settings")
def read_settings():
    """
    Returns the current user settings.
    """
    return get_settings()

@app.post("/api/settings")
def update_settings_api(settings: SettingsUpdate):
    """
    Updates user settings.
    """
    updated = update_settings(settings.dict(exclude_unset=True))
    return {"success": True, "settings": updated}
