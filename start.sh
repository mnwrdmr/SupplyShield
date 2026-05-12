#!/bin/bash
# SupplyShield — Tek komutla başlatma scripti

echo "🚀 SupplyShield başlatılıyor..."

# Backend'i başlat
echo "→ Backend başlatılıyor (port 8000)..."
cd backend
if [ ! -d "venv" ]; then
  echo "  Sanal ortam oluşturuluyor..."
  python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt -q
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

# Frontend'i başlat
echo "→ Frontend başlatılıyor (port 3000)..."
cd ../frontend
npm install -s
npm run dev &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ SupplyShield çalışıyor!"
echo "   → Uygulama:  http://localhost:3000"
echo "   → API Docs:  http://localhost:8000/docs"
echo ""
echo "Durdurmak için Ctrl+C"

# Her iki process'i bekle
wait $BACKEND_PID $FRONTEND_PID
