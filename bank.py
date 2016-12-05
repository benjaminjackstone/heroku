import os
import time
import json
import sqlite3
import psycopg2
import psycopg2.extras
import urllib.parse
import os
class Bank:
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

    def createCustomersTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS customers (ID SERIAL PRIMARY KEY, email VARCHAR(255), fname VARCHAR(255), lname VARCHAR(255), age VARCHAR(255), acct_number VARCHAR(255), balance VARCHAR(255),acct_type VARCHAR(255), time VARCHAR(255))")
        self.connection.commit()

    def getPath(self, path):
        i = -1
        lastch = path[i]
        while lastch != "/":
            i -= 1
            lastch = path[i]
        cid = path[i + 1:]
        return cid

    def parseDict(self,data):
        values = ["", "", "", "", "", "","", "", ""]
        for key in data:
            if key == "ID":
                values[0] = (data.get(key)[0])
            if key == "fname":
                values[1] = (data.get(key)[0])
            if key == "lname":
                values[2] = (data.get(key)[0])
            if key == "age":
                values[3] = data.get(key)[0]
            if key == "acct_number":
                values[4] = data.get(key)[0]
            if key == "balance":
                values[5] = data.get(key)[0]
            if key == "acct_type":
                values[6] = (data.get(key)[0])
            if key == "phone_number":
                values[7] = (data.get(key)[0])
            if key == "time":
                values[8] = (data.get(key)[0])
        return values

    def dict_factory(self, cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def getIDS(self):
        # connection = sqlite3.connect("bankDB.db")
        self.connection.row_factory = self.dict_factory
        # cursor = self.connection.cursor()
        self.cursor.execute("SELECT ID FROM customers")
        rows = self.cursor.fetchall()
        self.connection.close()
        json_data = json.dumps(rows)
        return json_data

    def getCustomerInfo(self, path):
        cid = self.getPath(path)
        # connection = sqlite3.connect("bankDB.db")
        self.connection.row_factory = self.dict_factory
        # self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT * FROM customers WHERE ID = (%s)", (cid,))
        rows = self.cursor.fetchall()
        self.connection.close()
        json_data = json.dumps(rows)
        return json_data

    def getAllCustomers(self):
        # connection = sqlite3.connect("bankDB.db")
        self.connection.row_factory = self.dict_factory
        # cursor = connection.cursor()
        self.cursor.execute("SELECT * FROM customers")
        print('HELLO FROM THE HAWAIIAN ISLANDS')
        rows = self.cursor.fetchall()
        #row factory for tuple into dictionary then into json
        self.connection.close()
        json_data = json.dumps(rows)
        return json_data

    def deleteCustomer(self, path):
        cid = self.getPath(path)
        print("IS IT FREAKING DELETING?.................................")
        # connection = sqlite3.connect("bankDB.db")
        self.connection.row_factory = self.dict_factory
        # cursor = connection.cursor()
        self.cursor.execute("DELETE FROM customers WHERE ID = (%s)", (cid,))
        self.connection.commit()
        # rows = cursor.fetchall()
        # connection.close()
        # return json.dumps(bytes(rows))
        return

    def updateCustomer(self, path, data):
        cid = self.getPath(path)
        values = self.parseDict(data)
        print(values, "HELLO...................................")
        # connection = sqlite3.connect("bankDB.db")
        self.connection.row_factory = self.dict_factory
        # cursor = connection.cursor()
        self.cursor.execute("UPDATE customers SET fname=%s,lname=%s,age=%s,acct_number=%s,"
                       "balance=%s,acct_type=%s,phone_number=%s WHERE ID =%s",
                       (values[1],values[2],values[3],values[4],values[5],values[6],values[7],cid))
        self.connection.commit()
        rows = self.cursor.fetchall()
        self.connection.close()
        json_data = json.dumps(rows)
        return json_data

    def insertCustomer(self, customer):
        opentime = time.strftime("%d/%m/%Y")
        print(customer, "ADDING NEW CUSTOMER")
        customer = self.parseDict(customer)
        # connection = sqlite3.connect("bankDB.db")
        self.connection.row_factory = self.dict_factory
        # cursor = connection.cursor()
        self.cursor.execute("INSERT INTO customers(fname, lname,age,acct_number,balance,acct_type,phone_number, time) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)",
                       (customer[1], customer[2], customer[3],
                        customer[4], customer[5], customer[6], customer[7], opentime))
        self.connection.commit()
        self.connection.close()
