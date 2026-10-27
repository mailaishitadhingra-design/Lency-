
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Recipient(Base):
    __tablename__ = "recipients"

    id = Column(Integer, primary_key=True, index=True)
    qr_id = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)
    upi_id = Column(String, nullable=False)
    account_name = Column(String, nullable=False)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    recipient_id = Column(Integer, ForeignKey("recipients.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="PENDING", nullable=False)
    qr_id = Column(String, nullable=False)
    qr_name = Column(String, nullable=False)
    account_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
