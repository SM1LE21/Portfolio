# app/utils/session_manager.py
import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.utils.email_utils import send_email
from app.utils.logger import logger
import json  # Import json module for parsing function_call

def send_daily_conversations_email():
    logger.info("Running daily conversations email job.")
    db = SessionLocal()
    try:
        now = datetime.datetime.utcnow()
        yesterday = now - datetime.timedelta(days=1)

        # Query messages from the last 24 hours
        messages = (
            db.query(models.Message)
            .filter(
                models.Message.timestamp >= yesterday,
                models.Message.timestamp <= now,
            )
            .order_by(models.Message.timestamp)
            .all()
        )

        if not messages:
            logger.info("No messages to include in daily email.")
            return

        # Group messages by session_id
        from collections import defaultdict
        sessions_messages = defaultdict(list)
        for msg in messages:
            sessions_messages[msg.session_id].append(msg)

        email_body = ""
        for session_id, msgs in sessions_messages.items():
            email_body += f"\nSession {session_id}:\n"
            for msg in msgs:
                timestamp = msg.timestamp.strftime("%Y-%m-%d %H:%M:%S")
                # Check if content is present
                if msg.content:
                    message_content = msg.content
                elif msg.function_call:
                    # Parse the function_call JSON
                    try:
                        function_call = json.loads(msg.function_call)
                        function_name = function_call.get('name', 'Unknown function')
                        function_args = function_call.get('arguments', {})
                    except json.JSONDecodeError:
                        function_name = 'Unknown function'
                        function_args = {}

                    description = msg.description or ''
                    message_content = (
                        f"Function Call - Name: {function_name}, "
                        f"Arguments: {function_args}, "
                        f"Description: {description}"
                    )
                else:
                    message_content = "[No content]"
                email_body += f"{timestamp} [{msg.role}]: {message_content}\n"

        # Send email
        subject = f"Daily Conversation Report for {now.strftime('%Y-%m-%d')}"
        send_email(subject, email_body)

        logger.info("Daily conversations email sent.")

    except Exception as e:
        logger.error(f"Error sending daily conversations email: {e}")
    finally:
        db.close()
