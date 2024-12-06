# pdf_processor/views.py
import pdfplumber
import json
from django.shortcuts import render
from django.http import JsonResponse
from .forms import PDFUploadForm

def extract_text_and_tables(pdf_file):
    with pdfplumber.open(pdf_file) as pdf:
        text = ""
        tables = []
        for page in pdf.pages:
            # Extract text from the page
            text += page.extract_text() or ""

            # Extract tables from the page
            table = page.extract_tables()
            if table:
                tables.append(table)

        return text, tables

def upload_pdf(request):
    if request.method == 'POST' and request.FILES['pdf_file']:
        form = PDFUploadForm(request.POST, request.FILES)
        if form.is_valid():
            pdf_file = request.FILES['pdf_file']
            text, tables = extract_text_and_tables(pdf_file)

            # Return extracted data as JSON
            response_data = {
                'text': text,
                'tables': tables
            }
            return JsonResponse(response_data)

    else:
        form = PDFUploadForm()

    return render(request, 'pdf_processor/upload_pdf.html', {'form': form})
