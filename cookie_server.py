import sys
from http import cookies
from http.server import BaseHTTPRequestHandler, HTTPServer
from session_store import SessionStore
from userdb import *
from bank import *
from urllib.parse import urlparse, parse_qs
from passlib.hash import bcrypt
from cookiejar  import *
gSesh = SessionStore()
gUser = ""
gCookiejar = CookieJar()
class MyRequestHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        self.load_session()
        bank = Bank()
        user = UserDB()
        if self.path.startswith("/customers"):
            matched = False
            allUsers = user.GetUsersByEmail()
            for i in allUsers:
                if gSesh.sessionData[self.session] == i[0] and i[0] != "":
                    matched = True
                    break
                else:
                    matched = False
            print(matched)
            if matched:
                length = self.CookieHeader201()
                data, count = self.parseInput(length)
                if count < 6:
                    self.CookieHeader404("MISSING FIELDS. COULDN'T ADD CUSTOMER")
                    return
                bank.insertCustomer(data)
            else:
                self.CookieHeader401()
        elif self.path.startswith("/sessions"):
            length = int(self.headers['Content-Length'])
            data, amount = self.parseInput(length)
            testPass = data["password"]
            idPath = data["email"]
            print(idPath)
            userInfo = user.GetUser(idPath)
            if userInfo:
                if bcrypt.verify(testPass[0],userInfo[0]["password"]):
                    print("saved email")
                    self.CookieHeader200()
                    self.wfile.write(bytes(json.dumps(userInfo),"utf-8"))
                    gSesh.sessionData[self.session] = userInfo[0]["email"]
                    print(gSesh.sessionData)
                else:
                    self.CookieHeader401()
        elif self.path.startswith("/users"):
            ids = user.GetUsersByEmail()
            length = int(self.headers['Content-Length'])
            data, amount = self.parseInput(length)
            for i in ids:
                if i[0] == data["email"][0]:
                    self.HeaderNoCookie422("ALREADY EXISTS")
                    return
            self.CookieHeader201()
            data["password"][0] = bcrypt.encrypt(data["password"][0])
            u = user.AddUser(data)
            self.wfile.write(bytes(u, "utf-8"))
        else:
            self.CookieHeader404("NOT FOUND")

    def do_GET(self):
        #index or list action
        self.load_session()
        bank = Bank()
        user = UserDB()
        if self.path.startswith("/customers/"):
            matched = False
            allUsers = user.GetUsersByEmail()
            for i in allUsers:
                if gSesh.sessionData[self.session] == i[0] and i[0] != "":
                    matched = True
                    break
                else:
                    matched = False
            print(matched)
            if matched:
                json_data = bank.getCustomerInfo(self.path)
                if json_data != '[]':
                    self.CookieHeader200()
                    self.wfile.write(bytes(json_data, "utf-8"))
                    return
                self.CookieHeader404("COULDN'T LOCATE THIS RESOURCE")
            else:
                self.CookieHeader401()

        elif self.path.startswith("/customers"):
            #handle customers
            matched = False
            allUsers = user.GetUsersByEmail()
            index = 0;
            for i in allUsers:
                print(i, "session stuff something should = ", gSesh.sessionData[index].value)
                # if gSesh.sessionData[self.session] == i[0] and i[0] != "":
                #     matched = True
                #     break
                # else:
                #     matched = False
                index += 1
            print(matched)
            if matched:
                self.CookieHeader200()
                json_data = bank.getAllCustomers()
                self.wfile.write(bytes(json_data, "utf-8"))
            else:
                self.CookieHeader401()
        else:
            self.CookieHeader404("COLLECTINO NOT FOUND")

    def do_DELETE(self):
        self.load_session()
        bank = Bank()
        if self.path.startswith("/customers/"):
            matched = False
            allUsers = user.GetUsersByEmail()
            for i in allUsers:
                if gSesh.sessionData[self.session] == i[0] and i[0] != "":
                    matched = True
                    break
                else:
                    matched = False
            print(matched)
            if matched:
                print("JAVASCRIPT DO_DELETE...................")
                bank.deleteCustomer(self.path)
                self.HeaderNoCookie200()
            else:
                self.CookieHeader401()

        else:
            self.CookieHeader404("COLLECTION NOT FOUND")

    def do_PUT(self):
        self.load_session()
        bank = Bank()
        if self.path.startswith("/customers/"):
            length = self.HeaderNoCookie204()
            data, count = self.parseInput(length)
            bank.updateCustomer(self.path, data)
        elif self.path.startswith("/customers"):
            self.CookieHeader404("TRYING TO UPDATE A COLLECTION")
        else:
            self.CookieHeader404("COLLECTION NOT FOUND")


    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.cookie = gCookiejar.GetCookie()
        self.send_cookie()
        # self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.end_headers()

    def HeaderNoCookie200(self):
        #OK
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", '*')
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
    def HeaderNoCookie422(self, error):
        #OK
        self.send_response(422)
        self.send_header("Access-Control-Allow-Origin", '*')
        # self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(bytes("<p>404 "+error+"</p>", "utf-8"))

    def CookieHeader200(self):
        #OK
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_cookie()
        self.send_header("Content-Type", "text/plain")
        self.end_headers()

    def HeaderNoCookie204(self):
        #OK
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", '*')
        self.cookie = gCookiejar.GetCookie()
        self.send_cookie()
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
    def CookieHeader404(self, error):
        #error
        self.send_response(404)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_cookie()
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(bytes("<p>404 "+error+"</p>", "utf-8"))

    def CookieHeader401(self):
        self.send_response(401)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_cookie()
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(bytes("<p>401 Unable to authenticate.</p>", "utf-8"))

    def HeaderNoCookie201(self):
        self.send_response(201)
        self.send_header("Access-Control-Allow-Origin", '*')
        self.cookie = gCookiejar.GetCookie()
        self.send_cookie()
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        length = int(self.headers['Content-Length'])
        return length

    def CookieHeader201(self):
        #created element
        self.send_response(201)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_cookie()
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        length = int(self.headers['Content-Length'])
        return length

    def CookieHeader204(self):
        #didn't create anything and didn't give anything back
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_cookie()
        self.send_header("Content-Type", "text/plain")
        self.end_headers()

    def parseInput(self, length):
        data = self.rfile.read(length).decode("utf-8")
        num = 0
        parsed = parse_qs(data)
        for key in parsed:
            num += 1
        return parsed, num

    def load_session(self):
        self.load_cookie()
        if "!" not in self.cookie:
            print("COOKIE")
            # try to load the session object using the ID
            self.session = gSesh.getSession(self.cookie["sessionID"].value)
            # IF session data was retrieved:
            if self.session != None:
                print("Session Exists")
                print(self.session)
                gCookiejar.SetCookie(self.session, self.cookie)
                # yay! save/use it.
            else:
                # create a new session object, save/use it.
                print("Created new session")
                self.session = gSesh.createSession()
                gSesh.sessionData[self.session] = ""
                # store the session ID in a cookie
                self.cookie["sessionID"] = self.session
        else:
            print("NO COOKIE")
            self.cookie = cookies.SimpleCookie()
            # create a new session object, save/use it.
            self.session = gSesh.createSession()
            # store the session ID in a cookie
            self.cookie["sessionID"] = self.session

    def load_cookie(self):
        if "Cookie" in self.headers:
            print("cookie in headers")
            cookie = cookies.SimpleCookie()
            sessionInfo = self.headers["Cookie"]
            cookie.load(sessionInfo)
            self.cookie = cookie
        else:
            print("No cookie in headers")
            self.cookie = cookies.SimpleCookie()
            self.cookie["!"] = ""

    def send_cookie(self):
        for morsel in self.cookie.values():
            self.send_header("Set-Cookie", morsel.OutputString())

def run():
    # listen = ("127.0.0.1", 8080)
    # server = HTTPServer(listen, MyRequestHandler)
    # print("Listening...")
    # server.serve_forever()
    userdb = UserDB()
    customerdb = Bank()
    userdb.createUsersTable()
    customerdb.createCustomersTable()
    userdb = None # disconnect
    customerdb = None # disconnect
    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    listen = ("0.0.0.0", port)
    server = HTTPServer(listen, MyRequestHandler)
    print("Server listening on", "{}:{}".format(*listen))
    server.serve_forever()

run()
