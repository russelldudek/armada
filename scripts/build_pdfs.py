from pathlib import Path
from weasyprint import HTML

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DOCS.mkdir(exist_ok=True)

MAPPING = {
    "resume.html": "Russell-Dudek-ARMADA-Resume.pdf",
    "cover-letter.html": "Russell-Dudek-ARMADA-Cover-Letter.pdf",
    "interview-brief.html": "Russell-Dudek-ARMADA-Interview-Brief.pdf",
    "90-day-plan.html": "Russell-Dudek-ARMADA-90-Day-Plan.pdf",
    "outcome-cross-dock.html": "Russell-Dudek-ARMADA-Outcome-Cross-Dock.pdf",
    "sources.html": "Russell-Dudek-ARMADA-Public-Source-Notes.pdf",
}

for source, target in MAPPING.items():
    HTML(filename=str(ROOT / source), base_url=str(ROOT)).write_pdf(str(DOCS / target))
    print(f"generated {target}")
