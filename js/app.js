$(document).ready(function() {

    //ping
    var ping = $.ajax({
        url: 'http://greenvelvet.alwaysdata.net/kwick/api/ping',
        dataType: 'jsonp'
    });
    ping.done(function(data) {
        console.log(data);
        var user = {
            ready: data['result']['ready'],
        }
    });

    //inscritpion de l'utilisateur
    $("#submit").click(function(e) {
        e.preventDefault();

        var user_name = $('#Pseudo').val();
        var password = $('#Password').val();

        var inscription = $.ajax({
            url: 'http://greenvelvet.alwaysdata.net/kwick/api/signup/' + user_name + '/' + password,
            dataType: 'jsonp'
        });

        inscription.done(function(data) {
            console.log(data);

            var user = {
                id: data['result']['id'],
                token: data['result']['token']
            }

            var json_data = JSON.stringify(user);
            localStorage.setItem('user', json_data);

            if (data['result']['status'] === 'done') {
                window.location = 'view/chat.html';
            } else {
                $('.regiserror').fadeIn();
            }

        })

    });
    //connexion de l'utilisateur
    $("#submitConnect").click(function(e) {
        e.preventDefault();
        var user_nameConnect = $('#Pseudo2').val();
        var passwordConnect = $('#Password2').val();

        var connect = $.ajax({
            url: 'http://greenvelvet.alwaysdata.net/kwick/api/login/' + user_nameConnect + '/' + passwordConnect,
            dataType: 'jsonp'
        });

        connect.done(function(data) {
            console.log(data);

            var user = {
                id: data['result']['id'],
                token: data['result']['token']
            }

            var json_data = JSON.stringify(user);
            localStorage.setItem('user', json_data);

            if (data['result']['status'] === 'done') {
                window.location = 'view/chat.html';
            } else {
                $('.error').fadeIn();
            }

        })
    });

    //déconnexion de l'utilisateur

    $("#logout").click(function(e) {
        e.preventDefault();

        var user_data = JSON.parse(localStorage.getItem('user')), //transforme en object
            user_id = user_data.id,
            token = user_data.token;

        var logout = $.ajax({
            url: 'http://greenvelvet.alwaysdata.net/kwick/api/logout/' + token + '/' + user_id,
            dataType: 'jsonp'
        });

        logout.done(function(data) {
            localStorage.clear();
            window.location = '../index.html';
        })

    }); //end logout

    //envoie du message de l'utilisateur
    $("#messagebtn").click(function(e) {
        e.preventDefault();

        var user_data = JSON.parse(localStorage.getItem('user'));
        var user_id = user_data.id,
            token = user_data.token,
            message = $('#messagesend').val();

        console.log(localStorage.getItem('user'));
        var send = $.ajax({
            url: 'http://greenvelvet.alwaysdata.net/kwick/api/say/' + token + '/' + user_id + '/' + message,
            dataType: 'jsonp'
        });

        send.done(function(data) {
            console.log(data);

            var user = {
                id: data['result']['id'],
                token: data['result']['token'],
                message: data['result']['message'],
            }
            listemessage();
            $('#messagesend').val('');
            var json_data = JSON.stringify(message);

        })

    });
    // affichage message de l'utilisateur
    var listemessage = function() {

        var user_data = JSON.parse(localStorage.getItem('user'));
        var user_id = user_data.id,
            token = user_data.token,
            message = $('#messagesend').val();

        var list = $.ajax({
            url: 'http://greenvelvet.alwaysdata.net/kwick/api/talk/list/' + token + '/0',
            dataType: 'jsonp'
        });

        list.done(function(data) {
            if (data.result.status === "done") {
                $('#chatmessage').empty();
                //boucle sur talk 
                var talk = data['result']['talk'];
                talk = talk.slice().reverse();
                for (var i = 0; i < talk.length; i++) {
                    var date = $.format.date(new Date(talk[i].timestamp * 1000), "dd MMMM yyyy \à H:mm:ss");
                    $("#chatmessage").append('<p><img src="http://api.adorable.io/avatars/40/' + talk[i].user_name + '" alt="avatar" class="img-circle avatar"/><span class="name"> ' + talk[i].user_name + '</span> : <span class="messageco"> ' + talk[i].content + ' </span> <br/><i class="glyphicon glyphicon-time"></i>' + date + '</p>');


                }; //fin boucle

            } else {

            }
        }); //fin liste done
    };

    //affichage des membres connectés
    var listeusers = function() {
        var user_data = JSON.parse(localStorage.getItem('user'));
        var user_id = user_data.id,
            token = user_data.token;

        var listuser = $.ajax({
            url: 'http://greenvelvet.alwaysdata.net/kwick/api/user/logged/' + token,
            dataType: 'jsonp'
        });

        listuser.done(function(data) {
            if (data.result.status === "done") {
                $("#membreco").empty(); // je vide la div
                console.log(data);

                //boucle sur userlog 
                var userlog = data['result']['user'];

                for (var i = 0; i < userlog.length; i++) {
                    $("#membreco").append('<p><img src="http://api.adorable.io/avatars/20/' + userlog[i] + '" alt="avatar" class="img-circle avatarLog"/><span class="name"> ' + userlog[i] + '</span> '); //version avatar
                    // $("#membreco").append('<p><span class="success">●</span><span class="nameCo"> ' + userlog[i] + '</span> </p>'); //version puce succèss

                }
            } else {

            }
        }); //End liste done

    }; //End listeusers

    // refresh de la pages toutes les 2 secondes
    var refresh = function() {
        listemessage();
        listeusers();
    }
    refresh();
    setInterval(refresh, 2000);
}); //end jquery