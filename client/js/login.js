function start() {
  gapi.load('auth2', () => {
    auth2 = gapi.auth2.init({
      client_id: "352936315579-n8j9c0qe63m677g9fjt178821n0v4a0f.apps.googleusercontent.com",
    });
  });
}
//login submit form
$(document).on('submit', '#registerForm', (e) => {
    e.preventDefault();
    $.ajax({
        url: 'http://localhost:5000/api/user/register',
        method: 'POST',
        data: {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#signUpEmail').val(), 
            password: $('#signUpPassword').val()
        },
        success: res => {
            console.log(res.message)
        },
        error: (jqXHR, status) => {
            console.log({status: jqXHR.status, message: jqXHR.responseJSON.error});
        }
    });
});

//login submit form
$(document).on('submit', '#loginForm', (e) => {
    e.preventDefault();
    $.ajax({
        url: 'http://localhost:5000/api/user/login',
        method: 'POST',
        data: {email: $('#email').val(), password: $('#password').val()},
        success: res => {
            localStorage.setItem("accessToken", res.accessToken);
            window.location.href = "home.html";
        },
        error: (jqXHR, status) => {
            console.log({status: jqXHR.status, message: jqXHR.responseJSON.error});
        }
    });
});

$(document).on('click', '#googleSignUp', (e) => {
    e.preventDefault();
    auth2.grantOfflineAccess()
    .then(authResult => {
        if (!authResult['code']) console.log("Error occurred");
        $.ajax({
            url: 'http://localhost:5000/api/user/signUp/google',
            method: 'POST',
            data: {authCode: authResult['code']},
            success: (err, res) => {
                if(err) console.log(err);
                localStorage.setItem("accessToken", res.accessToken);
                window.location.href = "home.html";
            },
            error: (jqXHR, status) => {
                console.log({status: jqXHR.status, message: jqXHR.responseJSON.error});
            }
        });
    })
    .catch(err => {console.log(err)})
});

$(document).on('click', '#googleLogin', (e) => {
    e.preventDefault();
    auth2.grantOfflineAccess()
    .then(authResult => {
        if (!authResult['code']) console.log("Error occurred");
        $.ajax({
            url: 'http://localhost:5000/api/user/login/google',
            method: 'POST',
            data: {authCode: authResult['code']},
            success: res => {
                localStorage.setItem("accessToken", res.accessToken);
                window.location.href = "home.html";
            },
            error: (jqXHR, status) => {
                console.log({status: jqXHR.status, message: jqXHR.responseJSON.error});
            }
        });
    })
    .catch(err => {console.log(err)})
});
