import os
import http.server
import socketserver

os.chdir("./public")

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = 'index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


# Create an object of the above class
handler_object = MyHttpRequestHandler

PORT = (8081)
my_server = socketserver.TCPServer(("", PORT), handler_object)

print("Web server running on port " + str(PORT) + ".")

# Star the server
my_server.serve_forever()