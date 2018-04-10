/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appLiga = angular.module('liga', ['angular.filter']);
appLiga.controller('ControllerLiga', ControllerLiga);

function ControllerLiga($scope, leaguesFactory, leagueTeamsFactory) {
    $scope.profile = ""; //DEFAULT - USUARIO
    $scope.tab = ""; // TEAM - DEF - HELP - LEAGUE
    /* Definimos registro con los datos del usuario */
    /*$scope.registro = {
        pri_nombre: '',
        seg_nombre: '',
        pri_apellido: '',
        seg_apellido: '',
        correo: '',
        usuario: '',
        clave: '',
        sexo: '',
        nacimiento: '',
        pais: '',
        club: ''
        //integrantes: []
    };
    */
    $scope.sesion = {};
    $scope.leagues = {};
    $scope.currentLeague = "";
    $scope.rankMin = 1;
    $scope.teamsPerPage = 2;

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

    /* Obtenemos las ligas */
    leaguesFactory.fetchLeagues()
    .then(function(response) {
        $scope.leagues = response.data.ligas;
        // $scope.registro.integrantes = [];
        console.log("imprimo ligas..");
        console.log(response);
    }, function(response) {
        //Second function handles error
         alert('Error al intentar obtener ligas.');
         alert(response);
    });

    $scope.leagueTeams = {};
    /* Funcion que obtiene los equipos de una liga */
    $scope.getLeagueTeams = function() {
        document.getElementById("appJugador").style.cursor = "wait";
        $scope.leagueTeams = {};

        leagueTeamsFactory.fetchLeagueTeams($scope.currentLeague.id, $scope.rankMin, $scope.teamsPerPage)
        .then(function(response) {
            $scope.leagueTeams = response.data.ligaEquipos;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo equipos de la liga " + $scope.currentLeague.id);
            console.log($scope.leagueTeams);
            document.getElementById("appJugador").style.cursor = "default";

        }, function(response) {
            //Second function handles error
             alert('Error al intentar obtener equipos.');
             alert(response);
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

    /* Funcion que envia los datos del nuevo usuario al servidor */
    /*
    $scope.enviar = function(){
       console.log("valido los datos..");
        if  ($scope.registro.usuario == '') {
           alert('Debe ingresar el usuario');
           return false;
        }
        if ($scope.clave == ''){
           alert('Debe ingresar una contraseña');
           return false;
        } else {
          $scope.registro.clave = CryptoJS.MD5($scope.clave).toString();
        }

       console.log("entro a eviar..");
       /* Envio request al servidor *
       $http.post("Register", {
         data: {index: false,
                spaces: false,
                registro: $scope.registro}
      })
    .then(function(response) {
         $scope.registro.pri_nombre = '';
         $scope.registro.seg_nombre = '';
         $scope.registro.pri_apellido = '';
         $scope.registro.seg_apellido = '';
         $scope.registro.correo = '';
         $scope.registro.usuario = '';
         $scope.registro.clave = '';
         $scope.registro.sexo = '';
         $scope.registro.nacimiento = '';
         $scope.registro.pais = '';
         $scope.registro.club = '';
         $scope.clave = '';
        // $scope.registro.integrantes = [];
       console.log("imprimo respuesta..");
         console.log(response);
        // Mensaje 
        w3.hide('#register');
        $scope.alert(response.data.state, "Atencion!", response.data.message);

    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });       
       
   };
   */

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
