#!/usr/bin/env python3
"""
Ollama HTTP proxy — sits alongside the web server and proxies /api/ollama requests
to localhost:11434 (Ollama).

Add this to your web_server.py:

    import ollama_proxy
    proxy_handler = ollama_proxy.OllamaProxyHandler

And register it in the routing.

Or run independently on port 9999 and expose /api/ollama endpoint.
"""

import json
import urllib.request
import urllib.error
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading

OLLAMA_HOST = 'http://localhost:11434'
OLLAMA_ENDPOINT = '/api/generate'

class OllamaProxyHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != '/api/ollama':
            self.send_error(404)
            return

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        try:
            req_data = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
            return

        try:
            # Forward to Ollama
            ollama_url = OLLAMA_HOST + OLLAMA_ENDPOINT
            req = urllib.request.Request(
                ollama_url,
                data=json.dumps(req_data).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                resp_data = json.load(resp)

            # Send back to client
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(resp_data).encode('utf-8'))

        except urllib.error.URLError as e:
            msg = f'Ollama no responde en {OLLAMA_HOST}. ¿Está ejecutándose? (ollama serve). Detalle: {str(e)}'
            self.send_response(503)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': msg}).encode('utf-8'))
        except Exception as e:
            msg = f'Error interno: {str(e)}'
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': msg}).encode('utf-8'))

    def log_message(self, format, *args):
        # Suppress logs
        pass

def run_proxy_server(port=9999):
    """Run the proxy on a separate port (for debugging)."""
    server = HTTPServer(('localhost', port), OllamaProxyHandler)
    print(f'Ollama proxy running on http://localhost:{port}')
    server.serve_forever()

if __name__ == '__main__':
    run_proxy_server()
