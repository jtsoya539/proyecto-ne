/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appLiga = angular.module('liga', ['angular.filter']);
appLiga.controller('ControllerLiga', ControllerLiga);

function ControllerLiga($scope, leaguesFactory, leagueTeamsFactory, leagueSend) {
    $scope.profile = ""; //DEFAULT - USUARIO
    $scope.tab = ""; // TEAM - DEF - HELP - LEAGUE
    $scope.sesion = {};
    $scope.leagues = {};
    $scope.currentLeague = "";
    $scope.rankMin = 1;
    $scope.teamsPerPage = 2;

    $scope.newLeague = {};
    $scope.joinLeague = {};
    $scope.inviteLeague = {};

    /* Funcion para modificar la liga actual */
    $scope.setCurrentLeague = function(currentLeague){
        $scope.currentLeague = currentLeague;
    };

    /* Funcion para modificar el ranking minimo */
    $scope.setRankMin = function(diferencia){
        if(($scope.rankMin + diferencia) < $scope.currentLeague.cant)
            $scope.rankMin += diferencia;
        if($scope.rankMin < 1)
            $scope.rankMin = 1;
    };

    /* Funcion que obtiene las ligas */
    $scope.getLeagues = function() {
        $.LoadingOverlay("show");
        $scope.leagues = {};

        leaguesFactory.fetchLeagues()
        .then(function(response) {
            $scope.leagues = response.data.ligas;
            // $scope.registro.integrantes = [];
            console.log("imprimo ligas..");
            console.log(response);
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
             alert('Error al intentar obtener ligas.');
             alert(response);
            $.LoadingOverlay("hide");
        });
    };

    $scope.leagueTeams = {};
    /* Funcion que obtiene los equipos de una liga */
    $scope.getLeagueTeams = function() {
        $("#ranking2").LoadingOverlay("show", {fontawesomeResizeFactor : 0.4});
        $scope.leagueTeams = {};

        leagueTeamsFactory.fetchLeagueTeams($scope.currentLeague.id, $scope.rankMin, $scope.teamsPerPage)
        .then(function(response) {
            $scope.leagueTeams = response.data.ligaEquipos;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo equipos de la liga " + $scope.currentLeague.id);
            console.log($scope.leagueTeams);
            $("#ranking2").LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
             alert('Error al intentar obtener equipos.');
             alert(response);
            $("#ranking2").LoadingOverlay("hide");
        });
    };

    /* Funcion para visualizar datos de un ranking */
    $scope.verRanking = function(liga, diferencia){
        console.log("entro a datos de: "+liga.id);
        $scope.setCurrentLeague(liga);
        $scope.setRankMin(diferencia);
        console.log("rankMin: "+$scope.rankMin+" | teamsPerPage: "+$scope.teamsPerPage);
        $scope.getLeagueTeams();
        w3.show('#ranking');
    };

    /* Funcion para ocultar datos de un ranking */
    $scope.ocultarRanking = function(){
        console.log("cerrado datos de: "+$scope.currentLeague.id);
        $scope.leagueTeams = {};
        $scope.setCurrentLeague(null);
        $scope.rankMin = 1;
        w3.hide('#ranking');
    };

    /* Funcion que envia los datos de la nueva liga al servidor */
    $scope.enviarLiga = function(action){
        league = {};
        if(action === "new-league") { //crear nueva liga
            if (!($("#leagueName").val())) {
                NeAlert("ERROR", "Atencion!", "Debe ingresar el nombre de la nueva liga.");
                return false;
            }
            league = $scope.newLeague;
        }
        else if(action === "join-league") {
            if (!($("#leagueCode").val())) {
                NeAlert("ERROR", "Atencion!", "Debe ingresar el codigo de la liga.");
                return false;
            }
            league = $scope.joinLeague;
        }
        else if(action === "invite-league") {
            if (!($("#leagueUser").val())) {
                NeAlert("ERROR", "Atencion!", "Debe ingresar el usuario a invitar.");
                return false;
            }
            $scope.inviteLeague.nombre = $scope.currentLeague.id;
            league = $scope.inviteLeague;
        }

        console.log("entro a enviar liga..");
        $.LoadingOverlay("show");
        /* Envio request al servidor */
        leagueSend.sendLeague(action, league)
        .then(function(response) {
            // $scope.registro.integrantes = [];
           console.log("imprimo respuesta..");
             console.log(response);
            // Mensaje 
            w3.hide('#newLeague');
            w3.hide('#joinLeague');
            w3.hide('#inviteLeague');
            $scope.newLeague = {};
            $scope.joinLeague = {};
            $scope.inviteLeague = {};
            NeAlert(response.data.state, "Atencion!", response.data.message);
            if(response.data.state === "OK")
                $scope.getLeagues();
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro de liga.');
             alert(response);
            $.LoadingOverlay("hide");
        });       
    };
    
    $scope.getLeagues();

}

/* Fabrica de datos de las ligas */
appLiga.factory("leaguesFactory", ['$http',function($http){  
    var obj = {};
    obj.fetchLeagues = function(){ 
        return $http.post("GetDatos?ori=datos_ligas", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    misLigas: 'S'
                            }]}
      });
    };
    return obj;
}]);

/* Fabrica de datos de los equipos de una liga */
appLiga.factory("leagueTeamsFactory", ['$http',function($http){  
    var obj = {};
    obj.fetchLeagueTeams = function(id, rankMin, teamsPerPage){ 
        return $http.post("GetDatos?ori=datos_liga_equipos", {
         data: {index: false,
                spaces: false,
                extraData: [{
                    idLiga: id,
                    rankMin: rankMin,
                    equiPorPag: teamsPerPage} ]
               }
      });
    };
    return obj;
}]);

/* Envío de confirmación de crear/unirse a liga */
appLiga.factory("leagueSend", ['$http',function($http){  
    var obj = {};
    obj.sendLeague = function(action, league){
        return $http.post("UpdLeague", {
         data: {index: false,
                spaces: false,
                action: action,
                liga: {
                    torneo: "PRI-APE18",
                    nombre: league.nombre,
                    jornadaInicio: 1,
                    codigo: league.codigo,
                    usuario: league.usuario}
               }
      });
    };
    return obj;
}]);
