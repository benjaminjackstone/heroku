import od
import sqlite3
import json
import psycopg2
import psycopg2.extras
import urllib.parse

class UserDB:

    def __init__(self):
        urllib.parse.uses_netloc.append("postgres")
        url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

        self.connection = psycopg2.connect(
            cursor_factory=psycopg2.extras.RealDictCursor,
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )

        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()

    def createUsersTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL, fname VARCHAR(255), lname VARCHAR(255), password VARCHAR(255) NOT NULL)")
        self.connection.commit()

    def GetUsersByEmail(self):
        # connection = sqlite3.connect("users.db")
        # cursor = connection.cursor()
        self.cursor.execute("SELECT email from users")
        result = self.cursor.fetchall()
        return result

    def GetPath(self, idPath):
        i = -1
        endChar = idPath[i]
        while endChar != "/":
            i -= 1
            endChar = idPath[i]
        personID = idPath[i+1:]
        return personID

    def ParseDictionary(self,data):
        values = ["", "", "", ""]
        print(values)
        for key in data:
            if key == "email":
                values[0] = data.get(key)[0]
            if key == "password":
                values[1] = data.get(key)[0]
            if key == "fname":
                values[2] = data.get(key)[0]
            if key == "lname":
                values[3] = data.get(key)[0]
        return values

    def RowFact(self, cursor, row):
        d = {}
        for idX, col in enumerate(cursor.description):
            d[col[0]] = row[idX]
        return d

    def GetUser(self, idPath):
        personID = self.GetPath(idPath)
        # connection = sqlite3.connect("users.db")
        self.connection.row_factory = self.RowFact
        # cursor = connection.cursor()
        self.cursor.execute("SELECT * FROM users WHERE email = (%s)", (personID,))
        rows = self.cursor.fetchall()
        self.connection.close()
        return rows

    def GetALLUsersInfo(self):
        # connection = sqlite3.connect("users.db")
        connection.row_factory = self.RowFact
        # cursor = connection.cursor()
        self.cursor.execute("SELECT * FROM users")
        rows = self.cursor.fetchall()
        self.connection.close()
        return json.dumps(rows)

    def AddUser(self,UserInfo):
        UserInfo = self.ParseDictionary(UserInfo)
        # connection = sqlite3.connect("users.db")
        self.connection.row_factory = self.RowFact
        # cursor = connection.cursor()
        print(UserInfo)
        self.cursor.execute("INSERT INTO users (email,password,fname,lname) VALUES (%s,%s,%s,%s)",(UserInfo[0],UserInfo[1],UserInfo[2],UserInfo[3]))
        self.connection.commit()
        self.cursor.execute("SELECT * FROM users;")
        rows = self.cursor.fetchall()
        self.connection.close()
        return json.dumps(rows)
