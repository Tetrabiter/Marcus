import json
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import mlflow

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/chat"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "OK", "message": "Server is running"}


@app.get("/api/interview")
async def interview(request: Request, prompt: str = None):
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    print(f"📨 Получен запрос: {prompt}")

    async def event_stream():
        async with httpx.AsyncClient(timeout=None) as client:
            try:
                async with client.stream(
                    "POST",
                    "http://localhost:11434/api/generate",
                    json={
                        "model": "codellama:13b",
                        "prompt": prompt,
                        "stream": True,
                    },
                ) as resp:
                    if resp.status_code != 200:
                        yield f"data: {{\"error\": \"Ollama response error: {resp.status_code}\"}}\n\n"
                        return

                    async for chunk in resp.aiter_text():
                        chunk = chunk.strip()
                        if not chunk:
                            continue
                        try:
                            data = json.loads(chunk)
                            # Отправляем только содержимое "response"
                            if "response" in data and not data.get("done", False):
                                yield f"data: {data['response']}\n\n"
                            elif data.get("done", False):
                                yield "data: [DONE]\n\n"
                        except json.JSONDecodeError:
                            # Если по каким-то причинам не JSON — пропускаем
                            continue

                        if await request.is_disconnected():
                            print("❌ Клиент отключился")
                            return
            except Exception as e:
                yield f"data: {{\"error\": \"{str(e)}\"}}\n\n"

    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
    }

    return StreamingResponse(event_stream(), media_type="text/event-stream", headers=headers)


# MLFlow

mlflow.set_tracking_uri("sqlite:///mlflow.db")  # maybe server idk

@app.post("/mlflow/start_run")
def start_run(run_name: str):
    with mlflow.start_run(run_name=run_name) as run:
        return {"run_id": run.info.run_id}

@app.post("/mlflow/log_metric")
def log_metric(run_id: str, key: str, value: float):
    mlflow.start_run(run_id=run_id)
    mlflow.log_metric(key, value)
    mlflow.end_run()
    return {"status": "ok"}

@app.post("/mlflow/log_param")
def log_param(run_id: str, key: str, value: str):
    mlflow.start_run(run_id=run_id)
    mlflow.log_param(key, value)
    mlflow.end_run()
    return {"status": "ok"}