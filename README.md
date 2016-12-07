#CUSTOMER TABLE SCHEMA
1.  CREATE TABLE customers(
    ID integer PRIMARY KEY,
    fname varchar(30),
    lname varchar(30),
    age integer(10),
    acct_number integer(20) UNIQUE,
    balance integer(20),
    acct_type varchar(20),
    phone_number varchar(25),
    time varchar(200)
);

#USER TABLE SCHEMA
1.  CREATE TABLE users (
    id integer PRIMARY KEY NOT NULL,
    email varchar(60) NOT NULL,
    encryptedpass varchar(255) NOT NULL,
    fname varchar(30),
    lname varchar(30)
    );**

#RESOURCE

###Customers:
    1.fname
    2.lname
    3.age
    4.phone number
    5.account number
    6.account type
    7.balance
    8.time **account opened**

###User:
    1. email
    2. password(encrypted with passlib.bcrypt)
    3. fname
    4. lname

#REST endpoint methods

1. getCustomer:
   uri="https://deploy-my-app.herokuapp.com/customers"
   method="do_GET"

2. insertCustomer:
   rest:uri="https://deploy-my-app.herokuapp.com/customers"
   rest:method="POST"

3. updateCustomers:
   rest:uri="https://deploy-my-app.herokuapp.com/customers/{key}"
   rest:method="PUT"

4. deleteCustomer:
   rest:uri="https://deploy-my-app.herokuapp.com/customers/{key}"
   rest:method="DELETE"
5. SignIn:
   rest:uri="https://deploy-my-app.herokuapp.com/users/{key}"
   method = "POST"
6. AddUser:
   rest:uri = "https://deploy-my-app.herokuapp.com/users"
   method= "POST"
