#!/usr/bin/env python3
"""
Meshy AI Asset Generator for Portfolio
Generate, Rig, and Export 3D Models & 3D Print files directly to public/models/
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse

API_BASE = "https://api.meshy.ai"
MESHY_API_KEY = os.environ.get("MESHY_API_KEY")

def check_env():
    if not MESHY_API_KEY:
        print("[!] Chave MESHY_API_KEY não encontrada no ambiente.")
        print("    Defina com: $env:MESHY_API_KEY='sua_chave_aqui' (PowerShell)")
        print("    Ou adicione ao arquivo .env no seu projeto.")
        return False
    return True

def api_request(endpoint, payload=None, method="GET"):
    url = f"{API_BASE}{endpoint}"
    headers = {
        "Authorization": f"Bearer {MESHY_API_KEY}",
        "Content-Type": "application/json",
    }
    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"[X] Erro na API Meshy ({e.code}): {e.read().decode('utf-8')}")
        sys.exit(1)

def get_balance():
    res = api_request("/openapi/v1/balance")
    print(f"[+] Saldo de créditos Meshy: {res.get('balance', 0)}")
    return res.get("balance", 0)

def generate_text_to_3d(prompt: str, art_style: str = "realistic"):
    print(f"[+] Iniciando geração 3D com o prompt: '{prompt}'...")
    payload = {
        "mode": "preview",
        "prompt": prompt,
        "art_style": art_style,
        "should_remesh": True,
    }
    create_res = api_request("/openapi/v2/text-to-3d", payload, method="POST")
    task_id = create_res.get("result")
    print(f"[+] Tarefa criada com ID: {task_id}")

    # Polling
    while True:
        status_res = api_request(f"/openapi/v2/text-to-3d/{task_id}")
        progress = status_res.get("progress", 0)
        status = status_res.get("status")
        print(f"[*] Progresso: {progress}% - Status: {status}")

        if status == "SUCCEEDED":
            model_urls = status_res.get("model_urls", {})
            glb_url = model_urls.get("glb")
            print(f"[✓] Modelo gerado com sucesso!")
            print(f"[+] URL GLB: {glb_url}")
            
            # Download to public/models/
            os.makedirs("public/models", exist_ok=True)
            output_path = os.path.join("public", "models", "meshy-generated.glb")
            urllib.request.urlretrieve(glb_url, output_path)
            print(f"[✓] Arquivo salvo em: {output_path}")
            return output_path
        elif status == "FAILED":
            print(f"[X] Falha na geração: {status_res.get('task_error', {}).get('message')}")
            sys.exit(1)

        time.sleep(5)

if __name__ == "__main__":
    print("===============================================")
    print("   Meshy 3D AI Generator - Portfolio Helper   ")
    print("===============================================")
    if check_env():
        get_balance()
        if len(sys.argv) > 1:
            prompt = " ".join(sys.argv[1:])
        else:
            prompt = "Futuristic cute cyberpunk robot assistant, glowing neon visor, carbon fiber armor"
        generate_text_to_3d(prompt)
