/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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

/* Funcion para mostrar mensaje en pantalla */
function NeAlert(tipo, titulo, contenido) {
    // tipo: OK --> informacion, ERROR --> error
    if(tipo === "ERROR")
        event.stopPropagation();

    console.log('entro a mostrar mensaje.');
    $("#mensaje_titulo").html(titulo);
    $("#mensaje_contenido").html(contenido);
    w3.removeClass('.w3-modal', 'w3-show'); // Oculta todos los .w3-modal
    w3.addClass('#mensaje', 'w3-show'); // Muestra el mensaje

}

/* Funcion para aplicaciones anidadas */
function ngIsolateApp() {
    return {
        "scope" : {},
        "restrict" : "AEC",
        "compile" : function(element, attrs) {
            // removing body
            var html = element.html();
            element.html('');
            return function(scope, element) {
                // destroy scope
                scope.$destroy();
                // async
                setTimeout(function() {
                    // prepare root element for new app
                    var newRoot = document.createElement("div");
                    newRoot.innerHTML = html;
                    // bootstrap module
                    angular.bootstrap(newRoot, [attrs["ngIsolateApp"]]);
                    // add it to page
                    element.append(newRoot);
                });
            };
        }
    };
}

/* Funcion para incluir HTML */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
              elmnt.innerHTML = this.responseText;

              //para ejecutar el script al cargar en el div
              var elementos = elmnt.getElementsByTagName("script");
              for(i=0;i<elementos.length;i++) {
                  //old=document.getElementById(''prefix''+i);
                  //if(old)asc.removeChild(old)
                  var elemento = elementos[i];
                  nuevoScript = document.createElement("script");
                  nuevoScript.text = elemento.innerHTML;
                  //nuevoScript.type = ''text/javascript'';
                  //nuevoScript.id = ''prefix''+i;
                  if(elemento.src!==null && elemento.src.length>0)
                  {nuevoScript.src = elemento.src;}
                  elemento.parentNode.replaceChild(nuevoScript,elemento);
              }
          }
          if (this.status === 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
};

/* Funcion para ajustar contenedor */
function NeToggleClass() {
    var container = document.getElementById("main-container");
    var team = document.getElementById("team-grid");
    var def = document.getElementById("def-grid");
    var league = document.getElementById("league-grid");
    var help = document.getElementById("help-grid");
    var w = container.offsetWidth;
    var h = container.offsetHeight;
    //alert(w + " " + h);
    if(w <= 600) { // Pantallas pequeñas
        container.className = ""; //classList.add y classList.remove en navegadores modernos
        if(team !== null)
            team.className = "w3-row";
        if(def !== null)
            def.className = "w3-row";
        if(league !== null)
            league.className = "w3-row";
        if(help !== null)
            help.className = "w3-row";
    }
    else { // Pantallas medianas y grandes
        container.className = "w3-container w3-content";
        if(team !== null)
            team.className = "w3-row-padding";
        if(def !== null)
            def.className = "w3-row-padding";
        if(league !== null)
            league.className = "w3-row-padding";
        if(help !== null)
            help.className = "w3-row-padding";
    }
};

/* Funcion para mostrar/ocultar menu */
function NeToggleMenu(){
    console.log('entro a mostrar/ocultar menu.');
    w3.toggleClass('#menuSmall', 'w3-hide');
    w3.toggleClass('#menuLarge', 'w3-hide-small');
};
