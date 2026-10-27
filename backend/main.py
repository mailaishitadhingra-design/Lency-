
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Recipient, Transaction

app = FastAPI(title="Lency API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


class VerifyRequest(BaseModel):
    qr_id: str
    entered_name: str


class TransactionRequest(BaseModel):
    qr_id: str
    amount: float = Field(gt=0)


@app.on_event("startup")
def seed_recipients():
    db = next(get_db())
    try:
        samples = [
            ("LENCY-DEMO-01", "Asha Stores", "asha@lency", "Asha Stores"),
            ("ASHA-STORES", "Asha Stores", "asha@lency", "Asha Stores"),
            ("SAFE-QR", "Safe Payments Demo", "safe@lency", "Safe Payments Demo"),
        ]

        for qr_id, display_name, upi_id, account_name in samples:
            existing = db.query(Recipient).filter_by(qr_id=qr_id).first()
            if not existing:
                db.add(Recipient(
                    qr_id=qr_id,
                    display_name=display_name,
                    upi_id=upi_id,
                    account_name=account_name,
                ))

        db.commit()
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok", "message": "Lency backend is running"}


@app.get("/api/recipients/{qr_id}")
def get_recipient(qr_id: str, db: Session = Depends(get_db)):
    recipient = db.query(Recipient).filter_by(qr_id=qr_id).first()

    if not recipient:
        raise HTTPException(status_code=404, detail="QR code not recognised")

    return {
        "qr_id": recipient.qr_id,
        "display_name": recipient.display_name,
        "upi_id": recipient.upi_id,
        "account_name": recipient.account_name,
    }


@app.post("/api/verify-recipient")
def verify_recipient(request: VerifyRequest, db: Session = Depends(get_db)):
    recipient = db.query(Recipient).filter_by(qr_id=request.qr_id).first()

    if not recipient:
        raise HTTPException(status_code=404, detail="QR code not recognised")

    verified = (
        request.entered_name.strip().casefold()
        == recipient.account_name.strip().casefold()
    )

    return {
        "verified": verified,
        "qr_name": recipient.display_name,
        "account_name": recipient.account_name,
        "message": (
            "Recipient name verified"
            if verified
            else "The entered name does not match the account name"
        ),
    }


@app.post("/api/transactions", status_code=201)
def create_transaction(
    request: TransactionRequest,
    db: Session = Depends(get_db),
):
    recipient = db.query(Recipient).filter_by(qr_id=request.qr_id).first()

    if not recipient:
        raise HTTPException(status_code=404, detail="QR code not recognised")

    transaction = Transaction(
        recipient_id=recipient.id,
        amount=round(request.amount, 2),
        status="PENDING",
        qr_id=recipient.qr_id,
        qr_name=recipient.display_name,
        account_name=recipient.account_name,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        "id": transaction.id,
        "qr_id": transaction.qr_id,
        "recipient_name": transaction.qr_name,
        "account_name": transaction.account_name,
        "amount": transaction.amount,
        "status": transaction.status,
        "created_at": transaction.created_at,
        "message": "Demo transaction created. No money was transferred.",
    }


@app.patch("/api/transactions/{transaction_id}/status")
def update_transaction_status(
    transaction_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    allowed_statuses = {"SUCCESS", "FAILED", "CANCELLED"}

    if status.upper() not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Status must be SUCCESS, FAILED, or CANCELLED",
        )

    transaction = db.query(Transaction).filter_by(id=transaction_id).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if transaction.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Only pending transactions can be updated",
        )

    transaction.status = status.upper()
    db.commit()
    db.refresh(transaction)

    return {
        "id": transaction.id,
        "status": transaction.status,
        "message": "Demo transaction status updated. No money was transferred.",
    }


@app.get("/api/transactions")
def get_transactions(db: Session = Depends(get_db)):
    transactions = (
        db.query(Transaction)
        .order_by(Transaction.id.desc())
        .all()
    )

    return [
        {
            "id": item.id,
            "qr_id": item.qr_id,
            "recipient_name": item.qr_name,
            "account_name": item.account_name,
            "amount": item.amount,
            "status": item.status,
            "created_at": item.created_at,
        }
        for item in transactions
    ]


@app.get("/api/transactions/{transaction_id}")
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    item = db.query(Transaction).filter_by(id=transaction_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return {
        "id": item.id,
        "qr_id": item.qr_id,
        "recipient_name": item.qr_name,
        "account_name": item.account_name,
        "amount": item.amount,
        "status": item.status,
        "created_at": item.created_at,
    }
