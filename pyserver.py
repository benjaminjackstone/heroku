from http.server import BaseHTTPRequestHandler, HTTPServer
from bank import *
from urllib.parse import urlparse, parse_qs


class BankServer (BaseHTTPRequestHandler):

    def m200(self):
        # CORS header
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', ' * ')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

    def m201(self):
        # CORS header
        self.send_response(201)
        self.send_header('Access-Control-Allow-Origin', ' * ')
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        length = int(self.headers['Content-Length'])
        return length

    def m204(self):
        # CORS header
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', ' * ')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

    def m404(self, code, message):
        self.send_response(code)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
        self.wfile.write(bytes("<p> "+message+" </p>", "utf-8", ))

    def parseData(self, length):
        data = self.rfile.read(length).decode("utf-8")
        print(data)
        parsed_data = parse_qs(data)
        return parsed_data, len(parsed_data)

    def do_GET(self):
        bank = Bank()
        if self.path.startswith("/customers/"):
            json_data = bank.getCustomerInfo(self.path)
            if json_data != '[]':
                self.m200()
                self.wfile.write(bytes(json_data, "utf-8"))
                return
            self.m404(404, "No resource found")
        elif self.path.startswith("/customers"):
            self.m200()
            json_data = bank.getAllCustomers()
            self.wfile.write(bytes(json_data, "utf-8"))
        else:
            self.m404(404, "Not Found")


    def do_POST(self):
        bank = Bank()
        if self.path.startswith("/customers/"):
            self.m404(404, "Can't post to resource.")
            return
        elif self.path.startswith("/customers"):
            length = self.m201()
            data, count = self.parseData(length)
            if count < 6:
                self.m404(404, "Missing fields")
                return
            bank.insertCustomer(data)
        else:
            self.m404(404, "Not found")

    def do_PUT(self): #update or replace
        bank = Bank()
        if self.path.startswith("/customers/"):
            length = self.m204()
            data, count = self.parseData(length)
            bank.updateCustomer(self.path, data)
        elif self.path.startswith("/customers"):
            self.m404(404, "can't replace collection")
        else:
            self.m404(404, "Not found")

    def do_DELETE(self):
        bank = Bank()
        if self.path.startswith("/customers/"):
            self.m204()
            bank.deleteCustomer(self.path)
        else:
            self.m404(404, "Not found")

    def do_OPTIONS(self):
        #self.m200()
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', ' * ')
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.end_headers()

def run():
    listen = ("localhost", 8080)
    server = HTTPServer(listen, BankServer)
    print("Listening...")
    server.serve_forever()

run()
