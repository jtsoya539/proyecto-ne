/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appJugador = angular.module('jugador', ['angular.filter','angularUtils.directives.dirPagination']);
appJugador.factory('PagerService', PagerService);
appJugador.controller('ControllerJugador', ControllerJugador);

function ControllerJugador($scope, $http, PagerService) {    
    console.log("inicializo jugador..");
    $scope.player = {};
    $scope.miEquipo = {
        //nombre: '',
        //descripcion: '',
        integrantes: []
    };

    /* Funcion para agregar un integrante a mi equipo */
    $scope.agregarIntegrante = function(integrante){
        console.log('entro a agregar a mi equipo ' + integrante.nom + '.');
        var agregado = false;
        var existe = false;
        //angular.forEach($scope.misJugadores, function(jugador, i) {
        for (var i = 0, len = $scope.misJugadores.length; i < len; i++) {
            var jugador = $scope.misJugadores[i];
            if(jugador.id === integrante.id) {
                existe = true;
                $scope.misJugadores.splice(i, 1, integrante);
                break;
            }
            if(jugador.id === '' && !existe && !agregado && jugador.pos === integrante.pos){
                //console.log('entro if TRUE '+jugador.nom+" "+integrante.nom);
                jugador = integrante;
                $scope.misJugadores.splice(i, 1, integrante);
                agregado = true;
                break;
            }
        }
        //});
        
        if (agregado || existe) {
            //console.log('entro a agregar' + integrante.nom);
            $scope.miEquipo.integrantes.push(
                integrante
            );
            integrante.mt = 1; //jugador agregado
        }
        console.log('agregado ' + agregado + ' ' + existe);
        console.log($scope.miEquipo);
        //console.log($scope.misJugadores);
   };

    /* Funcion para eliminar un integrante de mi equipo */
    $scope.eliminarIntegrante = function(integrante){
        console.log('entro a eliminar de mi equipo: '+integrante.nom);
        var eliminado = false;
        var existe1 = false;
        var index = $scope.miEquipo.integrantes.indexOf(integrante);
        console.log("index: "+index);
        if (index > -1) {
            $scope.miEquipo.integrantes.splice(index, 1);
            integrante.mt = 0; //jugador agregado
            eliminado = true;
        }

        if(eliminado) {
            //angular.forEach($scope.misJugadores, function(jugador, i) {
            for (var i = 0, len = $scope.misJugadores.length; i < len; i++) {
                var jugador = $scope.misJugadores[i];
                if(jugador.id === integrante.id) {
                    existe1 = true;
                    //salir del loop
                }
                if(existe1){
                    //console.log('entro if TRUE '+jugador.nom+" "+integrante.nom);
                    var posicion = jugador.pos;
                    var color = jugador.color;
                    var jugadorNulo = {"id":"","nom":"X","cl":"","club":"","color":color,"pos":posicion,"jor":"15","ptsj":"10","ptst":"","prec":"","eleg":"21.5","mt":1};
                    $scope.misJugadores.splice(i, 1, jugadorNulo);
                    eliminado = true;
                    break;
                }
            }
            //});
        }
        console.log('eliminado');
    
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
            //console.log("imprimo respuesta..");
            //console.log(response);

            $scope.dummyItems = $scope.jugadores; // dummy array of items to be paged
            //console.log('dummyItems');
            //console.log($scope.dummyItems);
            $scope.pager = {};
            //$scope.setPage = setPage;

            initController();

            function initController() {
                // initialize to page 1
                $scope.setPage(1);
            }

            // cargo mi equipo
            $scope.getMiEquipo();
        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });
    };

    $scope.misJugadores = {};
    /* Funcion que carga mi equipo 2 */
    $scope.getMisJugadores = function(datos) {
        $http.get("GetDatos?ori=datos_jugadores&p=S")
        .then(function(response) {
            $scope.misJugadores = response.data.jugadores;
            //console.log("imprimo mis jugadores..");
            //console.log(response);

            // cargo mi equipo
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
    $scope.getMisJugadores();

    /* Funcion que envia los datos del nuevo equipo al servidor */
    $scope.enviarEquipo = function(){
       console.log("entro a eviar..");
       /* Envio request al servidor */
       $http.post("UpdTeamUser", {
         data: {jugadores: $scope.miEquipo.integrantes}
      })
    .then(function(response) {
        // $scope.registro.integrantes = [];
       console.log("imprimo respuesta..");
         console.log(response);
        // Mensaje 
        //w3.hide('#register');
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

    /* Funcion para ordenar tabla */
    $scope.sort = function(keyname){
        console.log('entro a ordenar por:'+keyname);
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };


    /* Funcion para cambiar pagina de tabla */
    $scope.setPage = function(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            // get pager object from service
            $scope.pager = PagerService.GetPager($scope.dummyItems.length, page);

            // get current page of items
            $scope.items = $scope.dummyItems.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
    };

}

    /* Funcion para servicio de paginacion */
    function PagerService() {
        // service definition
        var service = {};

        service.GetPager = GetPager;

        return service;

        // service implementation
        function GetPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 10;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 3) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 2) { //primeras paginas
                    startPage = 1;
                    endPage = 3;
                } else if (currentPage + 1 >= totalPages) { //ultimas paginas
                    startPage = totalPages - 2;
                    endPage = totalPages;
                } else { //demas paginas
                    startPage = currentPage - 1;
                    endPage = currentPage + 1;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }
    }
