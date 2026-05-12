from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "SupplyShield API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ANTHROPIC_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
