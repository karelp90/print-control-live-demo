'use strict';

var app = angular.module('printApp', []);

app.controller('PrintController', ['$scope', '$window', '$http', '$filter', '$q', function ($scope, $window, $http, $filter, $q) {
        $scope.version = "1.0";
        $scope.year = $filter('date')(new Date(), "yyyy");
        $scope.daysOfWork = [];
        $scope.q = "";
        var copiaDaysOfWork = [];
        var recientes = []
        $scope.infoPrinters = "";
        $scope.texto = "abcd efrdec fd";
        $scope.textoBusqueda = "";
        $scope.logsdaySelected = [];
        $scope.daySelected = {};
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

        //Definición de métodos
        $scope.selectDay = selectDay;
        $scope.getSubTotales = getSubTotales;
        $scope.redirect = redirect;
        $scope.onSearch = onSearch;

        var daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Mi\u00e9rcoles', 'Jueves', 'Viernes', 'S\u00e1bado'];

        var today = $filter('date')($scope.fecha, "yyyy-MM-dd");
        var yearAndMonth = $filter('date')($scope.fecha, "yyyy-MM");
        var yesterday = $filter('date')(new Date().setDate($scope.fecha.getDate() - 1), "yyyy-MM-dd");

        var a = $http.get('data-ptr/days.json').
                success(function (data) {
                    $scope.daysOfWork = data;
                    angular.copy(data, copiaDaysOfWork);
                    recientes = copiaDaysOfWork.reverse();
                    getSubTotales(recientes);
                }).error(function (data, status) {
            alert("No se ha impreso nada a\u00fan. Al inicar se registrar\u00e1n todas las operaciones.");
        });

        var aaa = [];
        aaa.push(a);
        $q.all(aaa).then(function (e) {
            console.info($scope.daysOfWork);

            //Get the today information
            var pos = existsDay(today);
            if (pos !== -1)
                $scope.total = $scope.daysOfWork[pos].totalHojas;

            //Get the yesterday information
            var pos = existsDay(yesterday);
            if (pos !== -1)
                $scope.totalYesterday = $scope.daysOfWork[pos].totalHojas;

            //Get information about week
            weekTotal($scope.fecha.getDay());

            //Get the month stats
            var promise3 = getStatsMonthsOrAllTime('month')
            promise3.then(function (result) {
                $scope.totalMonth = result;
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

            //Get the all time stats from the app was installed
            var promise4 = getStatsMonthsOrAllTime('alltime')
            promise4.then(function (result) {
                $scope.totalAllTime = result;
            });

            //Get the all time stats from the app was installed
            var promise5 = getStatsMonthsOrAllTime('printers')
            promise5.then(function (result) {
                $scope.printers = result;
                console.info("printers: " + result)
                console.info(result)
                for (var i = 0; i < $scope.printers.length; i++) {
                    var index = i + 1;
                    $scope.infoPrinters = $scope.infoPrinters.concat(index + "- " + $scope.printers[i].name + "<br>")
                }
                console.info($scope.infoPrinters)
            });
            //Get the all time stats from the app was installed
            var promise6 = getStatsMonthsOrAllTime('state')
            promise6.then(function (result) {
                var state = result.split("-");
                $scope.state = state[0];
                $scope.dofu = state[1];
            });
        });

        function weekTotal(day) {
            if (day === 0)
                day = 7;

            var nameFiles = [];
            nameFiles.push(today);

            if (day !== 1) {
                for (var i = 1; i < day; i++)
                    nameFiles.push($filter('date')(new Date().setDate($scope.fecha.getDate() - i), "yyyy-MM-dd"));

                console.info("Dias de la semana a buscar: " + nameFiles);

                for (var i = 0; i < nameFiles.length; i++) {
                    var pos = existsDay(nameFiles[i]);
                    var temp = {};
                    temp.date = nameFiles[i];
                    var y = temp.date.split("-");
                    var aa = new Date();
                    aa.setFullYear(y[0]);
                    aa.setMonth(y[1] - 1);
                    aa.setDate(y[2]);
                    temp.day = daysOfWeek[new Date(aa).getDay()];
                    temp.isToday = temp.date === today;

                    if (pos !== -1) {
                        temp.total = $scope.daysOfWork[pos].totalHojas;
                        $scope.cantByDaysOfWeek.push(temp);
                    } else {
                        temp.total = 0;
                        $scope.cantByDaysOfWeek.push(temp);
                    }
                }

                console.info("Dias encontraddos: " + $scope.cantByDaysOfWeek.length);
                console.info($scope.cantByDaysOfWeek);

                var t = 0;
                for (var i = $scope.cantByDaysOfWeek.length - 1; i >= 0; i--)
                {
                    if ($scope.cantByDaysOfWeek[i].day === 'Lunes')
                        $scope.monday = $scope.cantByDaysOfWeek[i];
                    else if ($scope.cantByDaysOfWeek[i].day === 'Martes')
                        $scope.tuesday = $scope.cantByDaysOfWeek[i];
                    else if ($scope.cantByDaysOfWeek[i].day === 'Mi\u00e9rcoles')
                        $scope.wednesday = $scope.cantByDaysOfWeek[i];
                    else if ($scope.cantByDaysOfWeek[i].day === 'Jueves')
                        $scope.thursday = $scope.cantByDaysOfWeek[i];
                    else if ($scope.cantByDaysOfWeek[i].day === 'Viernes')
                        $scope.friday = $scope.cantByDaysOfWeek[i];
                    else if ($scope.cantByDaysOfWeek[i].day === 'S\u00e1bado')
                        $scope.saturday = $scope.cantByDaysOfWeek[i];
                    else if ($scope.cantByDaysOfWeek[i].day === 'Domingo')
                        $scope.sunday = $scope.cantByDaysOfWeek[i];

                    t += $scope.cantByDaysOfWeek[i].total;
                }
//                    $scope.totalOfWeek = t + $scope.total;
                $scope.totalOfWeek = t;
                console.info($scope.cantByDaysOfWeek)

            } else {
                $scope.monday = {total: $scope.total, isToday: true, date: today};
                $scope.totalOfWeek = $scope.total;
            }

            new Morris.Bar({
                element: 'morris-bar-stacked',
                data: [
                    {day: $scope.monday.isToday ? 'Lun (Hoy)' : 'Lun', value: 150},
                    {day: $scope.tuesday.isToday ? 'Mar (Hoy)' : 'Mar', value: 120},
                    {day: $scope.wednesday.isToday ? 'Mi\u00e9r (Hoy)' : 'Mi\u00e9r', value: 110},
                    {day: $scope.thursday.isToday ? 'Juev (Hoy)' : 'Juev', value: 99},
                    {day: $scope.friday.isToday ? 'Vier (Hoy)' : 'Vier', value: 200},
                    {day: $scope.saturday.isToday ? 'S\u00e1b (Hoy)' : 'S\u00e1b', value: 136},
                    {day: $scope.sunday.isToday ? 'Dom (Hoy)' : 'Dom', value: 188}
                ],
                xkey: 'day',
                ykeys: ['value'],
                stacked: true,
                labels: ['Hojas'],
                hideHover: 'auto',
                resize: true, //defaulted to true
                xLabelMargin: 10,
                gridLineColor: '#eeeeee',
                barColors: ['#5d9cec']
            });
        }

        function totalPages(data) {
            var total = 0;
            for (var i = 0; i < data.length; i++) {
                var temp = [];
                temp = data[i].time.split(" ");
                data[i].time = temp[1];
                total = total + (data[i].pages * data[i].copies);
            }
            return total;
        }

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
            //Get the day selected information
            $scope.textoBusqueda = "";
            var pos = existsDay(date);
            if (pos !== -1) {
                var promise1 = getInfoByDays(date);
                promise1.then(function (result) {
                    $scope.logsdaySelected = result;
                    $scope.daySelected = {date: date, total: $scope.daysOfWork[pos].total}
                });
            }
        }

        function getSubTotales(recientes) {

            if (recientes === undefined) {
                var a = $http.get('data-ptr/days.json').
                        success(function (data) {
                            $scope.daysOfWork = data;
                            angular.copy(data, copiaDaysOfWork);
                            recientes = copiaDaysOfWork.reverse();
                            //getSubTotales(recientes);
                            //recientes = data.reverse(); 
                            console.info(recientes);
                            $scope.subTotal = {printJobs: 0, pages: 0, hojas: 0};
                            if (recientes.length >= 10)
                                for (var i = 0, max = 10; i < max; i++) {
                                    $scope.subTotal.pages = $scope.subTotal.pages + recientes[i].total;
                                    $scope.subTotal.hojas = $scope.subTotal.hojas + recientes[i].totalHojas;
                                    $scope.subTotal.printJobs = $scope.subTotal.printJobs + recientes[i].printjob;
                                }
                            else
                                for (var i = 0; i < recientes.length; i++) {
                                    $scope.subTotal.pages = $scope.subTotal.pages + recientes[i].total;
                                    $scope.subTotal.hojas = $scope.subTotal.hojas + recientes[i].totalHojas;
                                    $scope.subTotal.printJobs = $scope.subTotal.printJobs + recientes[i].printjob;
                                }
                        }).error(function (data, status) {
                    alert("No se ha impreso nada a\u00fan. Al inicar se registrar\u00e1n todas las operaciones.");
                });

                var aaa = [];
                aaa.push(a);
            } else {
                $scope.subTotal = {printJobs: 0, pages: 0, hojas: 0};

                if (recientes.length >= 10)
                    for (var i = 0, max = 10; i < max; i++) {
                        $scope.subTotal.pages = $scope.subTotal.pages + recientes[i].total;
                        $scope.subTotal.hojas = $scope.subTotal.hojas + recientes[i].totalHojas;
                        $scope.subTotal.printJobs = $scope.subTotal.printJobs + recientes[i].printjob;
                    }
                else
                    for (var i = 0; i < recientes.length; i++) {
                        $scope.subTotal.pages = $scope.subTotal.pages + recientes[i].total;
                        $scope.subTotal.hojas = $scope.subTotal.hojas + recientes[i].totalHojas;
                        $scope.subTotal.printJobs = $scope.subTotal.printJobs + recientes[i].printjob;
                    }
            }
        }

        function redirect(page) {
            $window.location.href = page + '.html';
        }

        function onSearch(event, query) {
            event.stopPropagation();
            if (event.keyCode == 13 && query !== "")
            {
                query = $filter('lowercase')(query);
                console.info(query)
                $window.location.href = "history-all-time.html?q=" + query;
            }
        }



    }]);