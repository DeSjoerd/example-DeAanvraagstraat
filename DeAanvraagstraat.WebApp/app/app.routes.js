(function () {
    angular.module('straat.app')
    .config(function ($stateProvider, $urlRouterProvider) {
        
        $stateProvider
        .state('situatie', {
            url: '/situatie',
            controller: 'SituatieCtrl',
            controllerAs: 'situatie',
            templateUrl: 'app/1-situatie/situatie.html'
        })
        .state('calculatie', {
            url: '/calculatie',
            controller: 'CalculatieCtrl',
            controllerAs: 'calculatie',
            templateUrl: 'app/2-calculatie/calculatie.html'
        });

        $urlRouterProvider.otherwise('/situatie');
    });
}());