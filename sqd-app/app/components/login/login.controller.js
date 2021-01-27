(function () {
'use strict';
    angular
            .module('login')
            .controller('LoginController',LoginController)

    LoginController.$inject = ['$state','users'];


    function LoginController($state,users){
        var login= this;

        login.loginUser = loginUser;


        ////////////////////

        function loginUser() {
          users.login().then(loginSuccess).catch(loginFailed);


            function loginSuccess(response) {
                 $state.go('create');
            }

            function loginFailed(error) {
                console.log('something went wrong, please try again');
            }

            }


        }









})();