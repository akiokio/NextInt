(()=>{
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
        localStorage.setItem('token', result.token);
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
        localStorage.setItem('token', result.token);
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

  // Get next
  $('#getNext').on('click', (e) => {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: '/v1/next',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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