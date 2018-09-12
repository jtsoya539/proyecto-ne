/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//var appJugador = angular.module('jugador', ['angular.filter','ngRoute','angularUtils.directives.dirPagination']);
////Accede directamente al modulo ProyectoNE definido en app.js
'use strict';
ProyectoNE.factory('PagerService', PagerService);
ProyectoNE.controller('ControllerJugador', ControllerJugador);
ProyectoNE.config(['$routeProvider', RouteProvider]);
ProyectoNE.directive("ngIsolateApp", ngIsolateApp);

function ControllerJugador($scope, $http, PagerService) {    
    console.log("inicializo jugador..");
    $scope.profile = "USUARIO"; //DEFAULT - USUARIO
    $scope.tab = "TEAM"; // TEAM - DEF - HELP - LEAGUE
    $scope.view = "PITCH"; // PITCH - LIST
    $scope.money = 1000.00;
    $scope.player = '';
    $scope.message = 'Para cambiar tu capitan, usa el menu que aparece al hacer clic en un jugador.';
    $scope.modified = false;
    $scope.substitution = '';
    $scope.transfer = '';
    $scope.moneyBackup = '';
    $scope.jugadoresBackup = {};
    $scope.jugadores = {};
    $scope.misJugadoresBackup = {};
    $scope.misJugadores = {};
    $scope.miEquipoBackup = {};
    $scope.miEquipo = {
        nombre: '',
        //descripcion: '',
        captain: '112',
        subcaptain: '138',
        integrantes: [],
        transferencias: []
    };

    /* Funcion para restaurar equipo guardado */
    $scope.clear = function() {
        $scope.miEquipo.transferencias = [];
        $scope.substitution = '';
        $scope.transfer = '';
    };

    /* Funcion para restaurar equipo guardado */
    $scope.reset = function() {
        if($scope.modified) {
            // Example with 1 argument
            $scope.jugadores = angular.copy($scope.jugadoresBackup);
            $scope.misJugadores = angular.copy($scope.misJugadoresBackup);
            $scope.miEquipo = angular.copy($scope.miEquipoBackup);
            $scope.money = angular.copy($scope.moneyBackup);
            $scope.miEquipo.integrantes = [];
            $scope.clear();

            //isReset = S -> si es una restauracion, no hace backup
            //isBatch = S -> si es un proceso por lote, no hace verificciones al agregar integrante
            $scope.getMiEquipo("S", "S"); 
            $scope.setModified(false);
            console.log('backup restaurado');
        }
    };

    /* Funcion para guardar equipo */
    $scope.update = function(equipo) {
        // Example with 2 arguments
        //angular.copy(equipo, $scope.miEquipoBackup);
        $scope.jugadoresBackup = angular.copy($scope.jugadores);
        $scope.misJugadoresBackup = angular.copy($scope.misJugadores);
        $scope.miEquipoBackup = angular.copy($scope.miEquipo);
        $scope.moneyBackup = angular.copy($scope.money);

        console.log('backup hecho');
    };

    /* Funcion para aumentar el saldo */
    $scope.setMoney = function(diferencia){
        $scope.money += diferencia;
    };

    /* Funcion para agregar un integrante a mi equipo */
    $scope.agregarIntegrante = function(integrante, isBatch, updMoney){
        console.log('entro a agregar a mi equipo ' + integrante.nm + '.');
        var agregado = false;
        var existe = false;
        var transferencia = ($scope.profile === "USUARIO") && ($scope.tab === "DEF");

        if (updMoney !== "N") {
            if ($scope.money < integrante.pc) {
                NeAlert("ERROR", "Atencion!", "Saldo insuficiente. No se puede agregar al equipo. "+"<br>"+"Jugador: "+integrante.nm);
                    return;
            }
        }

        if(transferencia && isBatch !== "S") {
            if($scope.transfer === '') {
                NeAlert("ERROR", "Atencion!", "Ud. no posee una transferencia pendiente."+"<br>"+"Debe seleccionar un jugador de su equipo.");
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
                //console.log('entro if TRUE '+jugador.nm+" "+integrante.nm);
                jugador = integrante;
                $scope.misJugadores.splice(i, 1, integrante);
                agregado = true;
                break;
            }
        }
        //});
        
        if (agregado || existe) {
            //console.log('entro a agregar' + integrante.nm);
            $scope.miEquipo.integrantes.push(
                integrante
            );
            integrante.mt = 1; //jugador agregado
        }
        if (!existe && !agregado) {
            NeAlert(null, "Atencion!", "No se puede agregar al equipo."+"<br>"+"Jugador: "+integrante.nm);
        }
        if(agregado) {
            if (updMoney !== "N") {
                // actualizo el saldo
                $scope.setMoney(-integrante.pc);
            }

            if(transferencia) {
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
                        //console.log("transferencia pendiente: "+$scope.transfer.nm);
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

            //modificado
            if(transferencia && $scope.miEquipo.transferencias.length === 0)
                $scope.setModified(false);
            else
                $scope.setModified(true);

        }
        console.log('agregado ' + agregado + ' ' + existe);
        console.log($scope.miEquipo);
        console.log($scope.transfer);
        //console.log($scope.misJugadores);
   };

    /* Funcion para eliminar un integrante de mi equipo */
    $scope.eliminarIntegrante = function(integrante, updMoney){
        console.log('entro a eliminar de mi equipo: '+integrante.nm);
        var eliminado = false;
        var existe1 = false;
        var transferencia = ($scope.profile === "USUARIO") && ($scope.tab === "DEF");
        var index = $scope.miEquipo.integrantes.indexOf(integrante);
        console.log("index: "+index);

        if(transferencia) {
            if($scope.transfer === '') {
                $scope.transfer = integrante;
                console.log("transferencia pendiente: "+$scope.transfer.nm);
            }
            else {
                NeAlert("ERROR", "Atencion!", "Ud. posee una transferencia pendiente."+"<br>"+"Jugador: "+$scope.transfer.nm);
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
                    //console.log('entro if TRUE '+jugador.nm+" "+integrante.nm);
                    var posicion = jugador.pos;
                    var color = jugador.color;
                    var jugadorNulo = {"id":"","nm":"X","ap":"X","cl":"DEF","club":"","color":color,"pos":posicion,"jr":"","pj":"","pt":"","pv":"","pc":"","eg":"","mt":1};
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
                    console.log("transferencia pendiente: "+$scope.transfer.nm);
                }
            }
            if (updMoney !== "N") {
                // actualizo el saldo
                $scope.setMoney(integrante.pc);
            }

        }
        else {
            $scope.transfer = '';
        }
        //modificado
        $scope.setModified(true);
        console.log('eliminado');
        console.log($scope.miEquipo);
        console.log($scope.transfer);
    
    };

    /* Funcion para visualizar datos de un jugador */
    $scope.verIntegrante = function(integrante){
        console.log("entro a datos de: "+integrante.nm);
        //console.log(integrante);
        $scope.player = integrante;
        w3.show('#jugador');
    };

    /* Funcion para cancelar una sustitucion */
    $scope.cancelSubstitution = function(integrante){
        console.log("entro a cancelar una sustitucion: "+integrante.nm);
        //validar que no haya una modificacion pendiente
        if($scope.substitution.id === integrante.id)
            $scope.substitution = '';
    };

    /* Funcion para iniciar una sustitucion */
    $scope.makeSubstitution = function(integrante){
        console.log("entro a sustitucion: "+integrante.nm);
        if( $scope.substitution === '') {
            $scope.substitution = integrante;
            //modificado
            //$scope.setModified(true);
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
            //modificado
            $scope.setModified(true);
            console.log("sustitucion realizada.");
        }
    };

    /* Funcion para verificar que una sustitucion sea factible */
    $scope.enabledSubstitution = function(integrante){
        //console.log("entro a verificar sustitucion: "+integrante.nm);
        //validar que sea factible la sustitucion
        return $scope.substitution !== '' &&
                    ($scope.substitution.tit !== integrante.tit &&
                        (($scope.substitution.pos === 'POR' && integrante.pos === 'POR') || 
                            ($scope.substitution.pos !== 'POR' && integrante.pos !== 'POR')));
    };

    /* Funcion para modificar capitan */
    $scope.setCaptain = function(captain){
        console.log("entro a setear capitan: "+captain);
        if($scope.miEquipo.subcaptain === captain)
            $scope.miEquipo.subcaptain = $scope.miEquipo.captain;
        $scope.miEquipo.captain = captain;
        //modificado
        $scope.setModified(true);
    };

    /* Funcion para modificar sub-capitan */
    $scope.setSubCaptain = function(subcaptain){
        console.log("entro a setear sub-capitan: "+subcaptain);
        if($scope.miEquipo.captain === subcaptain)
            $scope.miEquipo.captain = $scope.miEquipo.subcaptain;
        $scope.miEquipo.subcaptain = subcaptain;
        //modificado
        $scope.setModified(true);
    };

    /* Funcion para actualizar modificado */
    $scope.setModified = function(modified) {
        $scope.modified = modified; //Actualizar modificado
        
        //Actulizar boton de confirmacion
        $scope.setReadyDefaultTeam();
        $scope.setReadyTeam();
    };

    /* Funcion para cambiar vista */
    $scope.setView = function(view) {
        $scope.view = view; //Hace el cambio de vista
    };

    /* Funcion para cambiar pestaña */
    $scope.setTab = function(tab) {
        console.log('entro a pestanha:' + tab);
        console.log('modificado: ' + $scope.modified);
        if(tab === 'DEF')
            $scope.setMessage('Selecciona un maximo de 3 jugadores de un solo equipo.');
        else if(tab === 'TEAM')
            $scope.setMessage('Para cambiar tu capitan, usa el menu que aparece al hacer clic en un jugador.');
        else
            $scope.setMessage('');
        $scope.tab = tab; //Hace el cambio de pestaña
        $scope.reset();
        $scope.setReadyDefaultTeam();
        $scope.setReadyTeam();
        //$scope.miEquipo = $scope.miEquipoBackup;
    };

    /* Funcion para cambiar perfil */
    $scope.setProfile = function(profile) {
        console.log('entro a perfil: ' + profile);
        //Hace el cambio de perfil
        $scope.profile = profile; 
        if(profile === 'DEFAULT') {
            //$scope.setTab('DEF');
            $('#tabDef').click();
        }
        else if(profile === 'USUARIO') {
            //$scope.setTab('TEAM');
            $('#tabTeam').click();
        }
    };

    $scope.sesion = {};
    /* Funcion que obtiene datos de la sesion */
    $scope.getSesion = function() {
        $.LoadingOverlay("show");
        $http.post("GetDatos?ori=datos_sesion", {
         data: {index: true,
                spaces: false }
      })
        .then(function(response) {
            $scope.sesion = response.data.sesion;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo sesion..");
            console.log($scope.sesion);
            NeAlert(null, "Atencion!", $scope.getWelcome($scope.sesion));
            $.LoadingOverlay("hide");
            $scope.getClubes($scope.sesion.torneo);
            $scope.setProfile($scope.sesion.perfil);
        }, function(response) {
            //Second function handles error
             alert('Error al intentar obtener sesion.');
             alert(response);
            $.LoadingOverlay("hide");
        });
    };

    $scope.getWelcome = function(sesion) {
        var bienvenido = "Bienvenido/a";
        if(sesion.sex === 'M')
            bienvenido = "Bienvenido";
        else if(sesion.sex === 'F')
            bienvenido = "Bienvenida";
        return bienvenido + " " + sesion.nombre + "!";
    };

    $scope.menu = {};
    /* Funcion que obtiene datos del menu */
    $scope.getMenu = function(datos) {
        $.LoadingOverlay("show");
        $http.post("GetDatos?ori=menu", {
         data: {index: false,
                spaces: false,
                extraData: [{   
                    app: 'WEB'}] }
      })
        .then(function(response) {
            $scope.menu = response.data;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo menu..");
            console.log($scope.menu);
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
            alert('Error al intentar obtener datos del menu.');
            alert(response);
            $.LoadingOverlay("hide");
        });
    };

    /* Funcion que obtiene datos de los jugadores */
    $scope.getJugadores = function(datos) {
        $.LoadingOverlay("show");
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

            //$scope.dummyItems = $scope.jugadores; // dummy array of items to be paged
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
            $scope.getMiEquipo(null, "S");
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
            alert('Error al intentar obtener datos de los jugadores.');
            alert(response);
            $.LoadingOverlay("hide");
        });
    };

    /* Funcion que carga mi equipo 2 */
    $scope.getMisJugadores = function(datos) {
        $.LoadingOverlay("show");
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
            $scope.getMiEquipo(null, "S");
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
            alert('Error al intentar cargar mi equipo.');
            alert(response);
            $.LoadingOverlay("hide");
        });
    };

    $scope.clubes = {};
    /* Funcion que obtiene datos de los clubes */
    $scope.getClubes = function(torneo) {
        $.LoadingOverlay("show");
        $http.post("GetDatos?ori=datos_clubes", {
         data: {index: true,
                spaces: false,
                extraData: [{
                    torneo: torneo }] }
      })
        .then(function(response) {
            $scope.clubes = response.data.clubes;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo clubes..");
            console.log($scope.clubes);
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
            alert('Error al intentar obtener datos de los clubes.');
            alert(response);
            $.LoadingOverlay("hide");
        });
    };

    $scope.posiciones = {};
    /* Funcion que obtiene datos de las posiciones */
    $scope.getPosiciones = function(datos) {
        $.LoadingOverlay("show");
        $http.post("GetDatos?ori=datos_posiciones", {
         data: {index: true,
                spaces: false }
      })
        .then(function(response) {
            $scope.posiciones = response.data.posiciones;
            // $scope.incidencia.integrantes = [];
            console.log("imprimo posiciones..");
            console.log($scope.posiciones);
            $.LoadingOverlay("hide");
        }, function(response) {
            //Second function handles error
            alert('Error al intentar obtener datos de las posiciones.');
            alert(response);
            $.LoadingOverlay("hide");
        });
    };

    /* Funcion que carga mi equipo */
    $scope.getMiEquipo = function(isReset, isBatch) {
        console.log('entro a cargar mi equipo.');
        angular.forEach($scope.jugadores, function(jugador, i) {
            if(jugador.mt === 1){
                $scope.agregarIntegrante(jugador, isBatch, 'N');
            }
        });
        if(isReset !== "S") {
            $scope.update($scope.miEquipo);
            //$scope.miEquipoBackup = $scope.miEquipo;
            //$scope.miEquipoBackup = JSON.parse(JSON.stringify($scope.miEquipo));
            //$scope.miEquipoBackup = jQuery.extend({}, $scope.miEquipo);
        }
    };

    /* Funcion que envia los datos del nuevo equipo al servidor */
    $scope.enviarEquipo = function(tipo){
        $.LoadingOverlay("show");
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
        NeAlert(response.data.state, "Atencion!", response.data.message);
        //si la respuesta fue exitosa
        $scope.update();
        $scope.clear();
        $scope.setModified(false);
        if (tipo === 'DEF') {
            $scope.jugadoresBackup = {};
            $scope.jugadores = {};
            $scope.misJugadoresBackup = {};
            $scope.misJugadores = {};

            $scope.getSesion();
            $scope.getJugadores();
            $scope.getMisJugadores();
        }
        $.LoadingOverlay("hide");
    }, function(response) {
        //Second function handles error
        alert('Error al intentar enviar datos del nuevo equipo.');
        alert(response);
        $.LoadingOverlay("hide");
    });       
       
   };

    $scope.readyDefaultTeam = false;
    /* Funcion que verifica que los datos del nuevo equipo esten listos para enviar al servidor */
    $scope.setReadyDefaultTeam = function(){
        //Verifica que tenga seleccionados todos los jugadores
        //console.log('integrantes '+$scope.miEquipo.integrantes.length+'/'+$scope.misJugadores.length);
        $scope.readyDefaultTeam = !($scope.miEquipo.integrantes.length < $scope.misJugadores.length);
    };

    $scope.readyTeam = false;
    /* Funcion que verifica que los datos del equipo esten listos para enviar al servidor */
    $scope.setReadyTeam = function(){
        //Verifica que tenga seleccionados todos los jugadores, capitan y sub-capitan y que haya sido modificado
        //console.log('integrantes '+$scope.miEquipo.integrantes.length);
        $scope.readyTeam = !($scope.miEquipo.integrantes.length < $scope.misJugadores.length || $scope.miEquipo.subcaptain === null || $scope.miEquipo.captain === null) && $scope.modified;
    };

    /* Funcion que envia los datos del nuevo equipo al servidor */
    $scope.enviarEquipoDefault = function(){
        if(!($scope.readyDefaultTeam)) {
            NeAlert("ERROR", "Atencion!", "Debe seleccionar " + $scope.misJugadores.length + " jugadores.");
            return false;
        }
        if (!($("#teamName").val())) {
            NeAlert("ERROR", "Atencion!", "Debe ingresar el nombre de su equipo.");
            return false;
        }
        $scope.enviarEquipo('DEF');
    };

    /* Funcion para cambiar el mensaje */
    $scope.setMessage = function(message) {
        $scope.message = message; //Hace el cambio de vista
    };

    /* Funcion para ordenar tabla */
    $scope.sort = function(keyname){
        console.log('entro a ordenar por:'+keyname);
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    /* Funcion para mostrar/ocultar menu */
    $scope.toggleMenu = function(){
        NeToggleMenu();
    };

    /* Funcion para cambiar pagina de tabla */
    $scope.setPage = function(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            // get pager object from service
            $scope.pager = PagerService.GetPager($scope.jugadores.length, page);

            // get current page of items
            $scope.items = $scope.jugadores.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
    };

    console.log("inicializo aplicacion..");
    $scope.getSesion();
    $scope.getMenu();
    $scope.getJugadores();
    $scope.getMisJugadores();
    $scope.getPosiciones();
}
ControllerJugador.$inject = ['$scope', '$http', 'PagerService'];

/* Funcion para navegacion */
function RouteProvider($routeProvider) {
    $routeProvider
    .when("/def", {
        templateUrl : "main_def.html"/*,
        controller: 'ControllerJugador'*/
    })
    .when("/team", {
        templateUrl : "main_team.html"/*,
        controller: 'ControllerJugador'*/
    })
    .when("/league", {
        templateUrl : "main_league.html"/*,
        controller: 'ControllerJugador'*/
    })
    .when("/score", {
        templateUrl : "main_score.html"/*,
        controller: 'ControllerJugador'*/
    })
    .when("/help", {
        templateUrl : "main_help.html"/*,
        controller: 'ControllerJugador'*/
    })
    ;
}
