//Handles the login process
const handleLogin = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({width:'hide'},350);
  
  if($("#user").val() == '' || $("#pass").val() == ''){
    handleError("RAWR! Username or password is empty");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  sendAjax('POST', $("#loginForm").attr("action"), $("loginForm").serialize(), redirect);
  
  return false;
};

//Handles the signup process
const handleSignup = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({width:'hide'},350);
  
  if($("user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  if($("#pass").val() !== $("pass2").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }
  
  sendAjax('POST', $("signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  
  return false;
};