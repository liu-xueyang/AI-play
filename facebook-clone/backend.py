import http.server
import socketserver
import json
import urllib.request
import urllib.error

PORT = 8000
# Assuming Ollama is running locally on default port 11434 with llama3 model installed
OLLAMA_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3"

class ChatHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data)
                user_message = data.get('message', '')
                
                # Try to call local Ollama running Llama3
                ai_response = self.call_ollama(user_message)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                response_data = json.dumps({"reply": ai_response})
                self.wfile.write(response_data.encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def call_ollama(self, prompt):
        data = {
            "model": DEFAULT_MODEL,
            "prompt": prompt,
            "stream": False
        }
        
        req = urllib.request.Request(
            OLLAMA_URL, 
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode('utf-8'))
                return result.get('response', "I couldn't generate a response.")
        except urllib.error.URLError:
            # Fallback if Ollama isn't running or Llama is not installed
            print("Warning: Could not connect to local Ollama instance.")
            return f"[Simulated Python Llama Reply] I received your message: '{prompt}'.\n\n(Note: To get real AI responses, please install Ollama and run 'ollama run llama3' in your terminal!)"

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), ChatHandler) as httpd:
        print(f"Python AI Backend serving at http://localhost:{PORT}")
        print("To use real Llama local model, ensure Ollama is installed and running `ollama run llama3`")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
