/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('incidencia', [])
.controller('ControllerIncidencia', function($scope, $http){
    /* Definimos registro con los datos de la incidencia */
    $scope.incidencia = {
        torneo: 'PRI-CLA17',
        partido: '',
        club: '',
        periodo: '',
        tiempo: '',
        tipo: ''
        //integrantes: []
    };
    $scope.clave = '';
    $scope.partidos = {};
    $scope.clubes = {};
    $scope.incidenciaTipos = {};

    /* Obtenemos datos de los partidos */
    $http.get("GetDatos?ori=datos_partidos")
    .then(function(response) {
        $scope.partidos = response.data.partidos;
        // $scope.incidencia.integrantes = [];
        console.log("imprimo respuesta..");
        console.log(response);
    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });

    /* Obtenemos datos de los clubes */
    $http.get("GetDatos?ori=datos_clubes")
    .then(function(response) {
        $scope.clubes = response.data.clubes;
        // $scope.incidencia.integrantes = [];
        console.log("imprimo respuesta..");
        console.log(response);
    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });

    /* Obtenemos datos de los tipos de incidencia */
    $http.get("GetDatos?ori=datos_incidencia_tipos")
    .then(function(response) {
        $scope.incidenciaTipos = response.data.incidenciaTipos;
        // $scope.incidencia.integrantes = [];
        console.log("imprimo respuesta..");
        console.log(response);
    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });

    /* Funcion que envia los datos del nuevo usuario al servidor */
    $scope.enviar = function(){
       console.log("entro a eviar..");
       /* Envio request al servidor */
       $http.post("AddIncidencia", {
         data: {incidencia: $scope.incidencia}
      })
    .then(function(response) {
         $scope.incidencia.torneo = 'PRI-CLA17';
         $scope.incidencia.partido = '';
         $scope.incidencia.club = '';
         $scope.incidencia.periodo = '';
         $scope.incidencia.tiempo = '';
         $scope.incidencia.tipo = '';
        // $scope.incidencia.integrantes = [];
       console.log("imprimo respuesta..");
         console.log(response);
        // Mensaje 
        w3.hide('#incidencia');
        $("#mensaje_titulo").html("Atencion!");
        $("#mensaje_contenido").html(response.data);
        w3.removeClass('.w3-modal', 'w3-show'); // Oculta todos los .w3-modal
        w3.addClass('#mensaje', 'w3-show'); // Muestra el mensaje

    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });       
       
   };
});
