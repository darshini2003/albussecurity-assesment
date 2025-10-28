from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sqlite3
import os

app = FastAPI(title="Bug Bounty Recon Dashboard API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DB_PATH = "recon.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Programs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS programs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            platform TEXT NOT NULL,
            scope TEXT,
            max_bounty REAL,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Targets table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS targets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            program_id INTEGER NOT NULL,
            domain TEXT NOT NULL,
            ip_address TEXT,
            tech_stack TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (program_id) REFERENCES programs (id)
        )
    """)
    
    # Vulnerabilities table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vulnerabilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            severity TEXT NOT NULL,
            vulnerability_type TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'draft',
            bounty_amount REAL,
            reported_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (target_id) REFERENCES targets (id)
        )
    """)
    
    conn.commit()
    conn.close()

# Initialize database on startup
@app.on_event("startup")
async def startup():
    init_db()

# Pydantic models
class ProgramCreate(BaseModel):
    name: str
    platform: str
    scope: Optional[str] = None
    max_bounty: Optional[float] = None
    status: str = "active"

class Program(ProgramCreate):
    id: int
    created_at: str

class TargetCreate(BaseModel):
    program_id: int
    domain: str
    ip_address: Optional[str] = None
    tech_stack: Optional[str] = None
    notes: Optional[str] = None

class Target(TargetCreate):
    id: int
    created_at: str

class VulnerabilityCreate(BaseModel):
    target_id: int
    title: str
    severity: str
    vulnerability_type: str
    description: Optional[str] = None
    status: str = "draft"
    bounty_amount: Optional[float] = None
    reported_at: Optional[str] = None

class Vulnerability(VulnerabilityCreate):
    id: int
    created_at: str

class Stats(BaseModel):
    total_programs: int
    total_targets: int
    total_vulnerabilities: int
    total_bounties: float

# Helper function to get db connection
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Bug Bounty Recon Dashboard API", "status": "running"}

# Programs endpoints
@app.get("/api/programs", response_model=List[Program])
async def get_programs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM programs ORDER BY created_at DESC")
    programs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return programs

@app.post("/api/programs", response_model=Program)
async def create_program(program: ProgramCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO programs (name, platform, scope, max_bounty, status) VALUES (?, ?, ?, ?, ?)",
        (program.name, program.platform, program.scope, program.max_bounty, program.status)
    )
    conn.commit()
    program_id = cursor.lastrowid
    cursor.execute("SELECT * FROM programs WHERE id = ?", (program_id,))
    new_program = dict(cursor.fetchone())
    conn.close()
    return new_program

@app.delete("/api/programs/{program_id}")
async def delete_program(program_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM programs WHERE id = ?", (program_id,))
    conn.commit()
    conn.close()
    return {"message": "Program deleted successfully"}

# Targets endpoints
@app.get("/api/targets", response_model=List[Target])
async def get_targets(program_id: Optional[int] = None):
    conn = get_db()
    cursor = conn.cursor()
    if program_id:
        cursor.execute("SELECT * FROM targets WHERE program_id = ? ORDER BY created_at DESC", (program_id,))
    else:
        cursor.execute("SELECT * FROM targets ORDER BY created_at DESC")
    targets = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return targets

@app.post("/api/targets", response_model=Target)
async def create_target(target: TargetCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO targets (program_id, domain, ip_address, tech_stack, notes) VALUES (?, ?, ?, ?, ?)",
        (target.program_id, target.domain, target.ip_address, target.tech_stack, target.notes)
    )
    conn.commit()
    target_id = cursor.lastrowid
    cursor.execute("SELECT * FROM targets WHERE id = ?", (target_id,))
    new_target = dict(cursor.fetchone())
    conn.close()
    return new_target

@app.delete("/api/targets/{target_id}")
async def delete_target(target_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM targets WHERE id = ?", (target_id,))
    conn.commit()
    conn.close()
    return {"message": "Target deleted successfully"}

# Vulnerabilities endpoints
@app.get("/api/vulnerabilities", response_model=List[Vulnerability])
async def get_vulnerabilities(target_id: Optional[int] = None):
    conn = get_db()
    cursor = conn.cursor()
    if target_id:
        cursor.execute("SELECT * FROM vulnerabilities WHERE target_id = ? ORDER BY created_at DESC", (target_id,))
    else:
        cursor.execute("SELECT * FROM vulnerabilities ORDER BY created_at DESC")
    vulnerabilities = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return vulnerabilities

@app.post("/api/vulnerabilities", response_model=Vulnerability)
async def create_vulnerability(vulnerability: VulnerabilityCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO vulnerabilities 
        (target_id, title, severity, vulnerability_type, description, status, bounty_amount, reported_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (vulnerability.target_id, vulnerability.title, vulnerability.severity, 
         vulnerability.vulnerability_type, vulnerability.description, vulnerability.status,
         vulnerability.bounty_amount, vulnerability.reported_at)
    )
    conn.commit()
    vuln_id = cursor.lastrowid
    cursor.execute("SELECT * FROM vulnerabilities WHERE id = ?", (vuln_id,))
    new_vuln = dict(cursor.fetchone())
    conn.close()
    return new_vuln

@app.put("/api/vulnerabilities/{vuln_id}", response_model=Vulnerability)
async def update_vulnerability(vuln_id: int, vulnerability: VulnerabilityCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """UPDATE vulnerabilities 
        SET target_id=?, title=?, severity=?, vulnerability_type=?, description=?, 
        status=?, bounty_amount=?, reported_at=?
        WHERE id=?""",
        (vulnerability.target_id, vulnerability.title, vulnerability.severity,
         vulnerability.vulnerability_type, vulnerability.description, vulnerability.status,
         vulnerability.bounty_amount, vulnerability.reported_at, vuln_id)
    )
    conn.commit()
    cursor.execute("SELECT * FROM vulnerabilities WHERE id = ?", (vuln_id,))
    updated_vuln = dict(cursor.fetchone())
    conn.close()
    return updated_vuln

@app.delete("/api/vulnerabilities/{vuln_id}")
async def delete_vulnerability(vuln_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM vulnerabilities WHERE id = ?", (vuln_id,))
    conn.commit()
    conn.close()
    return {"message": "Vulnerability deleted successfully"}

# Stats endpoint
@app.get("/api/stats", response_model=Stats)
async def get_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as count FROM programs")
    total_programs = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) as count FROM targets")
    total_targets = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) as count FROM vulnerabilities")
    total_vulnerabilities = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COALESCE(SUM(bounty_amount), 0) as total FROM vulnerabilities")
    total_bounties = cursor.fetchone()["total"]
    
    conn.close()
    
    return {
        "total_programs": total_programs,
        "total_targets": total_targets,
        "total_vulnerabilities": total_vulnerabilities,
        "total_bounties": total_bounties
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
