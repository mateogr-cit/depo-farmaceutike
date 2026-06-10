from database import SessionLocal, init_db
from models import Product, Pharmacy
from datetime import datetime

def seed_database():
    """Seed the database with test data"""
    init_db()
    
    db = SessionLocal()
    
    # Clear existing data
    db.query(Product).delete()
    db.query(Pharmacy).delete()
    db.commit()
    
    # Create test products (Albanian pharmaceutical names)
    product1 = Product(
        name="Aspirin 500mg",
        description="Analgjezik dhe antipiretik. Përdoret për lehtësimin e dhimbjeve dhe fikjen e temperaturës.",
        category="Analgjezikë",
        images=["/uploads/aspirin.jpg"],
        created_at=datetime.utcnow()
    )
    
    product2 = Product(
        name="Paracetamol 500mg",
        description="Antipiretik dhe analgjezik. Efektiv për dhembjet e lehtë deri në mesatare dhe temperaturën e lartë.",
        category="Analgjezikë",
        images=["/uploads/paracetamol.jpg"],
        created_at=datetime.utcnow()
    )
    
    db.add(product1)
    db.add(product2)
    db.commit()
    db.refresh(product1)
    db.refresh(product2)
    
    # Create test pharmacy in Tirana
    pharmacy1 = Pharmacy(
        name="Farmacia Vitale - Tirana",
        address="Rruga Deshmoret e Kombit, Tirana, Albania",
        phone="+355 4 2247 600",
        whatsapp="+355 69 2247 600",
        created_at=datetime.utcnow()
    )
    
    db.add(pharmacy1)
    db.commit()
    db.refresh(pharmacy1)
    
    # Link both products to the pharmacy
    pharmacy1.products.append(product1)
    pharmacy1.products.append(product2)
    
    db.commit()
    
    print("✓ Database seeded successfully!")
    print(f"  - Created {db.query(Product).count()} products")
    print(f"  - Created {db.query(Pharmacy).count()} pharmacies")
    
    db.close()


if __name__ == "__main__":
    seed_database()
