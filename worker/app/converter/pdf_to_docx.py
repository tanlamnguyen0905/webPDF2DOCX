"""Convert PDF -> DOCX.

Dùng thư viện pdf2docx cho PDF dạng text. PDF scan cần OCR (xem ocr.py).
"""


def convert(input_pdf_path: str, output_docx_path: str) -> None:
    """Convert file PDF tại input_pdf_path sang DOCX tại output_docx_path.

    TODO: triển khai bằng pdf2docx:
        from pdf2docx import Converter
        cv = Converter(input_pdf_path)
        cv.convert(output_docx_path)
        cv.close()
    """
    raise NotImplementedError("TODO: triển khai convert PDF -> DOCX")
