import os
import io
import json
import re
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from google import genai
from google.genai import types

# --- 1. SETUP ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("⚠️  WARNING: GEMINI_API_KEY not set. AI features will fail.")

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL = "gemini-2.5-flash-lite"

app = FastAPI(title="LunaFlow API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. DATA MODELS ---
class DailyPlanRequest(BaseModel):
    phase: str
    phaseIndex: int
    dayOfCycle: int
    pcosType: Optional[str] = "General"
    name: str
    symptoms: List[str] = []

class ChatMessage(BaseModel):
    role: str   # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    name: str
    phase: str
    dayOfCycle: int
    pcosType: Optional[str] = "General"
    symptoms: List[str] = []
    history: List[ChatMessage] = []

# --- 3. HELPERS ---
def safe_parse_json(text: str) -> dict:
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        text = match.group(1).strip()
    return json.loads(text)

# --- 4. PROMPTS ---
NUTRITIONIST_PROMPT = """
You are the AI engine for 'LunaFlow', a premium PCOS management app.
User: {name}
Cycle Phase: {phase} (Day {day})
PCOS Type: {pcos_type}
Logged Symptoms: {symptoms}

Analyze the symptoms and phase carefully.
CRITICAL: If symptoms include "Period Ended Today", acknowledge the transition to follicular phase.

Return ONLY valid JSON (no markdown fences, no extra text):
{{
  "insight": "2-3 warm empathetic sentences addressing {name} directly, validating how they feel and what to focus on today.",
  "diet": "One specific Indian meal or snack that directly addresses their symptoms, with a brief reason why.",
  "movement": "One workout or movement suggestion suitable for their energy level today.",
  "mindfulness": "One self-care or mental health practice based on their mood/stress today."
}}
"""

SCANNER_PROMPT = """
You are the LunaFlow nutrition AI.
Analyze this food image for a woman with PCOS in her {phase} phase.
Consider: insulin spikes, inflammation, hormonal balance.

Return ONLY valid JSON (no markdown fences, no extra text):
{{
  "status": "safe",
  "food_name": "Name of the food identified",
  "reason": "1-2 sentences on why this food helps or hurts PCOS in the {phase} phase.",
  "nutrients": {{
    "Sugar": "Low / Moderate / High",
    "Protein": "Low / Moderate / High",
    "Fiber": "Low / Moderate / High"
  }}
}}

"status" must be: "safe", "caution", or "avoid".
"""

LUNA_SYSTEM = """You are Luna 🌙, the warm and knowledgeable AI health companion inside LunaFlow — a PCOS cycle management app.

About the user right now:
- Name: {name}
- Current phase: {phase} (Day {day} of cycle)  
- PCOS Type: {pcos_type}
- Today's logged symptoms: {symptoms}

Your personality:
- Warm, empathetic, and supportive — like a knowledgeable friend
- Evidence-based but never clinical or cold
- Focused on PCOS, menstrual health, nutrition, movement, and mental wellness
- Keep responses concise (2-4 sentences) unless the user asks for detail
- Use a relevant emoji occasionally to keep tone friendly
- Never diagnose or replace medical advice — always suggest consulting a doctor for serious concerns

If the user asks about their daily plan, diet, movement, or mindfulness — give personalized advice based on their phase and symptoms.
"""

# --- 5. ENDPOINTS ---

@app.get("/")
async def root():
    return {"status": "LunaFlow API running 🌙", "model": MODEL}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/generate-daily-plan")
async def generate_plan(request: DailyPlanRequest):
    try:
        symptoms_text = (
            ", ".join(request.symptoms) if request.symptoms
            else "No symptoms logged yet."
        )
        prompt = NUTRITIONIST_PROMPT.format(
            name=request.name,
            phase=request.phase,
            day=request.dayOfCycle,
            pcos_type=request.pcosType or "General",
            symptoms=symptoms_text,
        )
        response = await client.aio.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            ),
        )
        return safe_parse_json(response.text)

    except json.JSONDecodeError as e:
        print(f"JSON parse error (Daily Plan): {e}\nRaw: {response.text[:300]}")
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        print(f"ERROR (Daily Plan): {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat_with_luna(request: ChatRequest):
    try:
        symptoms_text = (
            ", ".join(request.symptoms) if request.symptoms
            else "None logged today."
        )
        system_context = LUNA_SYSTEM.format(
            name=request.name,
            phase=request.phase,
            day=request.dayOfCycle,
            pcos_type=request.pcosType or "General",
            symptoms=symptoms_text,
        )

        # Build full conversation string
        conversation_parts = [system_context, "---"]
        for msg in request.history[-12:]:  # keep last 12 messages for context
            prefix = "User" if msg.role == "user" else "Luna"
            conversation_parts.append(f"{prefix}: {msg.content}")
        conversation_parts.append(f"User: {request.message}")
        conversation_parts.append("Luna:")

        full_prompt = "\n\n".join(conversation_parts)

        response = await client.aio.models.generate_content(
            model=MODEL,
            contents=full_prompt,
        )
        reply = response.text.strip()
        # Remove "Luna:" prefix if model echoed it
        if reply.lower().startswith("luna:"):
            reply = reply[5:].strip()

        return {"reply": reply}

    except Exception as e:
        print(f"ERROR (Chat): {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/scan-food")
async def scan_food(phase: str, file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        img_bytes = await file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        prompt = SCANNER_PROMPT.format(phase=phase)

        response = await client.aio.models.generate_content(
            model=MODEL,
            contents=[prompt, img],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            ),
        )
        return safe_parse_json(response.text)

    except HTTPException:
        raise
    except json.JSONDecodeError as e:
        print(f"JSON parse error (Scanner): {e}\nRaw: {response.text[:300]}")
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        print(f"ERROR (Scanner): {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)