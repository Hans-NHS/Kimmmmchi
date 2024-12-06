# pdf_processor/forms.py
from django import forms

class PDFUploadForm(forms.Form):
    pdf_file = forms.FileField(label='Select PDF', required=True)
