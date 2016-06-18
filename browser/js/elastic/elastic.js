app.config(function ($stateProvider) {
    $stateProvider.state('elastic', {
        url: '/elastic',
        templateUrl: 'js/elastic/elastic.html',
        controller: 'ElasticCtrl'
    });
});

app.controller('ElasticCtrl', function($scope, ElasticFactory) {
  $scope.list = [];
  $scope.suggestions = [];
  $scope.searchvalue = '';

  $scope.search = function(term) {
    if ($scope.searchvalue === '') {
      $scope.suggestions = [];
      return;
    }
    var tempArr = [];
    var results = ElasticFactory.getSuggestions($scope.searchvalue)
    .then(function(options) {
      console.log(options);
      for (var i in options) {
        tempArr.push(options[i].text);
      }
      $scope.suggestions = tempArr;
    });
  };

});

app.factory('ElasticFactory', function($http) {
  return {
    getSuggestions: function(input) {
      return $http.get('/api/elasticsearch/suggest/' + input)
      .then(function(response) {
        return response.data.docsuggest[0].options; //docsuggest.options
      });
    },
    postValue: function(input) {
      return $http.post('/api/elasticsearch/', {title: input})
      .then(function(response) {
        console.log(response.data);
      });
    }
  };
});

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
