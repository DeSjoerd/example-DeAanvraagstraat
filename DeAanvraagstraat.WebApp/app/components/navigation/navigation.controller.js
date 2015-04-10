(function () {
    angular.module('straat.components')
    .controller('NavigationCtrl', NavigationCtrl)

    function NavigationCtrl(steps, $state) {
        var vm = this;

        vm.$state = $state;

        vm.steps = steps.steps;
    }
}());