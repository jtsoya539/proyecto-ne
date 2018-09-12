/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
////Accede directamente al modulo ProyectoNE definido en app.js
'use strict';
ProyectoNE.controller('ControllerLogin', ControllerLogin);

function ControllerLogin($window, $scope, loginService) {
    /* Definimos registro con los datos del usuario */
    $scope.registro = {
        usuario: '',
        clave: ''
    };
    $scope.clave = '';

    /* Funcion que envia los datos del nuevo usuario al servidor */
    $scope.enviar = function(){
       console.log("valido los datos..");
        if  ($scope.registro.usuario === '') {
           alert('Debe ingresar el usuario o correo electronico');
           return false;
        }
        if ($scope.clave === ''){
           alert('Debe ingresar una contraseña');
           return false;
        } else {
          $scope.registro.clave = CryptoJS.MD5($scope.clave).toString();
        }

       console.log("entro a eviar..");
        $.LoadingOverlay("show");
       /* Envio request al servidor */
       loginService.login($scope.registro)
        .then(function(response) {
             $scope.registro.usuario = '';
             $scope.registro.clave = '';
             $scope.clave = '';
            // $scope.registro.integrantes = [];
           console.log("imprimo respuesta..");
             console.log(response);
            // Mensaje 
            w3.hide('#login');
            if(response.data.state !== "OK") {
                NeAlert(response.data.state, "Atencion!", response.data.message);
                $.LoadingOverlay("hide");
            }
            else {
                $window.location.href = 'base.html';
            }

        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
            $.LoadingOverlay("hide");
        });
   };

}
ControllerLogin.$inject = ['$window', '$scope', 'loginService'];

/* Servicio de registro de usuario */
ProyectoNE.factory("loginService", ['$http','Config',function($http, Config){  
    var obj = {};
    obj.login = function(registro){ 
        return $http.post(Config.backendURL + "Login", {
         data: {index: false,
                spaces: false,
                registro: registro}
      });
    };
    return obj;
}]);
