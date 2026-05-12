import hashlib
import secrets


def _sha256(password: str) -> str:
    salt = "supplyshield_salt_2024"
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()


def hash_password(password: str) -> str:
    return _sha256(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return _sha256(plain_password) == hashed_password


users_db: dict[str, dict] = {
    "admin": {
        "username": "admin",
        "hashed_password": hash_password("admin123"),
        "role": "admin",
        "company_name": "SupplyShield HQ",
        "email": "admin@supplyshield.com",
    },
    "kobi1": {
        "username": "kobi1",
        "hashed_password": hash_password("kobi123"),
        "role": "sme",
        "company_name": "Anadolu Tekstil",
        "email": "kobi1@anadolutekstil.com",
    },
    "kobi2": {
        "username": "kobi2",
        "hashed_password": hash_password("kobi123"),
        "role": "sme",
        "company_name": "İstanbul Elektronik",
        "email": "kobi2@istanbulelektronik.com",
    },
    "kobi3": {
        "username": "kobi3",
        "hashed_password": hash_password("kobi123"),
        "role": "sme",
        "company_name": "Ankara Gıda",
        "email": "kobi3@ankaragida.com",
    },
}
