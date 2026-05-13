# SupplyShield — Yapay Zeka Destekli Tedarik Zinciri Yönetimi

Küçük ve orta ölçekli işletmeler için geliştirilmiş, 7 uzman yapay zeka ajanından oluşan tedarik zinciri risk yönetim platformu.

[Link Text](https://www.youtube.com/watch?v=T35Bmidb8jk)
---

## Özellikler

- **Risk Analizi** — Stok, tedarikçi güvenilirliği, coğrafi risk ve temin süresi faktörlerini otomatik değerlendirir
- **Talep Tahmini** — 14 ve 30 günlük talep tahmini üretir, trend analizi yapar
- **Alternatif Tedarikçi Keşfi** — Mevcut tedarikçi ağını tarar ve yeni adaylar önerir
- **Lojistik Optimizasyonu** — EOQ formülüyle optimal sipariş miktarı ve sevkiyat yöntemi belirler
- **Aksiyon Planı** — Tüm ajan çıktılarını öncelikli iş adımlarına dönüştürür
- **Çok Kullanıcılı Yapı** — Admin ve KOBİ rolleriyle ayrıştırılmış erişim kontrolü

---

## Mimari

```
SupplyShield/
├── backend/                   # FastAPI — Python 3.10+
│   ├── app/
│   │   ├── agents/            # 7 uzman ajan
│   │   │   ├── orchestrator_agent.py      # Tüm ajanları koordine eder
│   │   │   ├── inventory_analyst.py       # Stok risk skoru
│   │   │   ├── demand_forecast_agent.py   # Talep tahmini
│   │   │   ├── supply_shield_agent.py     # Jeopolitik/tedarik riski
│   │   │   ├── mesh_finder_agent.py       # Mevcut ağdan alternatif tedarikçi
│   │   │   ├── supplier_scout_agent.py    # Yeni tedarikçi keşfi
│   │   │   ├── logistics_planner_agent.py # EOQ tabanlı lojistik planı
│   │   │   └── action_composer_agent.py   # Öncelikli aksiyon planı
│   │   ├── api/v1/endpoints/  # REST API endpoint'leri
│   │   ├── models/            # Pydantic veri modelleri
│   │   ├── services/          # Risk hesaplama, tahmin servisleri
│   │   └── data/              # Mock ürün ve kullanıcı verileri
│   ├── main.py                # Uygulama giriş noktası
│   └── requirements.txt
│
└── frontend/                  # Next.js 14 — TypeScript
    ├── app/
    │   ├── views/             # Ana ekranlar
    │   │   ├── DashboardView.tsx
    │   │   ├── RiskAnalysisView.tsx
    │   │   ├── InventoryView.tsx
    │   │   ├── LogisticsView.tsx
    │   │   └── AgentsView.tsx
    │   ├── components/        # Yeniden kullanılabilir bileşenler
    │   ├── hooks/             # Veri çekme hook'ları
    │   └── lib/               # API istemcisi, tip tanımları
    └── package.json
```

---

## Kurulum

### Gereksinimler

- Python 3.10 veya üstü
- Node.js 18 veya üstü

### 1. Projeyi İndirin

```bash
git clone <repo-url>
cd SupplyShield
```

### 2. Backend Kurulumu

```bash
cd backend

# Sanal ortam oluşturun
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını düzenleyip gerekli değerleri girin (API key gerekmez)
```

### 3. Frontend Kurulumu

```bash
cd frontend
npm install
```

---

## Çalıştırma

İki terminal açın ve sırasıyla çalıştırın:

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Uygulama **http://localhost:3000** adresinde çalışır.
API dokümantasyonu **http://localhost:8000/docs** adresinde bulunur.

---

## Demo Hesapları

| Kullanıcı Adı | Şifre    | Rol   |
|---------------|----------|-------|
| admin         | admin123 | Admin |
| kobi1         | kobi123  | KOBİ  |
| kobi2         | kobi123  | KOBİ  |
| kobi3         | kobi123  | KOBİ  |

---

## API Endpoint'leri

| Yöntem | Endpoint                        | Açıklama                        |
|--------|---------------------------------|---------------------------------|
| POST   | `/api/v1/auth/login`            | Giriş, JWT token döner          |
| GET    | `/api/v1/products`              | Ürün listesi                    |
| GET    | `/api/v1/dashboard/summary`     | Dashboard özet verileri         |
| POST   | `/api/v1/agent/analyze/{id}`    | Tek ürün için ajan analizi      |
| GET    | `/api/v1/inventory`             | Stok durumu                     |

---

## Teknoloji Yığını

**Backend:** Python · FastAPI · Pydantic · JWT  
**Frontend:** Next.js 14 · TypeScript · Recharts · Tailwind CSS  
**Mimari:** Çok ajanlı orkestrasyon · EOQ algoritması · Kural tabanlı risk motoru

---

## Proje Notları

- Tüm veriler şu an mock (sahte) veri ile çalışmaktadır. Gerçek ERP/WMS entegrasyonuna hazır mimari kurulmuştur.
- Ajan motoru tamamen kural tabanlıdır; harici bir AI API'ye ihtiyaç duymaz.
- `.env` dosyasına herhangi bir API key yazmadan çalıştırabilirsiniz.
