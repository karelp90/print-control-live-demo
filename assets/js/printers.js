'use strict';

var app = angular.module('printApp', []);

app.controller('PrintController', ['$scope', '$window', '$http', '$filter', '$q', function ($scope, $window, $http, $filter, $q) {
        $scope.printers = [];
        $scope.local = 0;
        $scope.shared = 0;
        $scope.mostUsed = {};
        $scope.year = $filter('date')(new Date(), "yyyy");
        $scope.fecha = new Date();
        $scope.version = "1.0";

        $scope.allTime = [];
        $scope.daysOfWork = [];
        $scope.totalAllTime = 0;
        $scope.totalAllTimePrinters = 0;
        $scope.totalAllTimePrintersHojas = 0;
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

        var today = $filter('date')(new Date(), "yyyy-MM-dd");
        var daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Mi\u00e9rcoles', 'Jueves', 'Viernes', 'S\u00e1bado'];
        var labelsXY = [];
        var labels = [];
        var colors = ['#5d9cec', '#5fbeaa', '#c2b74b', '#7bd3df', '#b7a49c', '#d85e5e', '#7e45b0', '#dd9740', '#bac32d', '#47dbc8', '#49e354'];
        var donutData = [];
        var printerCountOfWeek = [];

        $scope.redirect = redirect;

        var a = $http.get('data-ptr/days.json').
                success(function (data) {
                    $scope.daysOfWork = data;
                }).error(function (data, status) {
            alert("No se ha impreso nada a\u00fan. Al inicar se registrar\u00e1n todas las operaciones.");
        });

        //Get the all time stats from the app was installed
        var promise4 = getStatsMonthsOrAllTime('contAlltime')
        promise4.then(function (result) {
            $scope.totalAllTime = result;
        });

        //Get the all time stats from the app was installed
        var promise4 = getStatsMonthsOrAllTime('alltime')
        promise4.then(function (result) {
            console.info("ALL TIME:");
            console.info(result);
            $scope.allTime = result;
        });

        var a = $http.get('data-ptr/state.txt').
                success(function (data) {
                    var temp = data.split("-");
                    $scope.state = temp[0];
                });


        //Get the all time stats from the app was installed
        var promise5 = getStatsMonthsOrAllTime('printers')
        promise5.then(function (result) {
            $scope.printers = result;
            console.info("printers: " + result)
            console.info(result)
            var most = -1;
            var pos = -1;
            for (var i = 0; i < $scope.printers.length; i++) {
                $scope.totalAllTimePrinters = $scope.totalAllTimePrinters + $scope.printers[i].count;
                $scope.totalAllTimePrintersHojas = $scope.totalAllTimePrintersHojas + $scope.printers[i].countHojas;
                labels[i] = $scope.printers[i].name;
                labelsXY[i] = i;

                $scope.printers[i].color = colors[i];
                if (most < $scope.printers[i].count) {
                    most = $scope.printers[i].count;
                    pos = i;
                    console.info("pos:")
                    console.info(pos)
                }

                if ($scope.printers[i].isLocal)
                    $scope.local = $scope.local + 1;

                if ($scope.printers[i].isShared)
                    $scope.shared = $scope.shared + 1;
            }
            for (var i = 0; i < $scope.printers.length; i++)
                donutData[i] = {label: $scope.printers[i].name, value: (($scope.printers[i].count * 100) / $scope.totalAllTimePrinters).toFixed(2)};

            if ($scope.totalAllTimePrinters != 0)
                $scope.mostUsed = $scope.printers[pos];
            

            weekTotal(new Date().getDay());

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

        function getStatsMonthsOrAllTime(type) {
//            var nameFile = type === 'month' ? 'sheet-count-' + yearAndMonth + '.txt' : 'cont-all-time-printcontrol.txt'
            var nameFile = type === 'printers' ? 'printers.json' : (type === 'alltime' ? 'printcontrol-alltime.json' : (type === 'months' ? 'months.json' : 'cont-all-time-printcontrol.txt'));
            return $http.get('data-ptr/' + nameFile).
                    then(function (result) {
                        return result.data;
                    });
        }

        function redirect(page) {
            $window.location.href = page + '.html';
        }

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
                        temp.total = $scope.daysOfWork[pos].total;
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
                $scope.monday = {total: 95, isToday: true, date: today};
                $scope.totalOfWeek = 95;
            }

            var days = [$scope.monday.isToday ? 'Lun (Hoy)' : 'Lun', $scope.tuesday.isToday ? 'Mar (Hoy)' : 'Mar',
                $scope.wednesday.isToday ? 'Mi\u00e9r (Hoy)' : 'Mi\u00e9r', $scope.thursday.isToday ? 'Juev (Hoy)' : 'Juev',
                $scope.friday.isToday ? 'Vier (Hoy)' : 'Vier', $scope.saturday.isToday ? 'S\u00e1b (Hoy)' : 'S\u00e1b',
                $scope.sunday.isToday ? 'Dom (Hoy)' : 'Dom'];


            for (var i = 0; i < 7; i++) {
                var temp = {};
                temp.day = days[i];

                for (var j = 0; j < labels.length; j++) {
                    temp[j] = getCountByPrinterWeek(labels[j], i);
                }
                printerCountOfWeek[i] = temp;

            }

            console.info("printerCountOfWeek");
            console.info(printerCountOfWeek);

            new Morris.Bar({
                element: 'morris-bar-week',
                data: printerCountOfWeek,
                xkey: 'day',
                ykeys: labelsXY,
                stacked: true,
                labels: labels,
                hideHover: 'auto',
                resize: true, //defaulted to true
                xLabelMargin: 10,
                gridLineColor: '#eeeeee',
                barColors: colors
            });

            //creates Donut chart
            new Morris.Donut({
                element: 'pie-chart-container',
                data: donutData,
                resize: true, //defaulted to true
                colors: colors
            });

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

        function getCountByPrinterWeek(printer, day) {
            switch (day) {
                case 0:
                    if ($scope.monday.hasOwnProperty('date'))
                        return 54;// searchTotalByPrinterWeek(printer, $scope.monday.date);
                    else
                        return;
                    break;
                case 1:
                    if ($scope.tuesday.hasOwnProperty('date'))
                        return 69;//searchTotalByPrinterWeek(printer, $scope.tuesday.date);
                    else
                        return;
                    break;
                case 2:
                    if ($scope.wednesday.hasOwnProperty('date'))
                        return 215;//searchTotalByPrinterWeek(printer, $scope.wednesday.date);
                    else
                        return;
                    break;
                case 3:
                    if ($scope.thursday.hasOwnProperty('date'))
                        return 159;//searchTotalByPrinterWeek(printer, $scope.thursday.date);
                    else
                        return;
                    break;
                case 4:
                    if ($scope.friday.hasOwnProperty('date'))
                        return 29;//searchTotalByPrinterWeek(printer, $scope.friday.date);
                    else
                        return;
                    break;
                case 5:
                    if ($scope.saturday.hasOwnProperty('date'))
                        return 56;//searchTotalByPrinterWeek(printer, $scope.saturday.date);
                    else
                        return;
                    break;
                case 6:
                    if ($scope.sunday.hasOwnProperty('date'))
                        return 95;//searchTotalByPrinterWeek(printer, $scope.sunday.date);
                    else
                        return;
                    break;

                default:

                    break;
            }
        }

        function searchTotalByPrinterWeek(printer, date) {
            var c = 0;
            for (var i = 0; i < $scope.allTime.length; i++) {
                var temp = $scope.allTime[i].time.split(" ");
                if (temp[0] === date && $scope.allTime[i].printer === printer) {
                    c = c + ($scope.allTime[i].pages * $scope.allTime[i].copies);
                }
            }
            return c;
        }

    }]);

