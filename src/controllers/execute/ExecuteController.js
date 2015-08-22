app.controller('ExecuteController', function ($scope, $mdToast, ExecuteService) {
    $scope.messages = [];

    var started = function (message) {
        $scope.messages = [];
    };

    var finished = function (message) {
        $scope.last_execute = message.finish_time;
    };

    var log = function (message) {
        $scope.messages.push(message);
    };

    $scope.execute = function () {
        $scope.messages = [];
        oboe('/api/execute')
            .node('!.*', function(evt){
                $scope.$apply(function() {
                    if (evt.event == 'started') {
                        started();
                    } else if (evt.event == 'log') {
                        log(evt.data);
                    } else if (evt.event == 'finished') {
                        finished(evt.data);
                    }
                });
            });
    };

    $scope.updateInterval = function () {
        ExecuteService.save($scope.interval).then(function (data) {
            $mdToast.simple()
                .content('Interval updated')
                .position('right top')
                .hideDelay(3000);
        });
    };

    ExecuteService.load().then(function(data) {
        $scope.interval = data.data.interval;
        $scope.last_execute = data.data.last_execute;
    });
});
