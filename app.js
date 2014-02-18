var host = window.location.host.match(/localhost/) ? 'http://127.0.0.1:9393' : 'http://santicarmenyrodri.herokuapp.com';

function AppController($scope, $location, $http) {
    var match;
    $scope.invitation = { show: false };
    $scope.confirm = { message: false };
    $scope.total_confirmed = 1;
    if (match = $location.path().match(/invitation\/(.+)/)) {
        var invitationHash = match[1], 
            http = function (method, params) {
                params = params || "";
                return {
                    method: 'JSONP',
                    url: host + '/api/' + method + '/' + invitationHash + '?callback=JSON_CALLBACK' + params
                };
            };        
        $scope.yes = function () {
            $scope.confirm.message = "Aguarde un momento...";
            $scope.confirm.alert = "warning";
            $http(http('confirm', "&total_confirmed=" + $scope.total_confirmed)).
            success(function(invitation, status) {
                $scope.confirm.message = "Recibimos tu confirmacion, nos vemos en la fiesta :)";
                $scope.confirm.alert = "success";
            }).
            error(function(data, status) {
                $scope.confirm.message = "Ha ocurrido un error, por favor intenta nuevamente";
                $scope.confirm.alert = "danger";
            });
        };
        $scope.no = function () {
            $scope.confirm.message = "Aguarde un momento...";
            $scope.confirm.alert = "warning";
            $http(http('confirm', "&total_confirmed=0")).
            success(function(invitation, status) {
                $scope.confirm.message = "Recibimos correctamente, nos veremos en otra ocasión :(";
                $scope.confirm.alert = "info";
            }).
            error(function(data, status) {
                $scope.confirm.message = "Ha ocurrido un error, por favor intenta nuevamente";
                $scope.confirm.alert = "danger";
            });
        };
        $http(http('invitation')).
        success(function(invitation, status) {
            $scope.invitation = invitation;
            if (!invitation.confirmed) {
                $scope.invitation.message = "todavía no confirmaste tu invitación a la fiesta";
                $scope.invitation.action = "Confirmar asistencia";
                $scope.invitation.alert = "warning";
            } else {
                $scope.invitation.message = "ya confirmaste tu asistencia";
                $scope.invitation.action = "Cambiar asistencia";
                $scope.invitation.alert = "info";
            }
            $scope.invitation.go = invitation.total > 1 ? "vamos" : "voy";
            $scope.invitation.labels = function () {
                var labels = ["Voy yo solo"];
                for (var i = 2; i <= this.total; i++) {
                    labels.push("Vamos los " + i);
                }
                return labels;
            };
            $scope.invitation.show = true;
            $scope.total_confirmed = invitation.total;
        }).
        error(function(data, status) {
            window.alert("Ha ocurrido un error, intentar mas tarde");
        });
    }
}
