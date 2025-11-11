"""
Constants for AV Calculator

Service codes, metal tiers, and configuration parameters.
"""

from typing import Dict, List

# Metal tiers
METAL_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum']

# Metal tier AV ranges (de minimis variation)
METAL_TIER_RANGES: Dict[str, tuple[float, float]] = {
    'Platinum': (0.88, 0.92),  # 88% - 92%
    'Gold': (0.78, 0.82),      # 78% - 82%
    'Silver': (0.68, 0.72),    # 68% - 72%
    'Bronze': (0.58, 0.62),    # 58% - 62% (standard), 56%-65% (expanded)
}

# Medical service codes (14 services)
MEDICAL_SERVICES: List[str] = [
    'ER',      # Emergency Room
    'IP',      # Inpatient Hospital
    'PC',      # Primary Care
    'SP',      # Specialist
    'PSY',     # Mental Health / Substance Abuse
    'IMG',     # Imaging (CT/MRI/PET)
    'ST',      # Speech Therapy
    'OT',      # Occupational/Physical Therapy
    'PREV',    # Preventive Care
    'LAB',     # Laboratory
    'XRAY',    # X-rays
    'SNF',     # Skilled Nursing Facility
    'OPFAC',   # Outpatient Facility
    'OPPROF',  # Outpatient Professional
]

# Drug service codes (4 tiers)
DRUG_SERVICES: List[str] = [
    'RXGEN',      # Generic Drugs
    'RXFORM',     # Preferred Brand
    'RXNONFORM',  # Non-Preferred Brand
    'RXSPCLTY',   # Specialty Drugs
]

# All service codes
ALL_SERVICES: List[str] = MEDICAL_SERVICES + DRUG_SERVICES

# Continuance table types
TABLE_TYPES: List[str] = ['med', 'rx', 'combined']

# Convergence parameters
MAX_ITERATIONS = 200
TOLERANCE = 0.01
COINSURANCE_DAMPING = 0.5

# 2026 Federal limits
FEDERAL_MOOP_INDIVIDUAL = 10600
FEDERAL_MOOP_FAMILY = 21200

# Continuance table column names
CORE_COLUMNS = [
    'Up To',
    'Percent of Enrollees',
    "Avg. Cost per Enrollee (Max'd)",
    "Avg. Cost per Enrollee (Bucket)",
]

# Service column name mapping (from table to code)
SERVICE_COLUMN_MAPPING: Dict[str, str] = {
    'ER': 'ER',
    'IP': 'IP',
    'Primary Care': 'PC',
    'Specialist': 'SP',
    'Mental Health and Substance Use Disorder': 'PSY',
    'Imaging': 'IMG',
    'Speech Therapy': 'ST',
    'Occupational + Physical Therapy': 'OT',
    'Preventive Care': 'PREV',
    'Laboratory': 'LAB',
    'X-rays - Combined': 'XRAY',
    'SNF': 'SNF',
    'OP Facility': 'OPFAC',
    'OP Professional': 'OPPROF',
    'Generics': 'RXGEN',
    'Preferred Brand': 'RXFORM',
    'Non-Preferred Brand': 'RXNONFORM',
    'Specialty': 'RXSPCLTY',
}

# Default service parameters
DEFAULT_SERVICE_PARAMS = {
    'copay': 0.0,
    'coinsurance': None,  # Use plan coinsurance if None
    'subject_to_deductible': True,
    'subject_to_coinsurance': True,
}

# Preventive care special rules (ACA mandated)
PREVENTIVE_CARE_RULES = {
    'copay': 0.0,
    'coinsurance': 0.0,
    'subject_to_deductible': False,
    'subject_to_coinsurance': False,
}
