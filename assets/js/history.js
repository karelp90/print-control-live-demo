'use strict';

var app = angular.module('printApp', ['ui.bootstrap', 'ui.utils']);

app.controller('PrintController', ['$scope', '$window', '$compile', '$http', '$filter', '$q', function ($scope, $window, $compile, $http, $filter, $q) {
        $scope.version = "1.0";
        $scope.year = $filter('date')(new Date(), "yyyy");
        $scope.daysOfWork = [];
        $scope.infoPrinters = "";
        $scope.texto = "abcd efrdec fd";
        $scope.textoBusqueda = "";
        $scope.print = [];
        $scope.logsdaySelected = [];
        $scope.daySelected = {};
        $scope.printYesterday = [];
        $scope.totalAllTime = 0;
        $scope.totalMonth = 0;
        $scope.totalYesterday = 0;
        $scope.total = 0;
        $scope.fecha = new Date();
        $scope.todayK = $filter('date')($scope.fecha, "yyyy-MM-dd");
        $scope.cantByDaysOfWeek = [];
        $scope.totalOfWeek = 0;
        $scope.months = [];
        $scope.monday = {};
        $scope.tuesday = {};
        $scope.wednesday = {};
        $scope.thursday = {};
        $scope.friday = {};
        $scope.saturday = {};
        $scope.sunday = {};

        $scope.dataTableOpt = {
            "aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, 'Todos']],
        };
        $scope.dataTableOptDay = {
            "aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, 'Todos']],
        };



        //Definición de métodos
        $scope.selectDay = selectDay;
        $scope.redirect = redirect;

        var yearAndMonth = $filter('date')($scope.fecha, "yyyy-MM");


        var a = $http.get('data-ptr/days.json').
                success(function (data) {
                    $scope.daysOfWork = data;
                    var iEl = angular.element(document.querySelector('#tabletoremove'));
                    iEl.empty();
                    var sa = $compile("<table class='table table-striped' ui-jq='dataTable' ui-options='dataTableOpt'><thead><tr><th>No.</th><th>Fecha<span class=\"text-danger\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Usar este formato de fecha para ordenar correctamente\">*</span></th><th>Fecha</th><th>D&iacute;a</th><th>P&aacute;ginas<span class=\"text-danger\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Para el caso de las impresoras que imprimen Doble Cara\">*</span></th><th>Hojas</th><th>PrintJobs</th></tr></thead><tbody><tr data-ng-repeat=\"day in daysOfWork| orderBy: '-date'\"><td>{{$index + 1}}</td><td>{{day.date}}</td><td><a style=\"cursor: pointer\" ng-click=\"selectDay(day.date)\" title='Click para ver detalles'>{{day.date| date: 'MMMM d, y'}}  <span ng-if=\"day.date == todayK\" class='label label-primary'>Hoy</span></a></td><td>{{day.day}}</td><td>{{day.total}}</td><td>{{day.totalHojas}}</td><td>{{day.printjob}}</td></tr></tbody></table>")($scope);
                    iEl.append(sa);
                }).error(function (data, status) {
            alert("No se ha impreso nada a\u00fan. Al inicar se registrar\u00e1n todas las operaciones.");
        });

        //Get the all time stats from the app was installed
        var promise4 = getStatsMonthsOrAllTime('alltime')
        promise4.then(function (result) {
            $scope.totalAllTime = result;
        });

        //Get the all time stats from the app was installed
        var promise6 = getStatsMonthsOrAllTime('state')
        promise6.then(function (result) {
            var state = result.split("-");
            $scope.state = state[0];
        });
        
        //Get the month stats
        var promise9 = getStatsMonthsOrAllTime('months')
        promise9.then(function (result) {
            for (var i = 0; i < result.length; i++) {
                var obj = {};
                var temp = result[i].yearMonth.split("-");
                if (temp[0] === $scope.year) {
                    switch (temp[1]) {
                        case "01":
                            obj.month = "Enero";
                            break;
                        case "02":
                            obj.month = "Febrero";
                            break;
                        case "03":
                            obj.month = "Marzo";
                            break;
                        case "04":
                            obj.month = "Abril";
                            break;
                        case "05":
                            obj.month = "Mayo";
                            break;
                        case "06":
                            obj.month = "Junio";
                            break;
                        case "07":
                            obj.month = "Julio";
                            break;
                        case "08":
                            obj.month = "Agosto";
                            break;
                        case "09":
                            obj.month = "Septiembre";
                            break;
                        case "10":
                            obj.month = "Octubre";
                            break;
                        case "11":
                            obj.month = "Noviembre";
                            break;
                        case "12":
                            obj.month = "Diciembre";
                            break;

                        default:

                            break;
                    }
                    obj.total = result[i].total;
                    $scope.months.push(obj);
                }
            }

        });

        function existsDay(day) {
            var pos = -1;
            for (var i = 0; i < $scope.daysOfWork.length; i++) {
                if ($scope.daysOfWork[i].date === day) {
                    pos = i;
                    return pos;
                }
            }
            return pos;
        }

        function getInfoByDays(day) {
            return $http.get('data-ptr/' + day + '-printcontrol.json').
                    then(function (result) {
                        return result.data;
                    });
        }

        function getStatsMonthsOrAllTime(type) {
//            var nameFile = type === 'month' ? 'sheet-count-' + yearAndMonth + '.txt' : 'cont-all-time-printcontrol.txt'
            var nameFile = type === 'month' ? 'sheet-count-' + yearAndMonth + '.txt' : (type === 'printers' ? 'printers.json' : (type === 'state' ? 'state.txt' : (type === 'months' ? 'months.json' : 'cont-all-time-printcontrol.txt')));
            return $http.get('data-ptr/' + nameFile).
                    then(function (result) {
                        return result.data;
                    });
        }

        function selectDay(date) {

            var a = $http.get('data-ptr/days.json').
                    success(function (data) {
                        $scope.daysOfWork = data;
                    }).error(function (data, status) {
            });

            var pos = existsDay(date);
            if (pos !== -1) {
                var promise1 = getInfoByDays(date);
                promise1.then(function (result) {
                    $scope.logsdaySelected = result;
                    console.info($scope.logsdaySelected);
                    $scope.daySelected = {date: date, total: $scope.daysOfWork[pos].total, totalHojas: $scope.daysOfWork[pos].totalHojas}

                    var root = angular.element(document.querySelector('#roottoremove'));
                    root.empty();
                    var subroot = $compile("<li><a href=\"index.html\">PrintCtrl</a></li><li><a href=\"history.html\">Historial de Registros</a></li><li class=\"active\">{{daySelected.date| date: 'd MMMM, y'}}</li>")($scope);
                    root.append(subroot);


                    var iEl = angular.element(document.querySelector('#tabletoremove'));
                    iEl.empty();
                    var sa = $compile("<table class='table table-striped' ui-jq='dataTable' ui-options='dataTableOptDay'><thead><tr><th>No.</th><th>Hora</th><th>Usuario</th><th>P&aacute;ginas</th><th>Copias</th><th>Total P&aacute;g</th><th>Total Hojas</th><th>Impresora</th><th>Documento</th><th>PC</th><th>Formato</th><th>Color</th><th>Doble Cara</th></tr></thead><tbody><tr data-ng-repeat=\"day in logsdaySelected\">\n\
<td>{{$index + 1}}</td>\n\
<td>{{day.time| date: 'MMMM d, y'}}</td>\n\
<td>{{day.user}}</td>\n\
<td>{{day.pages}}</td>\n\
<td>{{day.copies}}</td>\n\
<td>{{day.pages * day.copies}}</td>\n\
<td>{{day.duplex===\"DUPLEX\" ? ((day.pages * day.copies%2==0)? day.pages * day.copies/2 :((day.pages * day.copies)-1)/2+1) : day.pages * day.copies}}</td>\n\
<td>{{day.printer}}</td>\n\
<td>{{day.doc}}</td>\n\
<td>{{day.pc}}</td>\n\
<td>{{day.format=== \"Letter\" ? \"Carta\" : (day.format=== \"\" ? day.height+'x'+ day.width : day.format)}}</td>\n\
<td>{{day.grayscale===\"GRAYSCALE\" ? \"No\" : \"S&iacute;\"}}</td>\n\
<td>{{day.duplex===\"NOT DUPLEX\" ? \"No\" : \"S&iacute;\"}}</td>\n\
</tr></tbody></table>")($scope);
                    iEl.append(sa);

                });
            }
        }

        function redirect(page) {
            $window.location.href = page + '.html';
        }

    }]);

