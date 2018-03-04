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
    $scope.profile = "USUARIO"; //DEFAULT - USUARIO
    $scope.tab = "TEAM"; // TEAM - DEF - HELP
    $scope.view = "PITCH"; // PITCH - LIST
    $scope.player = '';
    $scope.message = 'Para cambiar tu capitan, usa el menu que aparece al hacer clic en un jugador.';
    $scope.substitution = '';
    $scope.transfer = '';
    $scope.miEquipoBackup = {};
    $scope.miEquipo = {
        nombre: '',
        //descripcion: '',
        captain: '112',
        subcaptain: '138',
        integrantes: [],
        transferencias: []
    };

    /* Funcion para agregar un integrante a mi equipo */
    $scope.agregarIntegrante = function(integrante){
        console.log('entro a agregar a mi equipo ' + integrante.nom + '.');
        var agregado = false;
        var existe = false;
        var transferencia = ($scope.profile === "USUARIO") && ($scope.tab === "DEF");

        if(transferencia) {
            if($scope.transfer === '') {
                $scope.alert("Atencion!", "Ud. no posee una transferencia pendiente."+"<br>"+"Debe seleccionar un jugador de su equipo.");
                event.stopPropagation();
                return;
            }
        }

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
        if (!existe && !agregado) {
            $scope.alert("Atencion!", "No se puede agregar al equipo."+"<br>"+"Jugador: "+integrante.nom);
        }
        if(transferencia) {
            if(agregado) {
                // intercambio de titular/suplente
                var titular = integrante.tit;
                integrante.tit = $scope.transfer.tit;
                $scope.transfer.tit = titular;

                var registrado = false;
                //si el jugador salio y volvio a entrar, se actualiza el jugador que salio en primer lugar y se marca como registrada la transferencia
                for (var i = 0, len = $scope.miEquipo.transferencias.length; i < len; i++) {
                    var jugador = $scope.miEquipo.transferencias[i].out;
                    if(jugador.id === integrante.id) {
                        $scope.miEquipo.transferencias[i].out =  $scope.transfer;
                        registrado = true;
                        //$scope.transfer = $scope.miEquipo.transferencias[i].out;
                        //$scope.miEquipo.transferencias.splice(i, 1);
                        //console.log("transferencia pendiente: "+$scope.transfer.nom);
                    }
                }
                if(!registrado) { //si no esta registrada la transferencia, se agrega la misma
                    if($scope.transfer.id !== integrante.id) {
                        $scope.miEquipo.transferencias.push({
                            out: $scope.transfer,
                            in: integrante
                        });
                        console.log("transferencias realizadas: "+$scope.miEquipo.transferencias);
                    }
                }

                $scope.transfer = '';
            }
        }
        console.log('agregado ' + agregado + ' ' + existe);
        console.log($scope.miEquipo);
        console.log($scope.transfer);
        //console.log($scope.misJugadores);
   };

    /* Funcion para eliminar un integrante de mi equipo */
    $scope.eliminarIntegrante = function(integrante){
        console.log('entro a eliminar de mi equipo: '+integrante.nom);
        var eliminado = false;
        var existe1 = false;
        var transferencia = ($scope.profile === "USUARIO") && ($scope.tab === "DEF");
        var index = $scope.miEquipo.integrantes.indexOf(integrante);
        console.log("index: "+index);

        if(transferencia) {
            if($scope.transfer === '') {
                $scope.transfer = integrante;
                console.log("transferencia pendiente: "+$scope.transfer.nom);
            }
            else {
                $scope.alert("Atencion!", "Ud. posee una transferencia pendiente."+"<br>"+"Jugador: "+$scope.transfer.nom);
                event.stopPropagation();
                return;
            }
        }
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
                    var jugadorNulo = {"id":"","nom":"X","cl":"DEF","club":"","color":color,"pos":posicion,"jor":"15","ptsj":"10","ptst":"","prec":"","eleg":"21.5","mt":1};
                    $scope.misJugadores.splice(i, 1, jugadorNulo);
                    eliminado = true;
                    break;
                }
            }
            //});
            //si el jugador entro y volvio a salir, la transferencia pendiente es el salio en primer lugar y se deshace la transferencia
            for (var i = 0, len = $scope.miEquipo.transferencias.length; i < len; i++) {
                var jugador = $scope.miEquipo.transferencias[i].in;

                if(jugador.id === integrante.id) {

                    $scope.transfer = $scope.miEquipo.transferencias[i].out;

                    // intercambio de titular/suplente
                    var titular = integrante.tit;
                    integrante.tit = $scope.transfer.tit;
                    $scope.transfer.tit = titular;

                    $scope.miEquipo.transferencias.splice(i, 1);
                    console.log("transferencia pendiente: "+$scope.transfer.nom);
                }
            }
        }
        else {
            $scope.transfer = '';
        }
        console.log('eliminado');
        console.log($scope.miEquipo);
        console.log($scope.transfer);
    
    };

    /* Funcion para visualizar datos de un jugador */
    $scope.verIntegrante = function(integrante){
        console.log("entro a datos de: "+integrante.nom);
        //console.log(integrante);
        $scope.player = integrante;
        w3.show('#jugador');
    };

    /* Funcion para cancelar una sustitucion */
    $scope.cancelSubstitution = function(integrante){
        console.log("entro a cancelar una sustitucion: "+integrante.nom);
        //validar que no haya una modificacion pendiente
        if($scope.substitution.id === integrante.id)
            $scope.substitution = '';
    };

    /* Funcion para iniciar una sustitucion */
    $scope.makeSubstitution = function(integrante){
        console.log("entro a sustitucion: "+integrante.nom);
        if( $scope.substitution === '') {
            $scope.substitution = integrante;
        }
        else if ($scope.substitution.id === integrante.id){
            $scope.cancelSubstitution(integrante);
        }
        else {
            var sustituido = false;
            //validar que haya una modificacion pendiente
            if($scope.substitution.tit === "N" && integrante.tit === "S") {
                $scope.substitution.tit = "S";
                integrante.tit = "N";
                sustituido = true;
                if($scope.miEquipo.captain === integrante.id)
                    $scope.miEquipo.captain = $scope.substitution.id;
                if($scope.miEquipo.subcaptain === integrante.id)
                    $scope.miEquipo.subcaptain = $scope.substitution.id;
            } else if($scope.substitution.tit === "S" && integrante.tit === "N") {
                $scope.substitution.tit = "N";
                integrante.tit = "S";
                sustituido = true;
                if($scope.miEquipo.captain === $scope.substitution.id)
                    $scope.miEquipo.captain = integrante.id;
                if($scope.miEquipo.subcaptain === $scope.substitution.id)
                    $scope.miEquipo.subcaptain = integrante.id;
            }

            if(sustituido) {
                for (var i = 0, len = $scope.misJugadores.length; i < len; i++) {
                    var jugador = $scope.misJugadores[i];
                    if(jugador.id === integrante.id) {
                        $scope.misJugadores[i].tit = integrante.tit;
                        //$scope.misJugadores[i].mc = integrante.mc;
                        //$scope.misJugadores[i].smc = integrante.smc;
                        //break;
                    }
                    if(jugador.id === $scope.substitution.tit) {
                        $scope.misJugadores[i].tit = $scope.substitution.tit;
                        //$scope.misJugadores[i].mc = $scope.substitution.mc;
                        //$scope.misJugadores[i].msc = $scope.substitution.msc;
                        //break;
                    }
                }        
                $scope.substitution = '';
            }
            console.log("sustitucion realizada.");
        }
    };

    /* Funcion para verificar que una sustitucion sea factible */
    $scope.enabledSubstitution = function(integrante){
        //console.log("entro a verificar sustitucion: "+integrante.nom);
        //validar que sea factible la sustitucion
        return $scope.substitution !== '' &&
                    ($scope.substitution.tit !== integrante.tit &&
                        (($scope.substitution.pos === 'POR' && integrante.pos === 'POR') || 
                            ($scope.substitution.pos !== 'POR' && integrante.pos !== 'POR')));
    };

    /* Funcion para modificar capitan */
    $scope.setCaptain = function(captain){
        console.log("entro a setear capitan: "+captain);
        if($scope.miEquipo.subcaptain == captain)
            $scope.miEquipo.subcaptain = $scope.miEquipo.captain;
        $scope.miEquipo.captain = captain;
    };

    /* Funcion para modificar sub-capitan */
    $scope.setSubCaptain = function(subcaptain){
        console.log("entro a setear sub-capitan: "+subcaptain);
        if($scope.miEquipo.captain == subcaptain)
            $scope.miEquipo.captain = $scope.miEquipo.subcaptain;
        $scope.miEquipo.subcaptain = subcaptain;
    };

    $scope.jugadores = {};
    /* Funcion que obtiene datos de los jugadores */
    $scope.getJugadores = function(datos) {
        $http.post("GetDatos?ori=datos_jugadores", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    miEquipo: 'N',
                    club: ''}]}
      })
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
        $http.post("GetDatos?ori=datos_jugadores", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    miEquipo: 'S',
                    club: datos}]}
      })
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

    $scope.clubes = {};
    /* Funcion que obtiene datos de los clubes */
    $scope.getClubes = function(datos) {
        $http.post("GetDatos?ori=datos_clubes", {
         data: {index: true,
                spaces: false }
      })
        .then(function(response) {
            $scope.clubes = response.data.clubes;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo clubes..");
            console.log($scope.clubes);

        }, function(response) {
            //Second function handles error
             alert('Error al intentar enviar el registro.');
             alert(response);
        });
    };

    $scope.posiciones = {};
    /* Funcion que obtiene datos de las posiciones */
    $scope.getPosiciones = function(datos) {
        $http.post("GetDatos?ori=datos_posiciones", {
         data: {index: true,
                spaces: false }
      })
        .then(function(response) {
            $scope.posiciones = response.data.posiciones;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo posiciones..");
            console.log($scope.posiciones);

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
        //$scope.miEquipoBackup = $scope.miEquipo;
        //$scope.miEquipoBackup = JSON.parse(JSON.stringify($scope.miEquipo));
        //$scope.miEquipoBackup = jQuery.extend({}, $scope.miEquipo);
        //console.log('backup hecho');
    };
    $scope.getJugadores();
    $scope.getMisJugadores();
    $scope.getClubes();
    $scope.getPosiciones();

    /* Funcion que envia los datos del nuevo equipo al servidor */
    $scope.enviarEquipo = function(){
       console.log("entro a eviar..");
       /* Envio request al servidor */
       $http.post("UpdTeamUser", {
         data: {nombre: $scope.miEquipo.nombre,
                jugadores: $scope.miEquipo.integrantes}
      })
    .then(function(response) {
        // $scope.registro.integrantes = [];
       console.log("imprimo respuesta..");
         console.log(response);
        // Mensaje 
        //w3.hide('#register');
        w3.hide('#confirmTeam');
        w3.hide('#confirmTransfer');
        $scope.alert("Atencion!", response.data);
    }, function(response) {
        //Second function handles error
         alert('Error al intentar enviar el registro.');
         alert(response);
    });       
       
   };

    /* Funcion que envia los datos del nuevo equipo al servidor */
    $scope.enviarEquipoDefault = function(){
        if (!($("#teamName").val())) {
            alert('Debe ingresar el nombre de su equipo');
            return false;
        }
        $scope.enviarEquipo();
    }

    /* Funcion para mostrar mensaje en pantalla */
    $scope.alert = function(titulo, contenido){
        console.log('entro a mostrar mensaje.');
        $("#mensaje_titulo").html(titulo);
        $("#mensaje_contenido").html(contenido);
        w3.removeClass('.w3-modal', 'w3-show'); // Oculta todos los .w3-modal
        w3.addClass('#mensaje', 'w3-show'); // Muestra el mensaje
    };

    /* Funcion para cambiar el mensaje */
    $scope.setMessage = function(message) {
        $scope.message = message; //Hace el cambio de vista
    };

    /* Funcion para cambiar vista */
    $scope.setView = function(view) {
        $scope.view = view; //Hace el cambio de vista
    };

    /* Funcion para cambiar pestaña */
    $scope.setTab = function(tab) {
        console.log('entro a pestanha:' + tab);
        if(tab === 'DEF')
            $scope.setMessage('Selecciona un maximo de 3 jugadores de un solo equipo.');
        else if(tab === 'TEAM')
            $scope.setMessage('Para cambiar tu capitan, usa el menu que aparece al hacer clic en un jugador.');
        else
            $scope.setMessage('');
        //$scope.miEquipo = $scope.miEquipoBackup;
        //console.log('backup levantado');
        $scope.tab = tab; //Hace el cambio de pestaña
    };

    /* Funcion para cambiar perfil */
    $scope.setProfile = function(profile) {
        console.log('entro a perfil:' + profile);
        if(profile === 'DEFAULT')
            $scope.setTab('DEF');
        else if(profile === 'USUARIO')
            $scope.setTab('TEAM');
        //Hace el cambio de perfil
        $scope.profile = profile; 
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
