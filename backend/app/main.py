import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.mongodb import connect_to_mongodb, close_mongodb_connection, db_manager
from app.api.v1 import api_v1_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("pathly.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for MongoDB connection setup and teardown."""
    logger.info("Initializing Pathly Career Platform API backend...")
    await connect_to_mongodb()
    try:
        from app.services.admin_service import AdminService
        await AdminService.seed_defaults_if_needed()
    except Exception as e:
        logger.warning(f"Could not seed admin defaults on startup: {e}")
    yield
    logger.info("Shutting down Pathly API backend...")
    await close_mongodb_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack backend API for Pathly Career SaaS Platform powered by Python FastAPI & MongoDB.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
origins = settings.CORS_ORIGINS
if isinstance(origins, str):
    origins = [origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["set-cookie"],
)

# Request Timing & Logging Middleware
@app.middleware("http")
async def add_process_time_and_log(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    logger.info(f"{request.method} {request.url.path} -> {response.status_code} in {process_time:.4f}s")
    return response

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."},
    )

# Include API v1 Routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "database": "mock_memory" if db_manager.is_mock else "mongodb_live",
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "database_connected": db_manager.client is not None,
        "database_mode": "mock_fallback" if db_manager.is_mock else "live_mongodb",
        "environment": settings.ENVIRONMENT,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

