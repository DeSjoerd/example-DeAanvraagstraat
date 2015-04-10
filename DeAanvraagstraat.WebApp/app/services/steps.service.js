(function () {
    angular.module('straat.app')
    .service('steps', steps)

    function steps() {
        var _this = this;

        _this.current = '';

        _this.steps = [
            {
                title: 'Situatie',
                state: 'situatie'
            },
            {
                title: 'Calculatie',
                state: 'calculatie'
            },
            {
                title: 'Gegevens',
                state: 'gegevens'
            },
            {
                title: 'Aanvraag versturen',
                state: 'versturen'
            }
        ];


    }

}());