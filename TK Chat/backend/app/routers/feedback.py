# This file contains the API endpoints for submitting feedback and saving it to the database.
# app/routers/feedback.py

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
from app.utils import auth
from app.utils.logger import logger

# Import send_email from email_utils
from app.utils.email_utils import send_email

router = APIRouter(
    prefix="/feedback",
    tags=["feedback"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def submit_feedback(
    feedback: schemas.FeedbackCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Check if session is active
    if not auth.is_session_active(feedback.session_id, db):
        logger.warning(f"Session {feedback.session_id}: Invalid or expired session during feedback submission.")
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    # Save feedback to the database
    db_feedback = models.Feedback(
        session_id=feedback.session_id,
        feedback=feedback.feedback
    )
    logger.info(f"Session {feedback.session_id}: Feedback received - '{feedback.feedback}'")

    logger.info(f"Session {feedback.session_id}: Saving feedback to database.")
    db.add(db_feedback)
    db.commit()

    # Schedule email sending as a background task
    subject = f"New Feedback Received - Session {feedback.session_id}"
    body = f"Session ID: {feedback.session_id}\nFeedback: {feedback.feedback}"
    background_tasks.add_task(send_email, subject, body)
    logger.info(f"Session {feedback.session_id}: Feedback email scheduled.")

    return {"detail": "Feedback received"}
