"""
COG Kerala AI Chatbot Backend
FastAPI + Anthropic Claude API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import anthropic
import json
import os

app = FastAPI(title="COG Kerala AI Chatbot", version="1.0.0")

# CORS - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

# ─────────────────────────────────────────────
# COG Kerala System Prompt
# ─────────────────────────────────────────────
COG_SYSTEM_PROMPT = """You are the official AI assistant for the Church of God (Full Gospel) in India — Kerala State. 
You are warm, helpful, knowledgeable about the church, and speak in a friendly, pastoral tone.

KEY FACTS ABOUT COG KERALA:
- Full name: Church of God (Full Gospel) in India — Kerala State
- State Overseer: Rev. Y. Reji (based at Zion Hills, Chengannur)
- Headquarters: Zion Hills, Chengannur, Kerala, India
- Email: cogkeralastate@gmail.com
- Website: cogkerala.org
- International affiliation: Church of God International, Cleveland, Tennessee, USA
- Founded internationally: 1886 (by R.G. Spurling)
- Present in: 194 nations worldwide with 9.2 million members
- Kerala churches: 1,200+ local churches
- Kerala ministers: 1,500+ ordained/licensed ministers
- Districts: All 14 revenue districts of Kerala
- Bible Seminaries: Mount Zion Bible Seminary (Chengannur), Kumbanad Bible College, Kannur Bible College
- Annual convention: 102nd State Convention held in 2025
- Mission: FINISH Commission (Find, Intercede, Network, Invest, Send, Harvest)
- Key verse: Matthew 28:19

DEPARTMENTS:
1. Pastoral Counselling - healing, restoration, family support
2. Biblical Education - three seminaries training ministers
3. Ladies Ministry - women's fellowship, prayer, charity
4. Youth Ministry (YPE - Young People's Endeavour) - youth evangelism, camps
5. Sunday School - children's Bible education
6. Evangelism - outreach across Kerala
7. Charity & Relief - community service
8. Mission Board - domestic and international missions
9. Literature & Media - publications, media ministry

DECLARATION OF FAITH (6 Pillars):
1. Holy Bible - inspired, infallible Word of God
2. Holy Trinity - Father, Son, Holy Spirit
3. Salvation by Grace - through faith in Jesus Christ
4. Water Baptism - by immersion
5. Holy Spirit Baptism - evidenced by speaking in tongues (Acts 2:4)
6. Divine Healing & Second Coming of Christ

STATE COUNCIL (selected members):
- Rev. Y. Reji - State Overseer
- Ps. Shaji M Sakaria - Council Secretary
- Ps. Vinod Jacob - Council Treasurer
- Ps. M A Thomaskutty - Joint Secretary
- And 11 more council members

INTERNATIONAL LEADERSHIP:
- Dr. Gary J. Lewis - General Overseer (24th, elected 2024)
- Dr. M. Thomas Propes - World Mission Director
- Dr. David E Ramirez - Assistant Director
- Rev. Andrew Binda - Field Director Asia Pacific
- Rev. C C Thomas - South Asian Superintendent
- Rev. Ken Anderson - International UPG Director

HISTORY:
- Kerala has heard the Gospel since A.D. 52
- Missionary Robert F. Cook established Full Gospel Church in India (early 1900s)
- 1907: Azusa Street revival expanded Pentecostal fire worldwide
- Kerala has 337 lakh population, 14 districts, 63 taluks, 1,479 revenue villages

GUIDELINES:
- Always be warm, respectful, and pastoral in tone
- For prayer requests, acknowledge them with compassion and offer to pray
- For ministry inquiries, direct to cogkeralastate@gmail.com
- For finding a local church, direct to cogkerala.org
- For urgent pastoral needs, emphasize calling the state office
- You can share Bible verses relevant to questions
- Don't make up specific phone numbers or addresses beyond what's provided
- If asked about topics outside COG Kerala, gently redirect to how the church can help
- Always end responses with encouragement or a blessing when appropriate
- Keep responses concise but warm - 2-4 sentences usually suffices
- For complex theology, give biblically grounded Pentecostal answers consistent with COG doctrine"""

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    stream: Optional[bool] = False

class ChatResponse(BaseModel):
    reply: str
    tokens_used: Optional[int] = None

# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "COG Kerala AI Chatbot is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "COG Kerala Chatbot Backend"}

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Non-streaming chat endpoint"""
    try:
        messages = [{"role": m.role, "content": m.content} for m in req.messages]
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            system=COG_SYSTEM_PROMPT,
            messages=messages,
        )
        
        reply = response.content[0].text
        tokens = response.usage.input_tokens + response.usage.output_tokens
        
        return ChatResponse(reply=reply, tokens_used=tokens)
    
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid API key")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again shortly.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    """Streaming chat endpoint"""
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    
    def generate():
        try:
            with client.messages.stream(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                system=COG_SYSTEM_PROMPT,
                messages=messages,
            ) as stream:
                for text in stream.text_stream:
                    yield f"data: {json.dumps({'text': text})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/quick-reply")
async def quick_reply(req: dict):
    """Quick predefined replies for common questions"""
    topic = req.get("topic", "").lower()
    
    quick_responses = {
        "about": "Church of God (Full Gospel) in India — Kerala State has **1,200+ local churches** and **1,500+ ministers** across all 14 districts. Led by State Overseer **Rev. Y. Reji**, headquartered at Zion Hills, Chengannur. Part of COG International, present in **194 nations** worldwide. 🙏",
        "join": "We'd love to welcome you! With 1,200+ churches across Kerala, there's definitely one near you. Visit **cogkerala.org** to find your nearest assembly, or email **cogkeralastate@gmail.com** and we'll help connect you. God bless! 🏛️",
        "events": "Our **102nd State Convention** was held in 2025! Annual district conventions, YPE camps, Ladies Ministry gatherings, and Sunday School events happen throughout the year. Visit **cogkerala.org** or email **cogkeralastate@gmail.com** for the latest schedule. ✝️",
        "contact": "📍 **Zion Hills, Chengannur, Kerala**\n✉️ **cogkeralastate@gmail.com**\n🌐 **cogkerala.org**\n🏛️ **churchofgod.org** (International)",
        "prayer": "We believe deeply in the power of prayer! Send your prayer request to **cogkeralastate@gmail.com** and our prayer team will intercede for you. *'The prayer of a righteous person is powerful and effective.'* — James 5:16 🙏",
        "beliefs": "The Church of God stands on **6 pillars**: (1) The Holy Bible, (2) The Holy Trinity, (3) Salvation by Grace, (4) Water Baptism, (5) Holy Spirit Baptism with evidence of tongues, and (6) Divine Healing & Second Coming of Christ. ✦",
    }
    
    for key, response in quick_responses.items():
        if key in topic:
            return {"reply": response, "quick": True}
    
    return {"reply": None, "quick": False}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)