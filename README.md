# Lency — screenshot-matched frontend prototype

Mobile-first React + JavaScript + Tailwind CSS app inspired by the supplied Lency prototype screens.

## Run
1. Install Node.js 18+.
2. Run `npm install`
3. Run `npm run dev`
4. Open the local URL printed by Vite.

## Included prototype flows
- Home / demo account
- QR scan screen with decorative simulated QR
- Review payment
- Lency name comparison (match and mismatch)
- Confirm demo payment
- Processing
- Success, failed, and cancelled result states
- Transaction detail / receipt
- Activity and profile tabs

## Demo behavior
- `LENCY-DEMO-01`, `ASHA-STORES`, and `SAFE-QR` simulate a name match.
- Any other QR ID simulates a name mismatch.
- This frontend does not access the camera, connect to UPI/banks, collect credentials, validate real QR codes, or transfer money.
- Payment result is simulated. The UI explicitly describes name matching as a limited signal, not proof of identity or safety.
