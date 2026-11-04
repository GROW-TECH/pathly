import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("pathly.db")

class DatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_mock: bool = False

db_manager = DatabaseManager()

async def connect_to_mongodb() -> None:
    """Connect to MongoDB or fallback to AsyncMongoMockClient if local instance is unavailable."""
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=2000,
            connectTimeoutMS=2000,
        )
        # Test connection by pinging the server
        await client.admin.command("ping")
        db_manager.client = client
        db_manager.db = client[settings.MONGODB_DB_NAME]
        db_manager.is_mock = False
        logger.info(f"Successfully connected to MongoDB database '{settings.MONGODB_DB_NAME}'")
    except Exception as exc:
        if settings.USE_MONGOMOCK_FALLBACK:
            logger.warning(
                f"Could not connect to live MongoDB at {settings.MONGODB_URI} ({exc}). "
                "Initializing local in-memory AsyncMongoMockClient fallback for development."
            )
            from mongomock_motor import AsyncMongoMockClient
            mock_client = AsyncMongoMockClient()
            db_manager.client = mock_client
            db_manager.db = mock_client[settings.MONGODB_DB_NAME]
            db_manager.is_mock = True
            logger.info("Local AsyncMongoMockClient active with full Motor API support.")
        else:
            logger.error(f"Failed to connect to MongoDB: {exc}")
            raise exc

    # Ensure Indexes
    await init_indexes()

async def close_mongodb_connection() -> None:
    """Close MongoDB connection pool on shutdown."""
    if db_manager.client:
        logger.info("Closing MongoDB connection pool...")
        db_manager.client.close()
        logger.info("MongoDB connection closed.")

async def init_indexes() -> None:
    """Create essential unique indexes for users, candidate profiles, and auth sessions."""
    try:
        db = get_database()
        # Users collection indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("mobile", unique=True)
        
        # Candidate profiles index
        await db.candidate_profiles.create_index("user_id", unique=True)
        
        # Auth sessions index
        await db.auth_sessions.create_index("refresh_token_hash", unique=True)
        await db.auth_sessions.create_index("user_id")
        await db.auth_sessions.create_index("expires_at")

        # AI Assistant indexes
        await db.ai_conversations.create_index([("user_id", 1), ("updated_at", -1)])
        await db.ai_messages.create_index([("conversation_id", 1), ("created_at", 1)])
        await db.ai_messages.create_index("user_id")
        await db.ai_skill_gap_analyses.create_index([("user_id", 1), ("created_at", -1)])
        await db.ai_learning_roadmaps.create_index([("user_id", 1), ("updated_at", -1)])

        # Skills Roadmap & Learning module indexes
        await db.user_roadmaps.create_index("user_id", unique=True)
        await db.learning_progress.create_index([("user_id", 1), ("course_id", 1)], unique=True)
        await db.saved_courses.create_index([("user_id", 1), ("course_id", 1)], unique=True)
        logger.info("MongoDB database indexes successfully verified.")
    except Exception as e:
        logger.warning(f"Note on index creation: {e}")

def get_database() -> AsyncIOMotorDatabase:
    """Dependency helper returning the current database instance."""
    if db_manager.db is None:
        if settings.USE_MONGOMOCK_FALLBACK:
            from mongomock_motor import AsyncMongoMockClient
            mock_client = AsyncMongoMockClient()
            db_manager.client = mock_client
            db_manager.db = mock_client[settings.MONGODB_DB_NAME]
            db_manager.is_mock = True
        else:
            raise RuntimeError("Database connection has not been initialized.")
    return db_manager.db
