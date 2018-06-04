/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appResultado = angular.module('resultado', ['angular.filter']);
appResultado.controller('ControllerResultado', ControllerResultado);

function ControllerResultado($scope, scoresFactory, incidencesFactory, incidenceTypesFactory, playersFactory) {
    $scope.profile = ""; //DEFAULT - USUARIO
    $scope.tab = ""; // TEAM - DEF - HELP - LEAGUE - SCORE
    $scope.sesion = {};
    $scope.currentMatch = "";
    $scope.openMatch = false;

    $scope.jornada;
    $scope.jornadaCant = 22;

    $scope.clubes = {};

    /* Funcion para modificar la liga actual */
    $scope.setCurrentMatch = function(currentMatch){
        $scope.currentMatch = currentMatch;
    };

    /* Funcion para modificar la liga actual */
    $scope.setOpenMatch = function(){
        if($scope.openMatch)
            $scope.openMatch = false;
        else
            $scope.openMatch = true;
    };

    /* Funcion para modificar la jornada */
    $scope.setJornada = function(diferencia){
        if(($scope.jornada + diferencia) < $scope.jornadaCant)
            $scope.jornada += diferencia;
        if($scope.jornada < 1)
            $scope.jornada = 1;
    };

    $scope.scores = {};
    /* Funcion que obtiene los resultados de una jornada */
    $scope.getScores = function() {
        $.LoadingOverlay("show");
        console.log("entro a los resultados de la jornada " + $scope.jornada);
        document.getElementById("appJugador").style.cursor = "wait";

        scoresFactory.fetchScores($scope.jornada)
        .then(function(response) {
            $scope.scores = response.data.partidos;
            // $scope.registro.integrantes = [];
            document.getElementById("appJugador").style.cursor = "default";
            console.log("imprimo resultados..");
            console.log(response);
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
            alert('Error al intentar obtener resultados.');
            alert(response);
            $.LoadingOverlay("hide");
        });
    };
    //$scope.getScores();

    /* Funcion para modificar la jornada */
    $scope.setCurrentJornada = function(jornada){
        $scope.jornada = jornada;
        console.log("jornada actual: "+$scope.jornada);
        $scope.getScores();
    };

    $scope.players = {};
    /* Funcion que obtiene los jugadores de un partido */
    $scope.getPlayers = function() {
        //$("#MatchPlayersListView").LoadingOverlay("show", {fontawesomeResizeFactor : 1.2, fontawesomeColor : "#202020"});
        console.log("entro a jugadores del partido " + $scope.currentMatch.id);
        document.getElementById("appJugador").style.cursor = "wait";
        $scope.players = {};

        playersFactory.fetchPlayers($scope.currentMatch.id)
        .then(function(response) {
            $scope.players = response.data.partidoJugadores;
            document.getElementById("appJugador").style.cursor = "default";
            console.log("imprimo los jugadores del partido " + $scope.currentMatch.id);
            console.log($scope.players);
            $("#MatchPlayersListView").LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
            alert('Error al intentar obtener jugadores.');
            alert(response);
            $("#MatchPlayersListView").LoadingOverlay("hide");
        });
    };

    $scope.incidences = {};
    /* Funcion que obtiene las incidencias de un partido */
    $scope.getIncidences = function() {
        //$(".timeline").LoadingOverlay("show", {fontawesomeResizeFactor : 1.2, fontawesomeColor : "#202020"});
        console.log("entro a incidencias del partido " + $scope.currentMatch.id);
        document.getElementById("appJugador").style.cursor = "wait";
        $scope.incidences = {};

        incidencesFactory.fetchIncidences($scope.currentMatch.id)
        .then(function(response) {
            $scope.incidences = response.data.incidencias;
            document.getElementById("appJugador").style.cursor = "default";
            console.log("imprimo las incidencias del partido " + $scope.currentMatch.id);
            console.log($scope.incidences);
            $("#MatchPlayersListView").LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
             alert('Error al intentar obtener incidencias.');
             alert(response);
            $("#MatchPlayersListView").LoadingOverlay("hide");
        });
    };

    $scope.incidenceTypes = {};
    /* Funcion que obtiene los tipos de incidencias */
    $scope.getIncidenceTypes = function() {
        $.LoadingOverlay("show");
        console.log("entro a tipos de incidencias ");
        $scope.incidenceTypes = {};

        incidenceTypesFactory.fetchIncidenceTypes()
        .then(function(response) {
            $scope.incidenceTypes = response.data.incidenciaTipos;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo tipos de incidencia ");
            console.log($scope.incidenceTypes);
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
             alert('Error al intentar obtener incidencias.');
             alert(response);
        $.LoadingOverlay("hide");
        });
    };
    $scope.getIncidenceTypes();

    /* Funcion para visualizar datos de una jornada */
    $scope.verJornada = function(diferencia){
        $scope.setJornada(diferencia);
        console.log("jornada: "+$scope.jornada);
        $scope.getScores();
    };

    /* Funcion para visualizar datos de un partido */
    $scope.verPartido = function(partido){
        console.log("entro a detalles del partido: "+partido.id);
        if($scope.openMatch) {
            if($scope.currentMatch.id === partido.id){
                console.log("cierro detalles del partido: "+partido.id);
                $scope.incidences = {};
                $scope.setCurrentMatch(null);
                w3.toggleClass('#match'+partido.id, 'w3-hide');
                $scope.setOpenMatch();
            }
            else {
                w3.addClass('.match', 'w3-hide'); // Oculta todos los .match
                $scope.setCurrentMatch(partido);
                $scope.getPlayers();
                $scope.getIncidences();
                w3.toggleClass('#match'+partido.id, 'w3-hide')
            }
        }
        else {
            //w3.addClass('.match', 'w3-hide'); // Oculta todos los .match
            $scope.setCurrentMatch(partido);
            $scope.getPlayers();
            $scope.getIncidences();
            w3.toggleClass('#match'+partido.id, 'w3-hide')
            $scope.setOpenMatch();
        }
    };

}

/* Fabrica de datos de los resultados */
appResultado.factory("scoresFactory", ['$http',function($http){  
    var obj = {};
    obj.fetchScores = function(jor){ 
        return $http.post("GetDatos?ori=datos_partidos", {
         data: {index: false,
                spaces: false,
                extraData: [{
                    torneo: sesion.torneo,
                    jornada: jor}] }
      });
    };
    return obj;
}]);

/* Fabrica de datos de los jugadores de un partido */
appResultado.factory("playersFactory", ['$http',function($http){  
    var obj = {};
    obj.fetchPlayers = function(id){
        return $http.post("GetDatos?ori=datos_partido_jugadores", {
         data: {index: false,
                spaces: false,
                extraData: [{
                    partido: id } ]
               }
      });
    };
    return obj;
}]);

/* Fabrica de datos de las incidencias de un partido */
appResultado.factory("incidencesFactory", ['$http',function($http){  
    var obj = {};
    obj.fetchIncidences = function(id){
        return $http.post("GetDatos?ori=datos_incidencias", {
         data: {index: false,
                spaces: false,
                extraData: [{
                    partido: id } ]
               }
      });
    };
    return obj;
}]);

/* Fabrica de datos de los tipos de incidencia */
appResultado.factory("incidenceTypesFactory", ['$http',function($http){  
    var obj = {};
    obj.fetchIncidenceTypes = function(){
        return $http.post("GetDatos?ori=datos_incidencia_tipos", {
         data: {index: true,
                spaces: false
               }
      });
    };
    return obj;
}]);
