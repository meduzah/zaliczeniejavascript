$(document).ready(function() {
    $('#myForm').submit(function(event) {
        event.preventDefault();


        const name = $('#name').val();
        const email = $('#email').val();


        $.ajax({
            type: 'POST',
            url: '/submit',
            data: { name, email },
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
    $('#showUsersButton').click(function() {
        window.location.href = '/users';
    });
});