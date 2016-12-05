<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel = "stylesheet" href = "server.css">
  </head>
  <body>
        <header>
           <h1 class="header">LAST BANK OF SAINT GEORGE</h1>
           <h3 class="header">Leading the future of the past, today.</h3>
           <p class="header">700 s 400 e Saint George, UT 84770 (435)-555-9000</p>
       </header>
     <div id = "wrapper">
        <input type="button" id="add_button">
        <p id="add">Add Account</p>
    <div class="datagrid">
        <table id="data_table">
            <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Phone#</th>
                <th>Account #</th>
                <th>Account Type</th>
                <th>Balance</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>Withdraw</th>
                <th>Deposit</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                <!-- existing data could optionally be included here -->
            </tbody>
        </table>
    </div>
        <template id="customerrow">
                <tr>
                    <td contenteditable="true" type = 'text' id="new_fname"></td>
                    <td contenteditable="true"  type = 'text'id="new_lname"></td>
                    <td contenteditable="true" type = 'text'id="new_age"></td>
                    <td contenteditable="true" type = 'text'id="new_phone"></td>
                    <td contenteditable="true" type = 'text'id="new_account"></td>
                    <td contenteditable="true" type = 'text'id="new_type"></td>
                    <td contenteditable="true" type = 'text'id="new_balance"></td>
                    <td>
                        <input type="button" id="edit_button">
                    </td>
                    <td>
                        <input type="button" id="delete_button">
                    </td>
                    <td>
                        <input type="button" id="deposit_button">
                    </td>
                    <td>
                        <input type="button" id="withdraw_button">
                    </td>
                    <td>
                        <button id="submit_button"style="display:none">Submit</button>
                    </td>
                </tr>
        </template>
    </div>

    <div id="login">
    <input class = 'input'  id="semail" placeholder="Email"></input></br>
    <input class = 'input'  id="spassword" placeholder="Password" type="password" ></input></br>
    <a id="register">Register?</a>
    <button id="login_button">Sign In</button>
  </div>

  <div id="registerdiv">
    <input class = 'input' id="remail" placeholder="*Email"></input></br>
    <input  class = 'input' id="rpassword" placeholder="*Password" type="password"></input></br>
    <input class = 'input'  id="fname" placeholder="First Name"></input></br>
    <input class = 'input'  id="lname" placeholder="Last Name"></input></br>
    <p>* = required</p>
    <button id="Register_button">Register</button>
  </div>

    <script src="cookie.js"></script>
    <script src="server.js"></script>
  </body>
</html>
