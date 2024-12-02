1. API 사용
chatbot/query/ 엔드포인트를 통해 챗봇과 상호작용할 수 있습니다. 요청은 POST 메서드를 사용하며, JSON 데이터를 전달해야 합니다.
요청 형식
{
    "query": "사용자가 묻는 질문",
    "session_id": "고유 세션 ID"
}
응답 형식
{
    "answer": "챗봇의 응답"
}

예제 요청
curl -X POST http://127.0.0.1:8000/chatbot/query/ \
-H "Content-Type: application/json" \
-d '{"query": "How do I register for classes?", "session_id": "12345"}'

예제 응답
{
    "answer": "You can register for classes through the university portal."
}

2. 백엔드 로직 내에서 사용
백엔드에서 Chatbot 클래스를 직접 호출하여 챗봇 기능을 사용할 수 있습니다.
예제
from Chatbot.chatbot import Chatbot

chatbot = Chatbot()
response = await chatbot.ainvoke("How do I register for classes?", "session123")
print(response)  # 챗봇 응답 출력
