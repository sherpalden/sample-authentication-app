//get user profile
$(document).on('click', '#myProfile', (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    $.ajax({
        url: 'http://localhost:5000/api/user/profile',
        method: 'GET',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer "+ accessToken
        },
        success: res => {
            console.log(res.profile)
        },
        error: (jqXHR, status) => {
            console.log({status: jqXHR.status, message: jqXHR.responseJSON.error});
        }
    });
});