from fastapi import APIRouter, Depends, HTTPException, status

from app.data.users import hash_password, users_db
from app.models.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.auth_service import (
    authenticate_user,
    create_access_token,
    get_current_user,
    require_admin,
)

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    user = authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": user["username"]})
    user_response = UserResponse(
        username=user["username"],
        role=user["role"],
        company_name=user["company_name"],
        email=user["email"],
    )
    return TokenResponse(access_token=token, user=user_response)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    if request.username in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    new_user = {
        "username": request.username,
        "hashed_password": hash_password(request.password),
        "role": "sme",
        "company_name": request.company_name,
        "email": request.email,
    }
    users_db[request.username] = new_user
    token = create_access_token({"sub": request.username})
    user_response = UserResponse(
        username=new_user["username"],
        role=new_user["role"],
        company_name=new_user["company_name"],
        email=new_user["email"],
    )
    return TokenResponse(access_token=token, user=user_response)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user


@router.get("/users", response_model=list[UserResponse])
async def list_users(_: UserResponse = Depends(require_admin)):
    return [
        UserResponse(
            username=u["username"],
            role=u["role"],
            company_name=u["company_name"],
            email=u["email"],
        )
        for u in users_db.values()
    ]


@router.delete("/users/{username}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(username: str, _: UserResponse = Depends(require_admin)):
    if username not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if username == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the admin user",
        )
    del users_db[username]
