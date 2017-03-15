(()=>{
  // Helpers to set/get cookies
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*30*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }
  const TOKEN_KEY = 'token';
  // Login
  $('#loginForm').submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: '/v1/login',
      data: {
        email: $('#email').val(),
        password: $('#password').val(),
      }
    })
    .done((result) => {
      if (result.status === 'success') {
        setCookie(TOKEN_KEY, result.token, 30);
        window.location.href = '/';
      }
    })
    .fail((reason, a,b) => {
      alert(reason.statusText);
    });
  });
  
  // Signup
  $('#signupForm').submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: '/v1/signup',
      data: {
        email: $('#email').val(),
        password: $('#password').val(),
        password2: $('#password2').val(),
      }
    })
    .done((result) => {
      if (result.status === 'success') {
        setCookie(TOKEN_KEY, result.token, 30);
        window.location.href = '/';
      }
    })
    .fail((reason, a,b) => {
      if (reason.responseJSON.status === 'error') {
        alert(reason.responseJSON.errors.join(","));
      } else {
        alert(reason.statusText);
      }
    });
  });

  // Logout
  $('#logout').on('click', (e) => {
    e.preventDefault();
    setCookie(TOKEN_KEY, null, -30);
    window.location.href = '/logout';
  });

  // Get next
  $('#getNext').on('click', (e) => {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: '/v1/next',
      headers: {
        'Authorization': `Bearer ${getCookie(TOKEN_KEY)}`
      }
    })
    .done((result) => {
      $('#counter').text(result);
    })
    .fail((reason, a,b) => {
      if (reason.statusCode === 400 && reason.responseJSON.status === 'error') {
        alert(reason.responseJSON.errors.join(","));
      } else {
        alert(reason.statusText);
      }
    });
  });

  // Set the new counter
  $('#setNewCounterForm').submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "PUT",
      url: '/v1/current',
      data: {
        current: $('#newCounter').val(),
      },
      headers: {
        'Authorization': `Bearer ${getCookie(TOKEN_KEY)}`
      }
    })
    .done((result) => {
      $('#counter').text(result);
      $('#newCounter').val('')
    })
    .fail((reason, a,b) => {
      if (reason.responseJSON.status === 'error') {
        alert(reason.responseJSON.errors.join(","));
      } else {
        alert(reason.statusText);
      }
    });
  });
})();