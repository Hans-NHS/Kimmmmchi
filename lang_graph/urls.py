from django.urls import path
from .views import ask_chatbot

urlpatterns = [
    path("ask-chatbot/", ask_chatbot, name="ask_chatbot"),
]
