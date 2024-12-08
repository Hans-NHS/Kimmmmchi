from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.shortcuts import render

import asyncio
import json

from lang_graph.Chatbot.chatbot import Chatbot  # Import the Chatbot class
chatbot = Chatbot()  # Initialize the chatbot instance

@csrf_exempt
def ask_chatbot(request):
    if request.method == "POST":
        try:
            # Parse the request body
            data = json.loads(request.body)
            query = data.get("query", "")
            session_id = data.get("session_id", "default_session")

            # Run the chatbot query asynchronously
            response = asyncio.run(chatbot.ainvoke(query, session_id))
            
            return JsonResponse({"response": response}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)
