'use strict';

var app = angular.module('printApp', []);

app.controller('PrintController', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
        $scope.version = "1.0";
        $scope.year = $filter('date')(new Date(), "yyyy");
        $scope.fecha = new Date();
        $scope.months = [];
        $scope.daysOfWork = [];

        var a = window.location.toString();
        var name = a.substring(a.indexOf("=") + 1);

        console.info(a);
        console.info(name);

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

        //Get the all time stats from the app was installed
        var promise6 = getStatsMonthsOrAllTime('state')
        promise6.then(function (result) {
            var state = result.split("-");
            $scope.state = state[0];
            $scope.dofu = state[1];
        });

        function getStatsMonthsOrAllTime(type) {
            return $http.get('data-ptr/state.txt').
                    then(function (result) {
                        return result.data;
                    });
        }

    }]);