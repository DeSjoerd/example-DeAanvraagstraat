(function () {
    angular.module('straat.app')
    .controller('SituatieCtrl', SituatieCtrl);

    function SituatieCtrl(aanvraag, $state) {
        var vm = this;

        vm.situatieModel = {};

        vm.onSubmit = onSubmit;

        activate();
        function activate() {
            vm.situatieModel.inkomen = aanvraag.situatie.inkomen;
            vm.situatieModel.deeltijd = aanvraag.situatie.deeltijd;
        }

        function onSubmit(situatieData) {
            aanvraag.situatie = situatieData;

            $state.go('calculatie');
        }
    }
}());