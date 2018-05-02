/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appRegister = angular.module('incidencia', []);
appRegister.controller('ControllerIncidencia', ControllerIncidencia);

function ControllerIncidencia($scope, $http) {
    /* Definimos registro con los datos de la incidencia */
    $scope.incidencia = {
        torneo: 'PRI-APE18',
        partido: '',
        club: '',
        jugador: '',
        periodo: '',
        tiempo: '',
        tipo: ''
        //integrantes: []
    };

    /* Funcion que obtiene datos de los partidos */
    $scope.getPartidos = function() {
        $http.post("GetDatos?ori=datos_partidos", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    torneo: $scope.incidencia.torneo}] }
      })
        .then(function(response) {
            $scope.partidos = response.data.partidos;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo partidos..");
            console.log(response);
        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });
    };

    /* Funcion que obtiene datos de los clubes */
    $scope.getClubes = function(datos) {
        $http.post("GetDatos?ori=datos_clubes", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    partido: datos}]}
      })
        .then(function(response) {
            $scope.clubes = response.data.clubes;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo clubes..");
            console.log(response);
        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });
    };

    /* Funcion que obtiene datos de los jugadores */
    $scope.getJugadores = function(datos) {
        $http.post("GetDatos?ori=datos_jugadores", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    miEquipo: 'N',
                    club: datos}]}
      })
        .then(function(response) {
            $scope.jugadores = response.data.jugadores;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo jugadores..");
            console.log(response);
        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });
    };

    /* Funcion que obtiene datos de los tipos de incidencia */
    $scope.getIncidenciaTipos = function(datos) {
        $http.post("GetDatos?ori=datos_incidencia_tipos", {
         data: {index: false,
                spaces: false }
      })
        .then(function(response) {
            $scope.incidenciaTipos = response.data.incidenciaTipos;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo tipos de incidencia..");
            console.log(response);
        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });
    };

    /* Funcion que envia los datos del nuevo usuario al servidor */
    $scope.enviar = function(){
       console.log("entro a eviar..");
       /* Envio request al servidor */
       $http.post("AddIncidencia", {
         data: {index: false,
                spaces: false,
                incidencia: $scope.incidencia}
      })
    .then(function(response) {
         $scope.incidencia.torneo = 'PRI-APE18';
         $scope.incidencia.partido = '';
         $scope.incidencia.club = '';
         $scope.incidencia.jugador = '';
         $scope.incidencia.periodo = '';
         $scope.incidencia.tiempo = '';
         $scope.incidencia.tipo = '';
        // $scope.incidencia.integrantes = [];
       console.log("imprimo respuesta..");
         console.log(response);
        // Mensaje 
        //w3.hide('#incidencia');
        NeAlert(response.data.state, "Atencion!", response.data.message);

    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });       
   };

    $scope.partidos = {};
    $scope.clubes = {};
    $scope.jugadores = {};
    $scope.incidenciaTipos = {};
    $scope.getPartidos();
    $scope.getClubes();
    $scope.getJugadores();
    $scope.getIncidenciaTipos();

    $scope.changePartido = function() {
        console.log('change partido: '+$scope.incidencia.partido.id);
        $scope.getClubes(/*'&p='+*/$scope.incidencia.partido.id);
    };

    $scope.changeClub = function() {
        if($scope.incidencia.club !== null)
        {
            console.log('change club: '+$scope.incidencia.club.id);
            $scope.getJugadores(/*'&p='+*/$scope.incidencia.club.id);
        }
    };

};
