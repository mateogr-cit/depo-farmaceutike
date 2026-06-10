from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    images: List[str] = []


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProductWithPharmacies(ProductResponse):
    pharmacies: List['PharmacyResponse'] = []


class PharmacyBase(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None
    whatsapp: Optional[str] = None


class PharmacyCreate(PharmacyBase):
    pass


class PharmacyUpdate(PharmacyBase):
    pass


class PharmacyResponse(PharmacyBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PharmacyWithProducts(PharmacyResponse):
    products: List[ProductResponse] = []


class PharmacyProductLink(BaseModel):
    product_ids: List[int]


class AdminLoginRequest(BaseModel):
    password: str
