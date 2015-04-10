(function () {
    angular.module('straat.app')
    .controller('CalculatieCtrl', CalculatieCtrl);

    function CalculatieCtrl(aanvraag) {
        var vm = this;

        vm.premie = '';


        activate();
        function activate() {
            aanvraag.getCalculatie()
                .then(function (calculatieResponseMessage) {
                    vm.premie = calculatieResponseMessage.premie;
                });
        }
    }
}());