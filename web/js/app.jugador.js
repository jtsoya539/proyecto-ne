/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appJugador = angular.module('jugador', []);
appJugador.controller('ControllerJugador', function($scope, $http){
    console.log("inicializo jugador..");
    $scope.player = {};    

    $scope.enviar = function(pid){
        console.log("entro a enviar solicitud de jugador..");
        /* Envio request al servidor */
        $http.get("GetDatos?ori=datos_jugador&p="+pid)
        .then(function(response) {
            $scope.player = response.data.jugador;
            // $scope.registro.integrantes = [];
            console.log("imprimo respuesta 3..");
            console.log(response);
            w3.show('#jugador');
        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });
    };

});
