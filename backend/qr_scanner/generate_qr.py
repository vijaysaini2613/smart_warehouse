
import qrcode
import json
from datetime import date

def generate_batch_qr():
    batch_data = {
        "batch_id": "BCH006",
        "product_id": "CHOC124",
        "product_name": "Five Star",
        "category": "Chocolates",
        "quantity": 120,
        "expiry_date": "2025-12-15",
        "entry_date": str(date.today())
    }

    qr = qrcode.make(json.dumps(batch_data))
    qr.save("batch_qr.png")
    print("✅ QR code saved as batch_qr.png")

if __name__ == "__main__":
    generate_batch_qr()
