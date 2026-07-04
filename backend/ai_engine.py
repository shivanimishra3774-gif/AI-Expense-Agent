import random
from datetime import datetime, timedelta

def process_receipt_mock(file_name: str, file_content: bytes):
    """
    Mocks the AI extraction of an Indian expense receipt.
    In a real app, we would use Gemini Vision or Tesseract here.
    """
    
    # Access global settings
    global USER_SETTINGS
    auto_approval_limit = USER_SETTINGS.get("auto_approval_limit", 10000)
    
    # Mock Indian vendors
    vendors = [
        "IRCTC (Indian Railways)", 
        "Ola Cabs", 
        "Uber India", 
        "Taj Hotels", 
        "Starbucks India", 
        "Haldiram's", 
        "Reliance Digital", 
        "Jio",
        "MakeMyTrip"
    ]
    
    categories = ["Travel", "Meals", "Office Supplies", "Internet/Comm", "Accommodation"]
    
    vendor = random.choice(vendors)
    
    # Map vendor to category
    if vendor in ["IRCTC (Indian Railways)", "Ola Cabs", "Uber India", "MakeMyTrip"]:
        category = "Travel"
    elif vendor in ["Taj Hotels"]:
        category = "Accommodation"
    elif vendor in ["Starbucks India", "Haldiram's"]:
        category = "Meals"
    elif vendor in ["Reliance Digital"]:
        category = "Office Supplies"
    else:
        category = "Internet/Comm"
        
    # Generate random amount in INR (between ₹100 and ₹15000)
    base_amount = round(random.uniform(100.0, 15000.0), 2)
    # Add 18% GST typical for many services in India
    gst = round(base_amount * 0.18, 2)
    total_amount = round(base_amount + gst, 2)
    
    # Generate random date within last 30 days
    days_ago = random.randint(0, 30)
    receipt_date = (datetime.now() - timedelta(days=days_ago)).strftime("%d/%m/%Y")
    
    # Policy check logic
    status = "Approved"
    flags = []
    
    if total_amount > auto_approval_limit:
        status = "Manual Review"
        flags.append(f"Amount exceeds ₹{auto_approval_limit} auto-approval limit")
        
    if category == "Meals" and total_amount > 3000:
        status = "Manual Review"
        flags.append("Meal expense unusually high")
        
    return {
        "vendor": vendor,
        "date": receipt_date,
        "amount": total_amount,
        "gst_amount": gst,
        "category": category,
        "status": status,
        "flags": flags,
        "confidence_score": round(random.uniform(0.85, 0.99), 2)
    }

def get_mock_history():
    """Returns a list of mock previous expenses for the dashboard"""
    return [
        {"id": "EXP-1042", "vendor": "Ola Cabs", "date": "02/07/2026", "amount": 450.00, "category": "Travel", "status": "Approved"},
        {"id": "EXP-1041", "vendor": "Taj Hotels", "date": "28/06/2026", "amount": 12500.00, "category": "Accommodation", "status": "Manual Review"},
        {"id": "EXP-1040", "vendor": "Starbucks India", "date": "25/06/2026", "amount": 850.50, "category": "Meals", "status": "Approved"},
        {"id": "EXP-1039", "vendor": "Jio", "date": "15/06/2026", "amount": 1499.00, "category": "Internet/Comm", "status": "Approved"},
    ]

def get_mock_analytics():
    """Returns mock analytics data for charts"""
    return {
        "monthly_spend": 24500.50,
        "pending_approval": 12500.00,
        "rejected": 0.00,
        "categories_breakdown": {
            "Travel": 4500.00,
            "Accommodation": 15000.00,
            "Meals": 3500.50,
            "Internet/Comm": 1500.00
        }
    }

# Mock settings state
USER_SETTINGS = {
    "name": "Shivani Mishra",
    "email": "shivani@example.com",
    "auto_approval_limit": 10000,
    "currency": "INR"
}

def get_settings():
    return USER_SETTINGS

def update_settings(new_settings: dict):
    global USER_SETTINGS
    USER_SETTINGS.update(new_settings)
    return USER_SETTINGS
