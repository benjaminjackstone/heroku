var editButton = document.getElementById("edit_button");
var addButton = document.getElementById("add_button");
var table=document.getElementById("data_table");
var jsonarray;
var currcustomer;
var sheets = document.styleSheets;
var sheet = document.styleSheets[0];

function getDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = dd+'/'+mm+'/'+yyyy;
    return today;
}
function getDays(today){
    var monthtoken = false;
    var month = "";
    var daytoken = false;
    var day = "";
    var year = "";
    for (var i = 0, len = today.length; i < len; i++) {
        if(!daytoken){
            // console.log(today[i]);
            if(today[i] == '/'){
                daytoken = true;
                continue;
            }
            day += today[i];
            continue;
        }
        else if(!monthtoken){
            if(today[i] == '/'){
                monthtoken = true;
                continue;
            }
            month += today[i];
            continue;
        }
        else {
            year+= today[i];
        }
    }
    var days = parseInt(year);
    days = days*365;
    var month = parseInt(month);
    months = month *12;
    var day = parseInt(day);
    days = days + month + day;
    return days;
}
function getInterest(begin, end, balance){
    var days = end - begin;
    var years = days / 365.0;
    var new_balance = balance * Math.exp((0.03 * years));
    return new_balance;
}
add_button.onclick = function (){
    if(!submitpress){
    submitpress = true;
    add = true;
    var table=document.getElementById("data_table");
    var i=(table.rows.length)-1;
    var t = document.querySelector("#customerrow"),
    td = t.content.querySelectorAll("td");
    // Clone the new row and insert it into the table
    var tb = document.getElementsByTagName("tbody");
    // Create a new row
    var random = Math.floor(Math.random() * (100000 - 0 + 1)) + 0;
    td[0].outerHTML = "<td  contenteditable='true'id='FName_row"+i+"'></td>";
    td[1].outerHTML = "<td  contenteditable='true' type = 'text' id='LName_row"+i+"'>"+""+"</td>";
    td[2].outerHTML = "<td  contenteditable='true'id='Age_row"+i+"'>"+""+"</td>";
    td[3].outerHTML = "<td  contenteditable='true'id='Phone#_row"+i+"'>"+""+"</td>";
    td[4].outerHTML = "<td contenteditable='false'id='Account#_row"+i+"'>"+random+"</td>";
    td[5].outerHTML = "<td  contenteditable='true'id='AccountType_row"+i+"'>"+""+"</td>";
    td[6].outerHTML = "<td contenteditable='true' id='Balance_row"+i+"'>"+""+"</td>";
    td[7].outerHTML = "<td> <input type='button' onclick = 'edit_row("+i+")' id='edit_button"+i+"'></td>";
    td[8].outerHTML = "<td> <input type='button' onclick = 'delete_row("+i+")' id='delete_button"+i+"'></td>";
    td[9].outerHTML = "<td> <input type='button' 'withdraw_row("+i+")' id='withdraw_button"+i+"'> </td>";
    td[10].outerHTML = "<td> <input type='button' 'deposit_row("+i+")' id='deposit_button"+i+"'></td>";
    td[11].outerHTML = "<td> <input type='button' style = 'display:none' value='SUBMIT' onclick = 'submit_row("+i+")' id='submit_button"+i+"'></td>";
    // Clone the new row and insert it into the table
    var clone2 = document.importNode(t.content, true);
    tb[0].appendChild(clone2);
    sheet.addRule("#edit_button"+i, "position:relative; width:30px; height:35px; background: url(editbutton.ico) no-repeat; background-size: 100%; background-size: 30px auto; border: 0;", 1);
    sheet.addRule("#delete_button"+i, "position:relative; width:30px; height:35px; background: url(deletebutton.png) no-repeat; background-size: 100%; background-size: 30px auto; border: 0;", 1);
    sheet.addRule("#withdraw_button"+i, "position:relative; width:30px; height:35px; background: url(withdrawbutton.png) no-repeat; background-size: 100%; background-size: 30px auto; border: 0;", 1);
    sheet.addRule("#deposit_button"+i, "position:relative; width:30px; height:35px; background: url(depositbutton.png) no-repeat; background-size: 100%; background-size: 30px auto; border: 0;", 1);
    sheet.addRule("#submit_button"+i, "position:relative; width:75px; height:35px;", 1);
    sheet.addRule("#edit_button"+i+":hover", "width:32px; background-size: 32px auto;", 1);
    sheet.addRule("#delete_button"+i+":hover", "width:32px; background-size: 32px auto;", 1);
    sheet.addRule("#withdraw_button"+i+":hover", "width:32px; background-size: 32px auto;", 1);
    sheet.addRule("#deposit_button"+i+":hover", "width:32px; background-size: 32px auto;", 1);
    sheet.addRule("#submit_button"+i+":hover", "width:78px; height:37px;", 1);
    sheet.addRule("#edit_button"+i+":active", "background-color:black;", 1);
    sheet.addRule("#delete_button"+i+":active", "background-color:black;", 1);
    sheet.addRule("#withdraw_button"+i+":active", "background-color:black;", 1);
    sheet.addRule("#deposit_button"+i+":active", "background-color:black;", 1);
    sheet.addRule(".hilite"+i, 1);
    document.getElementById("submit_button"+i).style.display="";
    }
};

var requestOnLoad  = new XMLHttpRequest();
requestOnLoad.onreadystatechange = function (){
    console.log("make it to load request");
    if (requestOnLoad.readyState == XMLHttpRequest.DONE){
        if (requestOnLoad.status >= 200 && requestOnLoad.status < 400){
            jsonarray = JSON.parse(requestOnLoad.responseText);
            console.log("accounts Loaded");
            console.log(jsonarray);

            for (var i = 0, len = jsonarray.length; i < len; i++){
                // var start = jsonarray[i]['time'];
                var today = getDate();
                // var begin = getDays(start); //compund interest for life of account
                var end = getDays(today);
                var begin = end - 1;
                var balance = jsonarray[i]['balance'];
                var new_balance = getInterest(begin, end, balance);
                jsonarray[i]['balance'] = Math.round(new_balance * 100) / 100;
            }
        for (var i = 0, len = jsonarray.length; i < len; i++){
          printAJAX(jsonarray[i], i);
            }
        } else {
                console.error("Couldn't load accounts!");
                document.getElementById("login").style.display = "initial";
                document.getElementById("wrapper").style.display = "none";
                }
        }
    };
requestOnLoad.open("GET", "http://localhost:8080/customers");
requestOnLoad.withCredentials = true;
requestOnLoad.send();

function printAJAX(item, i){
    var t = document.querySelector("#customerrow");
    td = t.content.querySelectorAll("td");
    tr = t.content.querySelectorAll("td");
    // Clone the new row and insert it into the table
    var tb = document.getElementsByTagName("tbody");
    // Create a new row]
    td[0].outerHTML = "<td  contenteditable='false' type = 'text' id='FName_row"+i+"'>"+item['fname']+"</td>";
    td[1].outerHTML = "<td  contenteditable='false' type = 'text' id='LName_row"+i+"'>"+item['lname']+"</td>";
    td[2].outerHTML = "<td  contenteditable='false' type = 'text'id='Age_row"+i+"'>"+item['age']+"</td>";
    td[3].outerHTML = "<td  contenteditable='false' type = 'text'id='Phone#_row"+i+"'>"+item['phone_number']+"</td>";
    td[4].outerHTML = "<td contenteditable='false' type = 'text'id='Account#_row"+i+"'>"+item['acct_number']+"</td>";
    td[5].outerHTML = "<td  contenteditable='false' type = 'text'id='AccountType_row"+i+"'>"+item['acct_type']+"</td>";
    td[6].outerHTML = "<td contenteditable='false' type = 'text' id='Balance_row"+i+"'>"+item['balance']+"</td>";
    td[7].outerHTML = "<td> <input type='button' onclick = 'edit_row("+i+")' id='edit_button"+i+"'></td>";
    td[8].outerHTML = "<td> <input type='button' onclick = 'delete_row("+i+")' id='delete_button"+i+"'></td>";
    td[9].outerHTML = "<td> <input type='button' onclick = 'withdraw_row("+i+")'id='withdraw_button"+i+"'> </td>";
    td[10].outerHTML = "<td> <input type='button' onclick = 'deposit_row("+i+")'id='deposit_button"+i+"'></td>";
    td[11].outerHTML = "<td> <input type='button' style =' display:none' value='SUBMIT' onclick = 'submit_row("+i+")' id='submit_button"+i+"'></td>";
    // Clone the new row and insert it into the table
    var clone2 = document.importNode(t.content, true);
    tb[0].appendChild(clone2);
    sheet.addRule("#edit_button"+i, "position:relative; width:30px; height:35px; background: url(editbutton.ico) no-repeat; background-size: 100%; background-size: 30px auto; border: 0;", 1);
    sheet.addRule("#delete_button"+i, "position:relative; width:30px; height:35px; background: url(deletebutton.png) no-repeat; background-size: 100%; background-size: 30px auto; border: 0;", 1);
    sheet.addRule("#withdraw_button"+i, "position:relative; width:30px; height:35px; background: url(withdrawbutton.png) no-repeat; background-size: 100%; background-size: 30px auto; border: 0;", 1);
    sheet.addRule("#deposit_button"+i, "position:relative; width:30px; height:35px; background: url(depositbutton.png) no-repeat; background-size: 100%; background-size: 30px auto; border: 0;", 1);
    sheet.addRule("#submit_button"+i, "position:relative; width:75px; height:35px;", 1);
    sheet.addRule("#edit_button"+i+":hover", "width:32px; background-size: 32px auto;", 1);
    sheet.addRule("#delete_button"+i+":hover", "width:32px; background-size: 32px auto;", 1);
    sheet.addRule("#withdraw_button"+i+":hover", "width:32px; background-size: 32px auto;", 1);
    sheet.addRule("#deposit_button"+i+":hover", "width:32px; background-size: 32px auto;", 1);
    sheet.addRule("#submit_button"+i+":hover", "width:78px; height:37px;", 1);
    sheet.addRule("#edit_button"+i+":active", "background-color:black;", 1);
    sheet.addRule("#delete_button"+i+":active", "background-color:black;", 1);
    sheet.addRule("#withdraw_button"+i+":active", "background-color:black;", 1);
    sheet.addRule("#deposit_button"+i+":active", "background-color:black;", 1);
    sheet.addRule(".hilite"+i, 1);

}

var getCustomer = function() {
    var request  = new XMLHttpRequest();
    request.onreadystatechange = function (){
        if (request.readyState == XMLHttpRequest.DONE){
            if (request.status >= 200 && request.status < 400){
                jsonarray = [];
                jsonarray = JSON.parse(request.responseText);
                //success(data);
                for (var i = 0, len = jsonarray.length; i < len; i++){
                  printAJAX(jsonarray[i], i);
                    }
            } else {
                //failure();
            }
        }

    };
    //use this function when page loads and when data is updated
    request.open("GET", "http://localhost:8080/customers");
    request.withCredentials = true;
    request.send();
};
var addCustomer = function() {
    var request  = new XMLHttpRequest();
    request.onreadystatechange = function (){
        if (request.readyState == XMLHttpRequest.DONE){
            if (request.status >= 200 && request.status < 400){
                //data = JSON.parse(request.responseText);
                //console.log(data);
                console.log("Inserting New Customer");
                alert("NEW CUSTOMER ADDED")
                //success();
            } else {
                //failure();
                alert("Uh oh. something bad happened")
            }
        }
    };
    request.open("POST", "http://localhost:8080/customers", true);
    request.withCredentials = true;
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("fname="+currcustomer['fname']+'&lname='+currcustomer['lname']+'&age='+currcustomer['age']+'&phone_number='+currcustomer['phone_number']+'&acct_number='+currcustomer['acct_number']+'&acct_type='+currcustomer['acct_type']+'&balance='+currcustomer['balance']);
};

var data;
var updateCustomer = function() {
    var request  = new XMLHttpRequest();
    request.onreadystatechange = function (){
        if (request.readyState == XMLHttpRequest.DONE){
            if (request.status >= 200 && request.status < 400){
                console.log("UPDATING CUSTOMER INFO NOW.....");
                alert("UPDATE WAS SUCCESSFUL")
            }
            else {
            // alert("REQUEST DIDNT SEND BACK A RESPONSE")
            }
        }
    };
    request.open("PUT", "http://localhost:8080/customers/"+currcustomer['ID'], true);
    // request.withCredentials = true;
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("fname="+currcustomer['fname']+'&lname='+currcustomer['lname']+'&age='+currcustomer['age']+'&phone_number='+currcustomer['phone_number']+'&acct_number='+currcustomer['acct_number']+'&acct_type='+currcustomer['acct_type']+'&balance='+currcustomer['balance']);
};

var deleteCustomer = function() {
    var request  = new XMLHttpRequest();
    request.onreadystatechange = function (){
        if (request.readyState == XMLHttpRequest.DONE){
            if (request.status >= 200 && request.status < 400){
                //fortunes = JSON.parse(request.responseText);
                console.log("DELETE WAS A SUCCESS");
                //success();
            } else {
                //failure();
                alert("Uh oh. something bad happened")
            }
        }
    };
    request.open("DELETE", "http://localhost:8080/customers/"+currcustomer['ID'], true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send();

};
var gI = -1;

function edit_row(i) {
    if(!submitpress){
        console.log(i);
        gI = i + 1;
        submitpress = true;
        editpress = true;
        currcustomer = jsonarray[i];
        // document.getElementsByClassName(".hilite"+i).style = "background-color: yellow";
        // sheet.addRule(".hilite"+i, "background-color:yellow;", 1);
        document.getElementById("FName_row"+i).outerHTML = "<td style = 'background-color: yellow' contenteditable='true' id='FName_row"+i+"'>"+document.getElementById("FName_row"+i).innerHTML+"</td>";
        document.getElementById("LName_row"+i).outerHTML = "<td style = 'background-color: yellow' contenteditable='true' id='LName_row"+i+"'>"+document.getElementById("LName_row"+i).innerHTML+"</td>";
        document.getElementById("Age_row"+i).outerHTML = "<td style = 'background-color: yellow' contenteditable='true'id='Age_row"+i+"'>"+document.getElementById("Age_row"+i).innerHTML+"</td>";
        document.getElementById("Phone#_row"+i).outerHTML = "<td style = 'background-color: yellow' contenteditable='true'id='Phone#_row"+i+"'>"+document.getElementById("Phone#_row"+i).innerHTML+"</td>";
        document.getElementById("AccountType_row"+i).outerHTML = "<td style = 'background-color: yellow' contenteditable='true'id='AccountType_row"+i+"'>"+document.getElementById("AccountType_row"+i).innerHTML+"</td>";
        document.getElementById("submit_button"+i).style.display="";
    }
    else if(submitpress && editpress && i == (i)){
        editpress = false;
        submitpress = false;
        document.getElementById("FName_row"+i).outerHTML = "<td contenteditable='false'id='FName_row"+i+"'>"+document.getElementById("FName_row"+i).innerHTML+"</td>";
        document.getElementById("LName_row"+i).outerHTML = "<td contenteditable='false'id='LName_row"+i+"'>"+document.getElementById("LName_row"+i).innerHTML+"</td>";
        document.getElementById("Age_row"+i).outerHTML = "<td contenteditable='false'id='Age_row"+i+"'>"+document.getElementById("Age_row"+i).innerHTML+"</td>";
        document.getElementById("Phone#_row"+i).outerHTML = "<td contenteditable='false'id='Phone#_row"+i+"'>"+document.getElementById("Phone#_row"+i).innerHTML+"</td>";
        document.getElementById("AccountType_row"+i).outerHTML = "<td contenteditable='false'id='AccountType_row"+i+"'>"+document.getElementById("AccountType_row"+i).innerHTML+"</td>";
        document.getElementById("submit_button"+i).style.display="none";
    }
}
var deletes = [];
var reduce = 0;
function delete_row(index) {
    //gI = index;
    if(!submitpress){
        // console.log(deletes);
        for (var i = 0, len = deletes.length; i < len; i++){
                if(deletes[i] < index){
                    reduce += 1;
                }
        }
        // console.log(index);
        gI = index - reduce;
        submitpress = true;
        deletepress = true;
        currcustomer = jsonarray[index];
        document.getElementById("submit_button"+gI).style.display="";
    }
    else if(submitpress && deletepress){
        deletepress = false;
        submitpress = false;
        document.getElementById("submit_button"+(gI+reduce)).style.display="none";
    }
}
function deposit_row(i) {
    if(!submitpress){
        console.log(i);
        gI = i
        submitpress = true;
        depositpress = true;
        currcustomer = jsonarray[i];
        document.getElementById("submit_button"+i).style.display="";
    }
    else if(submitpress && depositpress){
        depositpress = false;
        submitpress = false;
        document.getElementById("submit_button"+i).style.display="none";
    }
}
function withdraw_row(i) {
    if(!submitpress){
        gI = i
        submitpress = true;
        withdrawpress = true;
        currcustomer = jsonarray[i];
        document.getElementById("submit_button"+i).style.display="";
    }
    else if(submitpress && withdrawpress){
        withdrawpress = false;
        submitpress = false;
        document.getElementById("submit_button"+i).style.display="none";
    }
}
var add = false;
var editpress = false;
var deletepress = false;
var depositpress = false;
var withdrawpress = false;
var submitpress = false;

function submit_row(i){
    submitpress = false;
    var i =table.rows.length-2;
    if(add) {
        add = false;
        jsonarray.push({"fname":document.getElementById("FName_row"+i).innerHTML,
        "lname":document.getElementById("LName_row"+i).innerHTML,"age":parseInt(document.getElementById("Age_row"+i).innerHTML),
        "phone_number":document.getElementById("Phone#_row"+i).innerHTML,"acct_number":document.getElementById("Account#_row"+i).innerHTML,"acct_type":document.getElementById("AccountType_row"+i).innerHTML,
        "balance":parseFloat(document.getElementById("Balance_row"+i).innerHTML)});
        console.log(jsonarray);
        currcustomer = jsonarray[i];
        document.getElementById("FName_row"+i).outerHTML = "<td contenteditable='false'id='FName_row"+i+"'>"+document.getElementById("FName_row"+i).innerHTML+"</td>";
        document.getElementById("LName_row"+i).outerHTML = "<td contenteditable='false'id='LName_row"+i+"'>"+document.getElementById("LName_row"+i).innerHTML+"</td>";
        document.getElementById("Age_row"+i).outerHTML = "<td contenteditable='false'id='Age_row"+i+"'>"+document.getElementById("Age_row"+i).innerHTML+"</td>";
        document.getElementById("Phone#_row"+i).outerHTML = "<td contenteditable='false'id='Phone#_row"+i+"'>"+document.getElementById("Phone#_row"+i).innerHTML+"</td>";
        document.getElementById("AccountType_row"+i).outerHTML = "<td contenteditable='false'id='AccountType_row"+i+"'>"+document.getElementById("AccountType_row"+i).innerHTML+"</td>";
        document.getElementById("Balance_row"+i).outerHTML = "<td contenteditable='false'id='Balance_row"+i+"'>"+document.getElementById("Balance_row"+i).innerHTML+"</td>";
        addCustomer();
        document.getElementById("submit_button"+i).style.display="none";
    }
    if (deletepress){
        deletes.push(index);
        deletepress = false;
        deleteCustomer();
        document.getElementById("submit_button"+gI).style.display="none";
        table.deleteRow(gI+1);
    }
    if(editpress){
        var index = gI-1;
        editpress = false;
        console.log(jsonarray[index]['lname']);
        jsonarray[index]["fname"] = document.getElementById("FName_row"+index).innerHTML;
        jsonarray[index]["lname"] = document.getElementById("LName_row"+index).innerHTML;
        jsonarray[index]["age"] = document.getElementById("Age_row"+index).innerHTML;
        jsonarray[index]["phone_number"] = document.getElementById("Phone#_row"+index).innerHTML;
        jsonarray[index]["acct_type"] = document.getElementById("AccountType_row"+index).innerHTML;
        jsonarray[index]["balance"] = document.getElementById("Balance_row"+index).innerHTML;
        currcustomer = jsonarray[index];
        updateCustomer();
        document.getElementById("FName_row"+index).outerHTML = "<td contenteditable='false'id='FName_row"+i+"'>"+document.getElementById("FName_row"+index).innerHTML+"</td>";
        document.getElementById("LName_row"+index).outerHTML = "<td contenteditable='false'id='LName_row"+i+"'>"+document.getElementById("LName_row"+index).innerHTML+"</td>";
        document.getElementById("Age_row"+index).outerHTML = "<td contenteditable='false'id='Age_row"+i+"'>"+document.getElementById("Age_row"+index).innerHTML+"</td>";
        document.getElementById("Phone#_row"+index).outerHTML = "<td contenteditable='false'id='Phone#_row"+i+"'>"+document.getElementById("Phone#_row"+index).innerHTML+"</td>";
        document.getElementById("AccountType_row"+index).outerHTML = "<td contenteditable='false'id='AccountType_row"+i+"'>"+document.getElementById("AccountType_row"+index).innerHTML+"</td>";
        document.getElementById("submit_button"+index).style.display="none";    }
    if (depositpress){
        depositpress = false;
        var num = parseFloat(document.getElementById("Balance_row"+gI).innerHTML);
        num = parseInt(num);
        jsonarray[gI]["balance"] = num + 1000;
        currcustomer = jsonarray[gI];
        console.log(currcustomer);
        document.getElementById("Balance_row"+gI).innerHTML = jsonarray[gI]["balance"];
        updateCustomer();
        document.getElementById("submit_button"+gI).style.display="none";    }
    if (withdrawpress){
        withdrawpress = false;
        var num = parseFloat(document.getElementById("Balance_row"+gI).innerHTML);
        num = (num);
        jsonarray[gI]["balance"] = num - 1000;
        currcustomer = jsonarray[gI];
        console.log(currcustomer);
        document.getElementById("Balance_row"+gI).innerHTML = jsonarray[gI]["balance"];
        updateCustomer();
        document.getElementById("submit_button"+gI).style.display="none";    }
}
