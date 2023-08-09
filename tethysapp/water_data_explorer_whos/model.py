# Put your persistent store models in this file
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()


class Groups(Base):
    __tablename__ = 'Group_Hydroserver_Individuals'

    id = Column(Integer, primary_key=True)  # Record number.
    title = Column(String(1000))  # Tile as given by the admin
    description = Column(Text)  # URL of the SOAP endpointx
    hydroserver = relationship("HydroServer_Individual", back_populates ="group", cascade = "all,delete, delete-orphan" )
    #all, delete-orphan,save-update
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __init__(self, title, description):
        self.title = title
        self.description= description


class HydroServer_Individual(Base):
    __tablename__ = 'Hydroserver_Singular'

    id = Column(Integer, primary_key=True)  # Record number.
    title = Column(String(1000))  # Tile as given by the admin
    url = Column(String(2083))  # URL of the SOAP endpointx
    description = Column(Text)  # URL of the SOAP endpointx
    siteinfo = Column(JSON)
    variables = Column(JSON)
    countries = Column(JSON)
    group_id = Column(Integer, ForeignKey('Group_Hydroserver_Individuals.id'))
    group = relationship("Groups", back_populates="hydroserver")  # Tile as given by the admin
    wms_layers = relationship("WMS_Layers", back_populates ="hs", cascade = "all,delete, delete-orphan" )
    
    #cascade="all, delete-orphan"
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __init__(self, title, url,description, siteinfo,variables,countries):
        self.title = title
        self.url = url
        self.description = description
        self.siteinfo = siteinfo
        self.variables = variables
        self.countries = countries

class WMS_Layers(Base):
    __tablename__ = 'WMS_Layers_Table'
    id = Column(Integer, primary_key=True)  # Record number.
    title = Column(String(1000))  # Tile as given by the admin
    services = Column(JSON)
    geometry = Column(JSON)
    hs_id = Column(Integer, ForeignKey('Hydroserver_Singular.id'))
    hs = relationship("HydroServer_Individual", back_populates="wms_layers") 
    #cascade="all, delete-orphan"
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __init__(self, title,services,geometry):
        self.title = title
        self.services = services
        self.geometry = geometry
