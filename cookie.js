var password = document.getElementById("password");
var register = document.getElementById("register");
var Sign_In_Button = document.getElementById("login_button");
var lname = document.getElementById("lname");
var title = document.getElementById("title");
var email = document.getElementById("email");
var Register_Button = document.getElementById("Register_button");
var fname = document.getElementById("fname");


Register_Button.onclick = function(){
  email = document.getElementById("remail").value;
  password = document.getElementById("rpassword").value;
  fname = document.getElementById("fname").value;
  lname = document.getElementById("lname").value;
  if (email == "" || password == ""){
    alert("Invalid username or password")
  } else{
    addUser(function(){
      email.value = "";
      password.value = "";
      fname.value = "";
      lname.value = "";
      document.getElementById("login").style.display = "initial";
      document.getElementById("registerdiv").style.display = "none";
    //   title.innerText = "Sign In";
    },function(){
      alert("had issues registering");
    })
  }
}

register.onclick = function() {
    document.getElementById("login").style.display = "none";
    document.getElementById("registerdiv").style.display = "initial";
    title.innerText = "Register";
};

Sign_In_Button.onclick = function() {
    email = document.getElementById("semail").value;
    password = document.getElementById("spassword").value;
    if (email == "" || password == ""){
        alert("Email and password required for login")
    } else {
        signIn(function(){
            //changed to make success turn on rest of index
            document.getElementById("wrapper").style.display = "block";
            document.getElementById("login").style.display = "none";
            document.getElementById("registerdiv").style.display = "none";
            //InitialGet();
            alert("WELCOME BACK, "+ email);
            email.value = "";
            password.value = "";
        }, function(){
            alert("Invalid Username or Password");
            console.log("Couldn't log in");
        });
    }
};

var signIn = function(success, failure){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function (){
    if (request.readyState == XMLHttpRequest.DONE){
      if (request.status >= 200 && request.status < 400) {
        user = JSON.parse(request.responseText);
        success();
        window.location.reload();
      } else {
        failure();
      }
    }
  };
  request.open("POST", "http://localhost:8080/sessions", true);
  request.withCredentials = true;
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send("email="+email+"&password="+password);
};

function InitialGet(){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function (){
    if (request.readyState == XMLHttpRequest.DONE){
      if (request.status >= 200 && request.status < 400) {
        customers = JSON.parse(request.responseText);
        console.log("customers Loaded");
        count = 0;
        for (var i = 0, len = customers.length; i <len; i++){
          printAJAX(customers[i]);
        }
      } else {
        console.error("Couldn't load customers!");
        document.getElementById("Sign_In_Buttonox").style.display = "initial";
        document.getElementById("wrapper").style.display = "none";
      }
    }
  };
request.open("GET", "http://localhost:8080/customers");
request.withCredentials = true;
request.send();
};
var addUser = function (success, failure){
    var post = new XMLHttpRequest();
    post.onreadystatechange = function (){
        if (post.readyState == XMLHttpRequest.DONE){
            if (post.status >= 200 && post.status < 400) {
                users = JSON.parse(post.responseText);
                success();
            } else {
                failure();
            }
        }
    };
    console.log(email);
    console.log(password);
    console.log(fname);
    console.log(lname);
    post.open("POST", "http://localhost:8080/users");
    // post.withCredentials = true;
    post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    post.send("email="+email+"&password="+password+"&fname="+fname+"&lname="+lname);
};
