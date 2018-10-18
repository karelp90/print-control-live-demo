'use strict';

var app = angular.module('printApp', ['ui.bootstrap', 'ui.utils']);

app.controller('PrintController', ['$scope', '$window', '$compile', '$http', '$filter', '$q', function ($scope, $window, $compile, $http, $filter, $q) {
        $scope.version = "1.0";
        $scope.year = $filter('date')(new Date(), "yyyy");
        $scope.fecha = new Date();
        $scope.logsAllTime = [];
        $scope.dofu = 0;
        $scope.totalPages = 0;
        $scope.countAllTime = 0;
        $scope.daysOfWork = [];
        $scope.months = [];

        //Definición de métodos
        $scope.loadAllTimeRecords = loadAllTimeRecords;

        $scope.dataTableOpt = {
            "aLengthMenu": [[10, 20, 50, 100], [10, 20, 50, 100]]
        };

        loadAllTimeRecords();

        function loadAllTimeRecords() {
            var a = $http.get('data-ptr/printcontrol-alltime.json').
                    success(function (data) {
                        $scope.logsAllTime = data;

                        for (var i = 0; i < $scope.logsAllTime.length; i++) {                            
                            var totalPages = $scope.logsAllTime[i].pages * $scope.logsAllTime[i].copies;
                            $scope.totalPages = $scope.totalPages + totalPages;
                        }

                        var iEl = angular.element(document.querySelector('#tabletoremove'));
                        iEl.empty();
                        var sa = $compile("<table class='table table-striped' ui-jq='dataTable' ui-options='dataTableOpt'><thead><tr><th>No.</th><th>Fecha</th><th>Usuario</th><th>P&aacute;ginas</th><th>Copias</th><th>Total P&aacute;g</th><th>Total Hojas</th><th>Impresora</th><th>Documento</th><th>PC</th><th>Formato</th><th>Color</th><th>Doble Cara</th></tr></thead><tbody><tr data-ng-repeat=\"day in logsAllTime\">\n\
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
                    }).error(function (data, status) {
                alert("No se ha impreso nada a\u00fan. Al inicar se registrar\u00e1n todas las operaciones.");
            });

            var a = $http.get('data-ptr/state.txt').
                    success(function (data) {
                        var temp = data.split("-");
                        $scope.state = temp[0];
                        $scope.dofu = temp[1];
                    });

            var a = $http.get('data-ptr/cont-all-time-printcontrol.txt').
                    success(function (data) {
                        $scope.countAllTime = data;
                    });
            var a = $http.get('data-ptr/days.json').
                    success(function (data) {
                        $scope.daysOfWork = data;
                    });
            var a = $http.get('data-ptr/months.json').
                    success(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            var obj = {};
                            var temp = data[i].yearMonth.split("-");
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
                                obj.total = data[i].total;
                                $scope.months.push(obj);
                            }
                        }
                    });
        }

    }]);

