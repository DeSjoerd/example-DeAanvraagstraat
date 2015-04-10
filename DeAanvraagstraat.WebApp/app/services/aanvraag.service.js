(function () {
    angular.module('straat.app')
    .service('aanvraag', aanvraag)

    function aanvraag($http) {
        var _this = this;

        _this.situatie = {};

        _this.getCalculatie = getCalculatie;


        function getCalculatie() {
            return $http.post('/api/calculatie', { situatie: _this.situatie })
                .then(function (resp) {
                    return resp.data;
                });
        }
    }
}());