import os
import json
import time
import requests
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ComfyUI Image Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COMFY_API_URL = os.getenv("COMFY_API_URL", "https://api.comfy.org/v1")
COMFY_API_KEY = os.getenv("COMFY_API_KEY", "")

# 10 Image Generation Presets
PRESETS = {
    "ghibli": "Studio Ghibli style, anime, lush vibrant landscapes, magical atmosphere, highly detailed, masterpiece, spirited away, totoro",
    "indian_cinema": "Bollywood cinema style, dramatic lighting, highly vibrant colors, cinematic shot, epic composition, high contrast, glamorous",
    "jojo_anime": "JoJo's Bizarre Adventure anime style, heavy black outlines, dynamic pose, highly colorful, intense expression, cel shaded",
    "cyberpunk": "Cyberpunk 2077 style, neon lights, futuristic city background, high contrast, sci-fi, glowing colors, dark atmosphere, 8k",
    "watercolor": "Ethereal watercolor painting, soft brush strokes, pastel colors, artistic, dreamy, fluid, masterpiece",
    "oil_painting": "Classical oil painting, impasto technique, textured brushstrokes, chiaroscuro, renaissance style, highly detailed",
    "pixel_art": "8-bit pixel art, retro gaming style, limited color palette, nostalgic, sharp edges, arcade aesthetic",
    "film_noir": "Film noir style, black and white, high contrast shadows, detective movie, dramatic lighting, 1940s aesthetic",
    "vintage_polaroid": "Vintage polaroid photo, faded colors, light leaks, 90s aesthetic, nostalgic, soft focus, retro film camera",
    "vaporwave": "Vaporwave aesthetic, neon pink and cyan, synthwave, 80s retro, digital grid, surreal, glitch art"
}

def get_headers():
    headers = {}
    if COMFY_API_KEY:
        headers["Authorization"] = f"Bearer {COMFY_API_KEY}"
    return headers

def upload_image_to_comfy(file_bytes: bytes, filename: str) -> str:
    """Uploads the image to ComfyUI and returns the file name."""
    url = f"{COMFY_API_URL}/upload/image"
    files = {"image": (filename, file_bytes, "image/png")}
    data = {"type": "input", "overwrite": "true"}
    
    response = requests.post(url, headers=get_headers(), files=files, data=data)
    if response.status_code == 200:
        return response.json().get("name")
        
    raise Exception(f"Failed to upload image: {response.text}")

def create_workflow(uploaded_filename: str, prompt_text: str):
    """Generates a standard Image-to-Image ComfyUI workflow JSON."""
    return {
        "3": {
            "inputs": {
                "seed": 1024,
                "steps": 20,
                "cfg": 8,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 0.75,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["8", 0]
            },
            "class_type": "KSampler"
        },
        "4": {
            "inputs": {
                "ckpt_name": "sd_xl_base_1.0.safetensors"
            },
            "class_type": "CheckpointLoaderSimple"
        },
        "6": {
            "inputs": {
                "text": prompt_text,
                "clip": ["4", 1]
            },
            "class_type": "CLIPTextEncode"
        },
        "7": {
            "inputs": {
                "text": "text, watermark, low quality, bad anatomy, ugly, deformed",
                "clip": ["4", 1]
            },
            "class_type": "CLIPTextEncode"
        },
        "8": {
            "inputs": {
                "pixels": ["9", 0],
                "vae": ["4", 2]
            },
            "class_type": "VAEEncode"
        },
        "9": {
            "inputs": {
                "image": uploaded_filename
            },
            "class_type": "LoadImage"
        },
        "10": {
            "inputs": {
                "samples": ["3", 0],
                "vae": ["4", 2]
            },
            "class_type": "VAEDecode"
        },
        "11": {
            "inputs": {
                "filename_prefix": "Generated",
                "images": ["10", 0]
            },
            "class_type": "SaveImage"
        }
    }

def queue_prompt(workflow: dict) -> str:
    # Send to ComfyUI
    url = f"{COMFY_API_URL}/prompt"
    payload = {"prompt": workflow}
    response = requests.post(url, headers=get_headers(), json=payload)
    
    if response.status_code == 200:
        return response.json().get("prompt_id")
        
    raise Exception(f"Failed to queue generation: {response.text}")

@app.get("/api/presets")
async def get_presets():
    return {"presets": list(PRESETS.keys())}

@app.post("/api/generate")
async def generate_image(file: UploadFile = File(...), preset: str = Form(...)):
    if preset not in PRESETS:
        raise HTTPException(status_code=400, detail="Invalid preset selected.")
        
    try:
        file_bytes = await file.read()
        
        # 1. Upload Image
        uploaded_filename = upload_image_to_comfy(file_bytes, file.filename)
        
        # 2. Build Workflow
        prompt_text = PRESETS[preset]
        workflow = create_workflow(uploaded_filename, prompt_text)
        
        # 3. Queue Prompt
        run_id = queue_prompt(workflow)
        
        # In a real production app, you would poll the run_id status and return the final image URL.
        # For this setup, we return the run_id so the frontend can handle polling or notify the user.
        return {
            "status": "queued",
            "run_id": run_id,
            "message": "Image generation queued successfully.",
            "preset_used": preset
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status/{run_id}")
async def check_status(run_id: str):
    try:
        # Comfy Cloud uses /jobs/{prompt_id}
        url = f"{COMFY_API_URL}/jobs/{run_id}"
        response = requests.get(url, headers=get_headers())
        
        if response.status_code == 200:
            data = response.json()
            status = data.get("status", "")
            
            if status == "completed":
                # Extract image from outputs
                outputs = data.get("outputs", {})
                for node_id, output in outputs.items():
                    if "images" in output:
                        img = output["images"][0]
                        filename = img.get("filename")
                        subfolder = img.get("subfolder", "")
                        img_type = img.get("type", "output")
                        # Return proxy URL so the browser doesn't need to send the auth header
                        image_url = f"http://localhost:8000/api/image?filename={filename}&subfolder={subfolder}&type={img_type}"
                        return {"status": "success", "image_url": image_url}
                        
                return {"status": "success", "image_url": None}

            elif status in ("failed", "error"):
                return {"status": "failed"}
            
            # still running (queued, running, etc.)
            return {"status": "running"}
            
        raise Exception(f"Failed to check status: {response.status_code} {response.text}")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/image")
async def proxy_image(filename: str, subfolder: str = "", type: str = "output"):
    """Proxy endpoint to fetch images from cloud.comfy.org (avoids CORS + auth issues in browser)."""
    url = f"{COMFY_API_URL}/view?filename={filename}&subfolder={subfolder}&type={type}"
    response = requests.get(url, headers=get_headers(), stream=True)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch image")
    return StreamingResponse(
        response.iter_content(chunk_size=8192),
        media_type=response.headers.get("content-type", "image/png")
    )
