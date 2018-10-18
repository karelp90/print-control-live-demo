
/**
 * Theme: Ubold Admin Template
 * Author: Coderthemes
 * Morris Chart
 */

!function ($) {
    "use strict";

    var Dashboard1 = function () {
        this.$realData = []
    };

    //creates Stacked chart
    Dashboard1.prototype.createStackedChart = function (element, data, xkey, ykeys, labels, lineColors) {
        var className = $('#morris-bar-stacked').attr('class').toString();
        console.info(className);
        Morris.Bar({
            element: element,
            data: data,
            xkey: xkey,
            ykeys: ykeys,
            stacked: true,
            labels: labels,
            hideHover: 'auto',
            resize: true, //defaulted to true
            xLabelMargin: 10,
            gridLineColor: '#eeeeee',
            barColors: lineColors
        });
    },
            Dashboard1.prototype.init = function () {

                //creating Stacked chart
                var $stckedData = [
                    {day: 'Lun', value: 80},
                    {day: 'Mar', value: 10},
                    {day: 'Mier', value: 5},
                    {day: 'Juev', value: 5},
                    {day: 'Vier', value: 5},
                    {day: 'Sab', value: 5},
                    {day: 'Dom', value: 20}
                ];
                this.createStackedChart('morris-bar-stacked', $stckedData, 'day', ['value'], ['Hojas'], ['#5d9cec']);
            },
            //init
            $.Dashboard1 = new Dashboard1, $.Dashboard1.Constructor = Dashboard1
}(window.jQuery),
//initializing 
        function ($) {
            "use strict";
            $.Dashboard1.init();
        }(window.jQuery);