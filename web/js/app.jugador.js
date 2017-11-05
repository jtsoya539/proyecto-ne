/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appJugador = angular.module('jugador', ['angular.filter']);
appJugador.controller('ControllerJugador', function($scope, $http){
    console.log("inicializo jugador..");
    $scope.player = {};
    $scope.miEquipo = {
        //nombre: '',
        //descripcion: '',
        integrantes: []
    };

    /* Funcion para agregar un integrante a mi equipo */
    $scope.agregarIntegrante = function(integrante){
        console.log('entro a agregar');
        $scope.miEquipo.integrantes.push(
            integrante
        );
        integrante.mt = 1; //jugador agregado
        console.log('agregado');
   };

    /* Funcion para eliminar un integrante de mi equipo */
    $scope.eliminarIntegrante = function(integrante){
        console.log("entro a eliminar"+integrante.nom);
        var index = $scope.miEquipo.integrantes.indexOf(integrante);
        console.log("index: "+index);
        if (index > -1) {
            $scope.miEquipo.integrantes.splice(index, 1);
            integrante.mt = 0; //jugador agregado
            console.log("eliminado");
        }
    };

    /* Funcion para visualizar datos de un jugador */
    $scope.verIntegrante = function(integrante){
            console.log("entro a datos de: "+integrante.nom);
            $scope.player = integrante;
            w3.show('#jugador');
    };

    $scope.jugadores = {};
    /* Funcion que obtiene datos de los jugadores */
    $scope.getJugadores = function(datos) {
        $http.get("GetDatos?ori=datos_jugadores")
        .then(function(response) {
            $scope.jugadores = response.data.jugadores;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo respuesta..");
            console.log(response);
            $scope.getMiEquipo();
        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });
    };

    /* Funcion que carga mi equipo */
    $scope.getMiEquipo = function(datos) {
        console.log('entro a cargar mi equipo.');
        angular.forEach($scope.jugadores, function(jugador, i) {
            if(jugador.mt === 1){
                $scope.agregarIntegrante(jugador);
            }
        });
    };
    $scope.getJugadores();

});
