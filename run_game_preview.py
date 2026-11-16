import http.server
import socketserver
import os
import re
import socket

def find_available_port(start_port=8080):
    for port in range(start_port, start_port + 20):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", port))
                return port
        except OSError:
            continue
    return start_port

PORT = find_available_port(8080)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "src", "main", "resources", "templates")
STATIC_DIR = os.path.join(BASE_DIR, "src", "main", "resources", "static")

class GameHttpHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Route trang chủ hoặc /game -> render template index.html
        if self.path in ["/", "/game"]:
            index_path = os.path.join(TEMPLATES_DIR, "index.html")
            if os.path.exists(index_path):
                with open(index_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Mock Thymeleaf expressions để chạy độc lập không cần Spring Boot
                content = content.replace('th:text="${gameTitle}"', '')
                content = content.replace('<title th:text="${gameTitle}">Sinh Viên Lén Lút - Sneaky Student</title>', '<title>Sinh Viên Lén Lút - Sneaky Student</title>')
                content = re.sub(r'th:href="@{/(.*?)}"', r'href="/\1"', content)
                content = re.sub(r'th:src="@{/(.*?)}"', r'src="/\1"', content)
                content = content.replace('/*[[${targetTimeSeconds}]]*/ 180', '180')
                
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(content.encode("utf-8"))
                return
            else:
                self.send_error(404, "index.html not found")
                return

        # Phục vụ static files (/css/..., /js/..., /images/...)
        clean_path = self.path.lstrip("/").split("?")[0]
        file_path = os.path.join(STATIC_DIR, clean_path)

        if os.path.isfile(file_path):
            self.send_response(200)
            if file_path.endswith(".css"):
                self.send_header("Content-Type", "text/css; charset=utf-8")
            elif file_path.endswith(".js"):
                self.send_header("Content-Type", "application/javascript; charset=utf-8")
            elif file_path.endswith(".png"):
                self.send_header("Content-Type", "image/png")
            elif file_path.endswith(".svg"):
                self.send_header("Content-Type", "image/svg+xml; charset=utf-8")
            else:
                self.send_header("Content-Type", "application/octet-stream")
            self.end_headers()
            with open(file_path, "rb") as f:
                self.wfile.write(f.read())
            return

        self.send_error(404, "File Not Found")

print(f"============================================================")
print(f" Web Minigame: SINH VIEN LEN LUT (SNEAKY STUDENT) DANG CHAY!")
print(f" Link truy cap: http://localhost:{PORT}")
print(f" Nhan Ctrl+C de dung server.")
print(f"============================================================")

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(("127.0.0.1", PORT), GameHttpHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung server.")
