# pdf_processor/views.py
import pdfplumber
import requests
import json
from django.shortcuts import render
from django.http import JsonResponse
from .forms import PDFUploadForm
from core.supabase_utils import update_data
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def extract_text_and_tables(pdf_file, user_id):
    try:
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

            # Prepare the extracted data as a JSON object
            extracted_data = {
                'text': text,
                'tables': tables
            }

            # Prepare the data to update in Supabase
            data_to_update = {
                '과목이수표': extracted_data,  # Insert the extracted data (JSON)
            }

            # Call update_data to update the record with the given user_id
            updated_data = update_data('users', user_id, data_to_update)

            # Check if the update was successful
            if not updated_data:
                return JsonResponse({'status': 'error', 'message': 'Failed to update data in Supabase'}, status=500)
            
            # # Simulate a request to the ask_chatbot view with the extracted data as context
            # chatbot_payload = {
            #     'query': "Refer to the extracted 과목이수표 data for future queries.",
            #     'session_id': user_id,
            #     'context_data': extracted_data  # Pass the extracted data as context
            # }

            # # Make a POST request to the ask_chatbot view
            # chatbot_response = requests.post(
            #     'http://127.0.0.1:8000/lang_graph/ask-chatbot/',  # Replace with the correct URL of ask_chatbot
            #     json=chatbot_payload
            # )

            # # Check if the chatbot request was successful
            # if chatbot_response.status_code != 200:
            #     return JsonResponse({'status': 'error', 'message': f"Chatbot error: {chatbot_response.json().get('error', 'Unknown error')}"}, status=500)


            return JsonResponse({'status': 'success', 'message': 'Data uploaded successfully', 'data': updated_data})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error processing PDF: {str(e)}"}, status=500)

@csrf_exempt
def upload_pdf(request):
    if request.method == 'POST':
        form = PDFUploadForm(request.POST, request.FILES)
        user_id = request.POST.get('user_id')  # Get user_id from the POST request

        if not user_id:
            return JsonResponse({'status': 'error', 'message': 'Missing user_id'}, status=400)

        if form.is_valid() and 'pdf_file' in request.FILES:
            pdf_file = request.FILES['pdf_file']

            # Extract text and tables with the provided user_id
            response = extract_text_and_tables(pdf_file, user_id)

            # Check if the response is a JsonResponse with a 'status' key
            if isinstance(response, JsonResponse):
                return response  # Return the JsonResponse directly from extract_text_and_tables

            # In case the response is not a JsonResponse, handle the unexpected scenario
            return JsonResponse({'status': 'error', 'message': 'Unexpected response format'}, status=500)

    else:
        form = PDFUploadForm()

    return render(request, 'pdf_processor/upload_pdf.html', {'form': form})
