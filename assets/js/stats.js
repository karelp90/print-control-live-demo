'use strict';

var app = angular.module('printApp', []);

app.controller('PrintController', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
        $scope.version = "1.0";
        $scope.year = $filter('date')(new Date(), "yyyy");
        $scope.fecha = new Date();
        $scope.logsAllTime = [];
        $scope.totalAllTime = 0;
        $scope.totalPages = 0;
        $scope.pagesPerDay = 0;
        $scope.sheetsPerDay = 0;
        $scope.printers = [];
        $scope.users = [];
        $scope.pcs = [];
        var users = [];
        var pcs = [];
        var data = [];
        var t = {};
        var cont = 0;
        var dataMonths = [
            {y: 'En', a: t},
            {y: 'Feb', a: t},
            {y: 'Mar', a: t},
            {y: 'Abr', a: t},
            {y: 'May', a: t},
            {y: 'Jun', a: t},
            {y: 'Jul', a: t},
            {y: 'Ago', a: t},
            {y: 'Sept', a: t},
            {y: 'Oct', a: t},
            {y: 'Nov', a: t},
            {y: 'Dic', a: t}
        ];
        var dataHour = [
            {y: '2018-01-01 00:00:00', a: 0},
            {y: '2018-01-01 01:00:00', a: 0},
            {y: '2018-01-01 02:00:00', a: 0},
            {y: '2018-01-01 03:00:00', a: 0},
            {y: '2018-01-01 04:00:00', a: 0},
            {y: '2018-01-01 05:00:00', a: 0},
            {y: '2018-01-01 06:00:00', a: 0},
            {y: '2018-01-01 07:00:00', a: 0},
            {y: '2018-01-01 08:00:00', a: 0},
            {y: '2018-01-01 09:00:00', a: 0},
            {y: '2018-01-01 10:00:00', a: 0},
            {y: '2018-01-01 11:00:00', a: 0},
            {y: '2018-01-01 12:00:00', a: 0},
            {y: '2018-01-01 13:00:00', a: 0},
            {y: '2018-01-01 14:00:00', a: 0},
            {y: '2018-01-01 15:00:00', a: 0},
            {y: '2018-01-01 16:00:00', a: 0},
            {y: '2018-01-01 17:00:00', a: 0},
            {y: '2018-01-01 18:00:00', a: 0},
            {y: '2018-01-01 19:00:00', a: 0},
            {y: '2018-01-01 20:00:00', a: 0},
            {y: '2018-01-01 21:00:00', a: 0},
            {y: '2018-01-01 22:00:00', a: 0},
            {y: '2018-01-01 23:00:00', a: 0},
        ];
        $scope.days = [];
        $scope.months = [];
        $scope.months2 = [];
        $scope.countGrayScale = 0;
        $scope.countColor = 0;
        $scope.countDuplex = 0;
        $scope.countSimple = 0;
        $scope.pcCountGrayScale = 0;
        $scope.pcCountColor = 0;
        $scope.pcCountDuplex = 0;
        $scope.pcCountSimple = 0;

        var promise1 = getStatsMonthsOrAllTime('count')
        promise1.then(function (result) {
            $scope.totalAllTime = result;
        });
        var promise2 = getStatsMonthsOrAllTime('printers')
        promise2.then(function (result) {
            $scope.printers = result;
        });
        var promise3 = getStatsMonthsOrAllTime('days')
        promise3.then(function (result) {
            $scope.days = result;
            console.info(result.length)
            var j = 0;
            if ($scope.days.length > 60)
                for (var i = $scope.days.length - 1; i >= $scope.days.length - 60; i--) {
                    data[j] = {y: $scope.days[i].date, a: $scope.days[i].total};
                    j++;
                }
            else
                for (var i = 0; i < $scope.days.length; i++)
                    data[i] = {y: $scope.days[i].date, a: $scope.days[i].total};
        });
        var promise3 = getStatsMonthsOrAllTime('months')
        promise3.then(function (result) {
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
                    $scope.months2.push(obj);
                }
            }

            $scope.months = result;
            console.info(result.length)
            for (var i = 0; i < $scope.months.length; i++) {
                var temp = $scope.months[i].yearMonth.split("-");
                if (temp[0] === $scope.year) {

                    //dataMonths[j] = {y: $scope.months[i].yearMonth, a: $scope.months[i].total};

                    switch (temp[1]) {
                        case '01':
                            dataMonths[0].a = $scope.months[i].total;
                            break;
                        case '02':
                            dataMonths[1].a = $scope.months[i].total;
                            break;
                        case '03':
                            dataMonths[2].a = $scope.months[i].total;
                            break;
                        case '04':
                            dataMonths[3].a = $scope.months[i].total;
                            break;
                        case '05':
                            dataMonths[4].a = $scope.months[i].total;
                            break;
                        case '06':
                            dataMonths[5].a = $scope.months[i].total;
                            break;
                        case '07':
                            dataMonths[6].a = $scope.months[i].total;
                            break;
                        case '08':
                            dataMonths[7].a = $scope.months[i].total;
                            break;
                        case '09':
                            dataMonths[8].a = $scope.months[i].total;
                            break;
                        case '10':
                            dataMonths[9].a = $scope.months[i].total;
                            break;
                        case '11':
                            dataMonths[10].a = $scope.months[i].total;
                            break;
                        case '12':
                            dataMonths[11].a = $scope.months[i].total;
                            break;


                        default:

                            break;
                    }
                }
            }
        });

        //Get the all time stats from the app was installed
        var promise6 = getStatsMonthsOrAllTime('state')
        promise6.then(function (result) {
            var state = result.split("-");
            $scope.state = state[0];
            $scope.dofu = state[1];
        });
        var promise7 = getStatsMonthsOrAllTime('alltime')
        promise7.then(function (result) {
            $scope.logsAllTime = result;
            var j = 0;
            for (var i = 0; i < $scope.logsAllTime.length; i++) {
                $scope.logsAllTime[i].grayscale === "GRAYSCALE" ? addGrayScale($scope.logsAllTime[i]) : addColor($scope.logsAllTime[i]);
                $scope.logsAllTime[i].duplex === "NOT DUPLEX" ? addSimple($scope.logsAllTime[i]) : addDuplex($scope.logsAllTime[i]);
                //user
                var pos = isUser($scope.logsAllTime[i].user);
                var totalPages = $scope.logsAllTime[i].pages * $scope.logsAllTime[i].copies;
                $scope.totalPages = $scope.totalPages + totalPages;
                //line chart hours
                var tempD = $scope.logsAllTime[i].time.split(" ");
                getTimePagesLineChart(tempD[1], totalPages);

                if (pos === -1)
                    addUser($scope.logsAllTime[i].user, totalPages);
                else {
                    users[pos].pages = users[pos].pages + totalPages;
                    users[pos].pc = (users[pos].pages * 100 / $scope.totalPages).toFixed(2)
                }
                //pc
                var pos2 = isPCexist($scope.logsAllTime[i].pc);
                if (pos2 === -1)
                    addPC($scope.logsAllTime[i].pc, totalPages);
                else {
                    pcs[pos2].pages = pcs[pos2].pages + totalPages;
                    pcs[pos2].pc = (pcs[pos2].pages * 100 / $scope.totalPages).toFixed(2)
                }
                j++;
            }
            $scope.users = users;
            $scope.pcs = pcs;

            //Bar chart
            new Morris.Bar({
                element: 'morris-line-chart-months',
                data: dataMonths,
                xkey: 'y',
                ykeys: ['a'],
                stacked: true,
                labels: ['Hojas'],
                hideHover: 'auto',
                resize: true, //defaulted to true
                xLabelMargin: 10,
                gridLineColor: '#eef0f2',
                barColors: ['#81c868']
            });

            new Morris.Line({
                element: 'morris-line-chart-hour',
                data: dataHour,
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Hojas'],
                xLabelFormat: function (date) {
                   var hours = date.getHours();
                   var minutes = date.getMinutes();
                   var ampm = hours >= 12 ? 'pm' : 'am';
                   hours = hours % 12;
                   hours = hours ? hours : 12; // the hour '0' should be '12'
                   minutes = minutes < 10 ? '0'+minutes : minutes;
                   var strTime = hours + ':00 ' + ampm;
                   return strTime;
                 },
                fillOpacity: ['0.1'],
                pointFillColors: ['#ffffff'],
                pointStrokeColors: ['#999999'],
                behaveLikeLine: true,
                gridLineColor: '#eef0f2',
                hideHover: 'auto',
                resize: true, //defaulted to true
                lineColors: ['#5d9cec'],
                xLabelMargin: 10
            });


            new Morris.Line({
                element: 'morris-line-chart',
                data: data,
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Hojas'],

                fillOpacity: ['0.1'],
                pointFillColors: ['#ffffff'],
                pointStrokeColors: ['#999999'],
                behaveLikeLine: true,
                gridLineColor: '#eef0f2',
                hideHover: 'auto',
                resize: true, //defaulted to true
                lineColors: ['#ffbd4a'],
                xLabelMargin: 10
            });
            //end chart


        });
        var promise7 = getStatsMonthsOrAllTime('count')
        promise7.then(function (result) {
            $scope.totalAllTime = result;
            $scope.pagesPerDay = ($scope.totalPages / $scope.dofu).toFixed(2);
            $scope.sheetsPerDay = (result / $scope.dofu).toFixed(2);

            $scope.pcCountGrayScale = ($scope.countGrayScale * 100 / $scope.totalPages).toFixed(2);
            $scope.pcCountColor = ($scope.countColor * 100 / $scope.totalPages).toFixed(2);
            $scope.pcCountSimple = ($scope.countSimple * 100 / $scope.totalPages).toFixed(2);
            $scope.pcCountDuplex = ($scope.countDuplex * 100 / $scope.totalPages).toFixed(2);
        });

        function getStatsMonthsOrAllTime(type) {
            var fileName = type === 'state' ? 'state.txt' : (type === 'count' ? 'cont-all-time-printcontrol.txt' : (type === 'printers' ? 'printers.json' : (type === 'days' ? 'days.json' : (type === 'months' ? 'months.json' : 'printcontrol-alltime.json'))));
            return $http.get('data-ptr/' + fileName).
                    then(function (result) {
                        return result.data;
                    });
        }

        function addGrayScale(log) {
            $scope.countGrayScale = $scope.countGrayScale + (log.pages * log.copies);
        }
        function addColor(log) {
            $scope.countColor = $scope.countColor + (log.pages * log.copies);
        }
        function addSimple(log) {
            $scope.countSimple = $scope.countSimple + (log.pages * log.copies);
        }
        function addDuplex(log) {
//            $scope.countDuplex = $scope.countDuplex + Math.trunc(((log.pages * log.copies) / 2)) + ((log.pages * log.copies) % 2);
            $scope.countDuplex = $scope.countDuplex + (log.pages * log.copies);
        }
        function addUser(user, pages) {
            var o = {user: user, pages: pages, pc: (pages * 100 / $scope.totalAllTime).toFixed(2)};
            users.push(o);
            console.info(users)
        }
        function isUser(user) {
            for (var i = 0; i < users.length; i++)
                if (users[i].user === user)
                    return i;

            return -1;
        }
        function addPC(computer, pages) {
            var o = {computer: computer, pages: pages, pc: (pages * 100 / $scope.totalAllTime).toFixed(2)};
            pcs.push(o);
            console.info(pcs)
        }
        function isPCexist(computer) {
            for (var i = 0; i < pcs.length; i++)
                if (pcs[i].computer === computer)
                    return i;

            return -1;
        }

        function getTimePagesLineChart(time, total) {
            var temp = time.split(":");
            switch (temp[0]) {
                case '00':
                    dataHour[0].a += total;
                    break;
                case '01':
                    dataHour[1].a += total;
                    break;
                case '02':
                    dataHour[2].a += total;
                    break;
                case '03':
                    dataHour[3].a += total;
                    break;
                case '04':
                    dataHour[4].a += total;
                    break;
                case '05':
                    dataHour[5].a += total;
                    break;
                case '06':
                    dataHour[6].a += total;
                    break;
                case '07':
                    dataHour[7].a += total;
                    break;
                case '08':
                    dataHour[8].a += total;
                    break;
                case '09':
                    dataHour[9].a += total;
                    break;
                case '10':
                    dataHour[10].a += total;
                    break;
                case '11':
                    dataHour[11].a += total;
                    break;
                case '12':
                    dataHour[12].a += total;
                    break;
                case '13':
                    dataHour[13].a += total;
                    break;
                case '14':
                    dataHour[14].a += total;
                    break;
                case '15':
                    dataHour[15].a += total;
                    break;
                case '16':
                    dataHour[16].a += total;
                    break;
                case '17':
                    dataHour[17].a += total;
                    break;
                case '18':
                    dataHour[18].a += total;
                    break;
                case '19':
                    dataHour[19].a += total;
                    break;
                case '20':
                    dataHour[20].a += total;
                    break;
                case '21':
                    dataHour[21].a += total;
                    break;
                case '22':
                    dataHour[22].a += total;
                    break;
                case '23':
                    dataHour[23].a += total;
                    break;

                default:

                    break;
            }
            //dataHour[j] = {y: tempD[1], a: totalPages};
        }

    }]);