from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import random
from weather_service import WeatherService

# Initialize weather service
weather_service = WeatherService()



ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Varun API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================

# User Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    language: str = "en"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    total_liters_saved: float = 0.0
    badges_earned: int = 0
    streak_days: int = 0

# Assessment Models
class AssessmentInput(BaseModel):
    user_id: str
    roof_area: float
    annual_rainfall: float
    groundwater_depth: Optional[float] = None
    soil_type: str
    location: Optional[Dict[str, float]] = None
    photos: Optional[List[str]] = []

class FeasibilityResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assessment_id: str
    feasibility_score: float
    liters_potential: float
    recharge_potential: float
    cost_estimation: float
    roi_months: int
    tank_capacity: float
    recharge_pit_size: str
    system_recommendation: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Booking Models
class BookingCreate(BaseModel):
    user_id: str
    expert_id: str
    preferred_date: datetime
    notes: Optional[str] = None
    photos: Optional[List[str]] = []

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    expert_id: str
    expert_name: str
    scheduled_date: datetime
    status: str = "pending"
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Dashboard Models
class DashboardData(BaseModel):
    rainfall_today: float
    groundwater_depth: float
    tank_level: float
    liters_saved_today: float
    liters_saved_month: float
    liters_saved_total: float
    carbon_saved: float
    recharge_efficiency: float
    tankers_avoided: int

# IoT Models
class IoTData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    rain_intensity: float
    tank_level: float
    infiltration_rate: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Community Models
class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    name: str
    liters_saved: float
    badges: int

class Badge(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    color: str
    earned: bool
    earned_date: Optional[datetime] = None

# Notification Models
class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    message: str
    type: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ==================== HELPER FUNCTIONS ====================

def calculate_feasibility(roof_area: float, rainfall: float, soil_type: str) -> Dict[str, Any]:
    """Calculate feasibility based on input parameters"""
    # Runoff coefficient based on roof type (assuming concrete)
    runoff_coefficient = 0.85
    
    # Calculate potential water collection (in liters)
    # Formula: Area (sq ft) * Rainfall (mm) * Runoff coefficient * 0.0254 (conversion factor)
    liters_potential = roof_area * rainfall * runoff_coefficient * 0.0254
    
    # Soil percolation rates (mm/hour)
    percolation_rates = {
        'clay': 2.5,
        'sandy': 25.0,
        'loamy': 13.0,
        'rocky': 0.5
    }
    
    percolation_rate = percolation_rates.get(soil_type, 10.0)
    recharge_potential = liters_potential * (percolation_rate / 25.0)  # Normalized
    
    # Feasibility score (0-100)
    feasibility_score = min(100, (liters_potential / 100) + (recharge_potential / 50))
    
    # Cost estimation (₹)
    base_cost = 15000
    area_cost = roof_area * 50
    total_cost = base_cost + area_cost
    
    # ROI calculation (months to recover investment)
    # Assuming tanker water cost: ₹1000/5000L = ₹0.2/L
    monthly_savings = (liters_potential / 12) * 0.2
    roi_months = int(total_cost / monthly_savings) if monthly_savings > 0 else 120
    
    # Tank capacity recommendation (liters)
    tank_capacity = liters_potential * 0.1  # 10% of annual potential
    
    # Recharge pit sizing
    pit_size = f"{int(roof_area * 0.05)}sq ft x 6ft deep"
    
    return {
        'feasibility_score': round(feasibility_score, 2),
        'liters_potential': round(liters_potential, 2),
        'recharge_potential': round(recharge_potential, 2),
        'cost_estimation': round(total_cost, 2),
        'roi_months': roi_months,
        'tank_capacity': round(tank_capacity, 2),
        'recharge_pit_size': pit_size,
        'system_recommendation': 'Rooftop Rainwater Harvesting with Underground Tank and Recharge Pit'
    }


def generate_mock_experts():
    """Generate mock expert data"""
    return [
        {
            'id': str(uuid.uuid4()),
            'name': 'Dr. Rajesh Kumar',
            'specialization': 'Rainwater Harvesting Expert',
            'experience': '15+ years',
            'rating': 4.8,
            'reviews': 124,
            'availability': 'Available'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Priya Sharma',
            'specialization': 'Civil Engineer',
            'experience': '10+ years',
            'rating': 4.9,
            'reviews': 89,
            'availability': 'Available'
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Arun Menon',
            'specialization': 'Groundwater Specialist',
            'experience': '12+ years',
            'rating': 4.7,
            'reviews': 156,
            'availability': 'Busy'
        }
    ]


# ==================== API ROUTES ====================

# Root
@api_router.get("/")
async def root():
    return {
        "message": "Varun API - Intelligent Rainwater Harvesting & Recharge Planner",
        "version": "1.0.0",
        "status": "running"
    }

# ========== Authentication ==========

@api_router.post("/auth/register")
async def register_user(user_data: UserRegister):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create new user
        user = User(
            name=user_data.name,
            email=user_data.email,
            phone=user_data.phone
        )
        
        await db.users.insert_one(user.dict())
        
        return {
            "message": "User registered successfully",
            "user_id": user.id,
            "email": user.email
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login")
async def login_user(login_data: UserLogin):
    """Login user"""
    try:
        user = await db.users.find_one({"email": login_data.email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Mock password check (in production, use proper password hashing)
        return {
            "message": "Login successful",
            "user_id": user['id'],
            "name": user['name'],
            "email": user['email']
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== User Profile ==========

@api_router.get("/user/{user_id}")
async def get_user(user_id: str):
    """Get user profile"""
    try:
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/user/{user_id}")
async def update_user(user_id: str, updates: Dict[str, Any]):
    """Update user profile"""
    try:
        result = await db.users.update_one(
            {"id": user_id},
            {"$set": updates}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== Assessment & Feasibility ==========

@api_router.post("/assessment/submit")
async def submit_assessment(assessment: AssessmentInput):
    """Submit assessment data and get feasibility result"""
    try:
        # Save assessment
        assessment_dict = assessment.dict()
        assessment_dict['id'] = str(uuid.uuid4())
        assessment_dict['created_at'] = datetime.utcnow()
        
        await db.assessments.insert_one(assessment_dict)
        
        # Calculate feasibility
        feasibility_data = calculate_feasibility(
            assessment.roof_area,
            assessment.annual_rainfall,
            assessment.soil_type
        )
        
        # Save feasibility result
        result = FeasibilityResult(
            assessment_id=assessment_dict['id'],
            **feasibility_data
        )
        
        await db.feasibility_results.insert_one(result.dict())
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/assessment/{assessment_id}")
async def get_assessment(assessment_id: str):
    """Get assessment by ID"""
    try:
        assessment = await db.assessments.find_one({"id": assessment_id})
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        return assessment
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/assessment/user/{user_id}")
async def get_user_assessments(user_id: str):
    """Get all assessments for a user"""
    try:
        assessments = await db.assessments.find({"user_id": user_id}).to_list(100)
        return assessments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== Dashboard ==========

@api_router.get("/dashboard/{user_id}")
async def get_dashboard(user_id: str):
    """Get dashboard data for user"""
    try:
        # Get user data
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Mock real-time data (in production, fetch from actual sensors/APIs)
        dashboard_data = DashboardData(
            rainfall_today=random.uniform(0, 50),
            groundwater_depth=random.uniform(10, 20),
            tank_level=random.uniform(50, 90),
            liters_saved_today=random.uniform(50, 200),
            liters_saved_month=random.uniform(1000, 1500),
            liters_saved_total=user.get('total_liters_saved', 3650),
            carbon_saved=user.get('total_liters_saved', 3650) * 0.0009,  # kg CO2
            recharge_efficiency=random.uniform(75, 95),
            tankers_avoided=int(user.get('total_liters_saved', 3650) / 5000)
        )
        
        return dashboard_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== External Data APIs (Mock) ==========


# ========== Weather & Environmental Data ==========

@api_router.get("/weather/current")
async def get_current_weather(latitude: float, longitude: float):
    """Get current weather and rainfall data"""
    try:
        weather_data = await weather_service.get_weather_data(latitude, longitude)
        return weather_data
    except Exception as e:
        logger.error(f"Error fetching weather data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/weather/aqi")
async def get_air_quality(latitude: float, longitude: float):
    """Get Air Quality Index data"""
    try:
        aqi_data = await weather_service.get_aqi_data(latitude, longitude)
        return aqi_data
    except Exception as e:
        logger.error(f"Error fetching AQI data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/weather/combined")
async def get_combined_weather_data(latitude: float, longitude: float):
    """Get combined weather, rainfall, and AQI data"""
    try:
        weather_data = await weather_service.get_weather_data(latitude, longitude)
        aqi_data = await weather_service.get_aqi_data(latitude, longitude)
        
        return {
            "weather": weather_data,
            "aqi": aqi_data,
            "location": {
                "latitude": latitude,
                "longitude": longitude
            }
        }
    except Exception as e:
        logger.error(f"Error fetching combined weather data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/data/rainfall/{location}")
async def get_rainfall_data(location: str):
    """Get rainfall data from IMD (Mock)"""
    return {
        "location": location,
        "annual_rainfall": random.uniform(800, 1400),
        "monthly_average": random.uniform(60, 120),
        "source": "IMD (Mock)",
        "last_updated": datetime.utcnow().isoformat()
    }

@api_router.get("/data/groundwater/{location}")
async def get_groundwater_data(location: str):
    """Get groundwater data (Mock)"""
    return {
        "location": location,
        "depth": random.uniform(10, 25),
        "quality": "Good",
        "source": "Groundwater Board (Mock)",
        "last_updated": datetime.utcnow().isoformat()
    }

@api_router.get("/data/soil/{location}")
async def get_soil_data(location: str):
    """Get soil data from Mannvalam (Mock)"""
    soil_types = ["clay", "sandy", "loamy", "rocky"]
    return {
        "location": location,
        "soil_type": random.choice(soil_types),
        "percolation_rate": random.uniform(2, 25),
        "source": "TN Agriculture Mannvalam (Mock)",
        "last_updated": datetime.utcnow().isoformat()
    }

# ========== Expert Booking ==========

@api_router.get("/experts")
async def get_experts():
    """Get list of available experts"""
    return generate_mock_experts()

@api_router.post("/booking/create")
async def create_booking(booking_data: BookingCreate):
    """Create a new expert booking"""
    try:
        # Get expert name
        experts = generate_mock_experts()
        expert = next((e for e in experts if e['id'] == booking_data.expert_id), None)
        
        if not expert:
            raise HTTPException(status_code=404, detail="Expert not found")
        
        booking = Booking(
            user_id=booking_data.user_id,
            expert_id=booking_data.expert_id,
            expert_name=expert['name'],
            scheduled_date=booking_data.preferred_date,
            notes=booking_data.notes
        )
        
        await db.bookings.insert_one(booking.dict())
        
        return booking
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/booking/user/{user_id}")
async def get_user_bookings(user_id: str):
    """Get all bookings for a user"""
    try:
        bookings = await db.bookings.find({"user_id": user_id}).to_list(100)
        return bookings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== IoT Data ==========

@api_router.get("/iot/data/{user_id}")
async def get_iot_data(user_id: str):
    """Get latest IoT sensor data"""
    try:
        # Mock IoT data (in production, fetch from actual sensors)
        iot_data = IoTData(
            user_id=user_id,
            rain_intensity=random.uniform(0, 10),
            tank_level=random.uniform(50, 90),
            infiltration_rate=random.uniform(5, 20)
        )
        
        return iot_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/iot/history/{user_id}")
async def get_iot_history(user_id: str, days: int = 7):
    """Get historical IoT data"""
    try:
        history = []
        for i in range(days):
            date = datetime.utcnow() - timedelta(days=i)
            history.append({
                "date": date.isoformat(),
                "rain_intensity": random.uniform(0, 10),
                "tank_level": random.uniform(50, 90),
                "infiltration_rate": random.uniform(5, 20)
            })
        
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== Community & Leaderboard ==========

@api_router.get("/community/leaderboard")
async def get_leaderboard():
    """Get community leaderboard"""
    try:
        users = await db.users.find().sort("total_liters_saved", -1).limit(50).to_list(50)
        
        leaderboard = []
        for idx, user in enumerate(users, 1):
            leaderboard.append(LeaderboardEntry(
                rank=idx,
                user_id=user['id'],
                name=user['name'],
                liters_saved=user.get('total_liters_saved', 0),
                badges=user.get('badges_earned', 0)
            ))
        
        return leaderboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/community/stats")
async def get_community_stats():
    """Get overall community statistics"""
    try:
        # Aggregate community data
        total_users = await db.users.count_documents({})
        
        # Mock community stats
        return {
            "total_users": total_users,
            "total_liters_saved": random.uniform(100000, 500000),
            "total_carbon_saved": random.uniform(90, 450),
            "tankers_avoided": random.randint(20, 100),
            "active_systems": random.randint(50, 200)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== Achievements & Badges ==========

@api_router.get("/achievements/{user_id}")
async def get_user_achievements(user_id: str):
    """Get user badges and achievements"""
    try:
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        liters_saved = user.get('total_liters_saved', 0)
        streak_days = user.get('streak_days', 0)
        
        badges = [
            Badge(
                id="water_warrior",
                name="Water Warrior",
                description="Saved over 1000 liters",
                icon="water",
                color="#2196F3",
                earned=liters_saved >= 1000
            ),
            Badge(
                id="first_drop",
                name="First Drop",
                description="Completed first assessment",
                icon="water-check",
                color="#4CAF50",
                earned=True
            ),
            Badge(
                id="week_streak",
                name="Week Streak",
                description="7 days active streak",
                icon="fire",
                color="#FF9800",
                earned=streak_days >= 7
            ),
            Badge(
                id="community_hero",
                name="Community Hero",
                description="Top 10 in leaderboard",
                icon="account-group",
                color="#9C27B0",
                earned=False
            )
        ]
        
        return badges
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== Notifications ==========

@api_router.get("/notifications/{user_id}")
async def get_notifications(user_id: str):
    """Get user notifications"""
    try:
        notifications = await db.notifications.find({"user_id": user_id}).sort("created_at", -1).limit(50).to_list(50)
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/notifications/send")
async def send_notification(notification: Notification):
    """Send notification to user (Admin)"""
    try:
        await db.notifications.insert_one(notification.dict())
        return {"message": "Notification sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark notification as read"""
    try:
        result = await db.notifications.update_one(
            {"id": notification_id},
            {"$set": {"read": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Varun API started successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("MongoDB connection closed")
