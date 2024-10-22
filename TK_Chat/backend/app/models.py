# Models for the database
# app/models.py
import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database import Base

class Session(Base):
    __tablename__ = 'sessions'

    session_id = Column(String, primary_key=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Integer, default=1)

class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    session_id = Column(String, nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    function_call = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    feedback = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
