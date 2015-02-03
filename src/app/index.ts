/// <reference path="../../bower_components/dt-angular/angular.d.ts" />

module tourneyTracker {
    angular.module('tourneyTracker', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
        .controller('MainCtrl', MainCtrl)
        .controller('NavbarCtrl', NavbarCtrl)

        .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'app/main/main.html',
            controller: 'MainCtrl'
        });

        $urlRouterProvider.otherwise('/');
    })
    ;
}
