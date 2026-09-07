from io import BytesIO
from pathlib import Path

from fastapi import HTTPException
from pypdf import PdfReader
from docx import Document


# =========================================================
# PDF TEXT EXTRACTION
# =========================================================

def extract_text_from_pdf(content: bytes) -> str:

    try:
        reader = PdfReader(BytesIO(content))

        pages_text = []

        for page in reader.pages:

            text = page.extract_text()

            if text:
                pages_text.append(text)

        return "\n".join(pages_text).strip()

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to read PDF resume: {str(error)}"
        )


# =========================================================
# DOCX TEXT EXTRACTION
# =========================================================

def extract_text_from_docx(content: bytes) -> str:

    try:

        document = Document(BytesIO(content))

        paragraphs = []

        for paragraph in document.paragraphs:

            text = paragraph.text.strip()

            if text:
                paragraphs.append(text)

        return "\n".join(paragraphs).strip()

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to read DOCX resume: {str(error)}"
        )


# =========================================================
# GENERIC RESUME TEXT EXTRACTION
# =========================================================

def extract_resume_text(filename: str, content: bytes) -> str:
    """Extracts text from the uploaded resume bytes (nothing is written to disk)."""

    extension = Path(filename).suffix.lower()

    if extension == ".pdf":

        text = extract_text_from_pdf(content)

    elif extension == ".docx":

        text = extract_text_from_docx(content)

    elif extension == ".doc":

        raise HTTPException(
            status_code=400,
            detail=(
                "Old .doc files are not supported for AI extraction yet. "
                "Please upload the resume as PDF or DOCX."
            )
        )

    else:

        raise HTTPException(
            status_code=400,
            detail="Unsupported resume file format."
        )

    if not text.strip():

        raise HTTPException(
            status_code=400,
            detail=(
                "Could not extract readable text from this resume. "
                "Please upload a text-based PDF or DOCX file."
            )
        )

    return text