/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appRegister = angular.module('register', []);
appRegister.controller('ControllerRegistro', ControllerRegistro);

function ControllerRegistro($scope, $http, contriesFactory, clubsFactory) {
    /* Definimos registro con los datos del usuario */
    $scope.registro = {
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
    $scope.clave = '';
    $scope.paises = {};
    $scope.clubes = {};

    /* Obtenemos los paises */
    contriesFactory.fetchCountries()
    .then(function(response) {
        $scope.paises = response.data.paises;
        // $scope.registro.integrantes = [];
        console.log("imprimo paises..");
        console.log(response);
    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });

    /* Obtenemos los clubes */
    clubsFactory.fetchClubs()
    .then(function(response) {
        $scope.clubes = response.data.clubes;
        // $scope.registro.integrantes = [];
        console.log("imprimo clubes..");
        console.log(response);
    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });

    /* Funcion que envia los datos del nuevo usuario al servidor */
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
       /* Envio request al servidor */
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
            NeAlert(response.data.state, "Atencion!", response.data.message);

        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });       
       
   };

}

/* Fabrica de datos de los paises */
appRegister.factory("contriesFactory", ['$http',function($http){  
    var obj = {};
    obj.fetchCountries = function(){ 
        return $http.post("GetDatos?ori=datos_paises", {
         data: {index: false,
                spaces: false }
      });
    };
    return obj;
}]);

/* Fabrica de datos de los clubes */
appRegister.factory("clubsFactory", ['$http',function($http){  
    var obj = {};
    obj.fetchClubs = function(){ 
        return $http.post("GetDatos?ori=datos_clubes", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    partido: ''}]}
      });
    };
    return obj;
}]);
