angular.module('fflx.app.filters', ['ionic',
'fflx.common.directives',
'fflx.app.services',
'fflx.app.filters',
'fflx.app.controllers',
'fflx.auth.controllers',
'fflx.views',
'underscore',
'angularMoment',
'ngCordova',
'monospaced.elastic'])

.filter('cleanUrl',function() {
  return function(url) {
    if (url) {
      return url.replace('www.', '').replace('https://', '').replace('http://', '');
    }
  }
})

;
