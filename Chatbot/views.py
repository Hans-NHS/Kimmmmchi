from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .Chatbot.chatbot import Chatbot

chatbot = Chatbot()

@csrf_exempt
async def query(request):
  if request.method == "POST":
    try:
      data = json.loads(request.body)
      query = data.get("query")
      session_id = data.get("session_id")
      
      if not (query or session_id):
        return JsonResponse({"error": "Query is required."}, status=400)
      
      response = await chatbot.ainvoke(query, session_id)
      return JsonResponse({"answer": response}, status=200)
    except Exception as e:
      return JsonResponse({"error": str(e)}, status=500)
  else:
    return JsonResponse({"error": "Invalid request method."}, status=405)