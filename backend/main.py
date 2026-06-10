from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import shutil

from database import get_db, init_db
from models import Product, Pharmacy
from schemas import (
    ProductCreate, ProductUpdate, ProductResponse, ProductWithPharmacies,
    PharmacyCreate, PharmacyUpdate, PharmacyResponse, PharmacyWithProducts,
    PharmacyProductLink, AdminLoginRequest
)

load_dotenv()

app = FastAPI(title="Depo Farmaceutike API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Admin Password
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount uploads directory for static file serving
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# --- Admin Authentication ---
def verify_admin(password: str):
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    return True


# --- Products Endpoints ---
@app.get("/products", response_model=list[ProductResponse])
def list_products(skip: int = 0, limit: int = 100, category: str = None, search: str = None, db: Session = Depends(get_db)):
    query = db.query(Product)
    
    if category:
        query = query.filter(Product.category == category)
    
    if search:
        query = query.filter(or_(
            Product.name.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%")
        ))
    
    return query.offset(skip).limit(limit).all()


@app.get("/products/{product_id}", response_model=ProductWithPharmacies)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/products", response_model=ProductResponse)
def create_product(product: ProductCreate, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.dict(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow()
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@app.delete("/products/{product_id}")
def delete_product(product_id: int, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}


@app.post("/products/{product_id}/image")
async def upload_product_image(product_id: int, file: UploadFile = File(...), password: str = "", db: Session = Depends(get_db)):
    verify_admin(password)
    
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Save file
    filename = f"{product_id}_{datetime.utcnow().timestamp()}_{file.filename}"
    file_path = UPLOAD_DIR / filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Add to product images
    image_url = f"/uploads/{filename}"
    if image_url not in db_product.images:
        db_product.images.append(image_url)
    
    db.commit()
    db.refresh(db_product)
    return {"image_url": image_url, "product_id": product_id}


# --- Pharmacies Endpoints ---
@app.get("/pharmacies", response_model=list[PharmacyResponse])
def list_pharmacies(skip: int = 0, limit: int = 100, search: str = None, db: Session = Depends(get_db)):
    query = db.query(Pharmacy)
    
    if search:
        query = query.filter(or_(
            Pharmacy.name.ilike(f"%{search}%"),
            Pharmacy.address.ilike(f"%{search}%")
        ))
    
    return query.offset(skip).limit(limit).all()


@app.get("/pharmacies/{pharmacy_id}", response_model=PharmacyWithProducts)
def get_pharmacy(pharmacy_id: int, db: Session = Depends(get_db)):
    pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    return pharmacy


@app.post("/pharmacies", response_model=PharmacyResponse)
def create_pharmacy(pharmacy: PharmacyCreate, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    
    db_pharmacy = Pharmacy(**pharmacy.dict())
    db.add(db_pharmacy)
    db.commit()
    db.refresh(db_pharmacy)
    return db_pharmacy


@app.put("/pharmacies/{pharmacy_id}", response_model=PharmacyResponse)
def update_pharmacy(pharmacy_id: int, pharmacy: PharmacyUpdate, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    
    db_pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not db_pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    
    update_data = pharmacy.dict(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow()
    for key, value in update_data.items():
        setattr(db_pharmacy, key, value)
    
    db.commit()
    db.refresh(db_pharmacy)
    return db_pharmacy


@app.delete("/pharmacies/{pharmacy_id}")
def delete_pharmacy(pharmacy_id: int, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    
    db_pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not db_pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    
    db.delete(db_pharmacy)
    db.commit()
    return {"message": "Pharmacy deleted successfully"}


# --- Pharmacy-Product Links ---
@app.post("/pharmacies/{pharmacy_id}/products")
def link_products_to_pharmacy(pharmacy_id: int, link: PharmacyProductLink, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    
    pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    
    products = db.query(Product).filter(Product.id.in_(link.product_ids)).all()
    if not products:
        raise HTTPException(status_code=404, detail="Products not found")
    
    for product in products:
        if product not in pharmacy.products:
            pharmacy.products.append(product)
    
    db.commit()
    return {"message": f"Linked {len(products)} products to pharmacy"}


@app.delete("/pharmacies/{pharmacy_id}/products/{product_id}")
def unlink_product_from_pharmacy(pharmacy_id: int, product_id: int, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    
    pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product in pharmacy.products:
        pharmacy.products.remove(product)
        db.commit()
    
    return {"message": "Product removed from pharmacy"}


# --- Admin Authentication Endpoint ---
@app.post("/admin/verify")
def verify_admin_password(request: AdminLoginRequest):
    try:
        verify_admin(request.password)
        return {"authenticated": True}
    except HTTPException:
        return {"authenticated": False}


# --- Health Check ---
@app.get("/health")
def health_check():
    return {"status": "ok"}


# --- Initialization ---
@app.on_event("startup")
def startup():
    init_db()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
