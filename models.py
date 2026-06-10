from sqlalchemy import Column, Integer, String, Text, DateTime, Table, ForeignKey, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# Association table for many-to-many relationship
pharmacy_products = Table(
    'pharmacy_products',
    Base.metadata,
    Column('pharmacy_id', Integer, ForeignKey('pharmacies.id', ondelete='CASCADE')),
    Column('product_id', Integer, ForeignKey('products.id', ondelete='CASCADE'))
)


class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), index=True)
    images = Column(ARRAY(String), default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    pharmacies = relationship("Pharmacy", secondary=pharmacy_products, back_populates="products")


class Pharmacy(Base):
    __tablename__ = "pharmacies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    address = Column(Text, nullable=False)
    phone = Column(String(20), nullable=True)
    whatsapp = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    products = relationship("Product", secondary=pharmacy_products, back_populates="pharmacies")
