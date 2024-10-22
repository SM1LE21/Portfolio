# app/utils/email_utils.py
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.config import SENDGRID_API_KEY, SENDER_EMAIL, RECIPIENT_EMAIL
from app.utils.logger import logger

def send_email(subject: str, body: str):
    if not SENDGRID_API_KEY or not SENDER_EMAIL or not RECIPIENT_EMAIL:
        logger.error("Email configuration variables are not set properly.")
        return

    message = Mail(
        from_email=SENDER_EMAIL,
        to_emails=RECIPIENT_EMAIL,
        subject=subject,
        plain_text_content=body
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        logger.info(f"Email sent to {RECIPIENT_EMAIL} with subject '{subject}'")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
