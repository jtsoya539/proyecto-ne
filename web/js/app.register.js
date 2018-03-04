/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('register', [])
.controller('ControllerRegistro', function($scope, $http){
    /* Definimos registro con los datos del usuario */
    $scope.registro = {
        nombre: '',
        apellido: '',
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

    /* Obtenemos datos de los paises */
    $http.post("GetDatos?ori=datos_paises", {
         data: {index: false,
                spaces: false }
      })
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

    /* Obtenemos datos de los clubes */
    $http.post("GetDatos?ori=datos_clubes", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    partido: ''}]}
      })
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
         data: {registro: $scope.registro}
      })
    .then(function(response) {
         $scope.registro.nombre = '';
         $scope.registro.apellido = '';
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
