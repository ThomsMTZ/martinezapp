app.controller("tasksController", function($scope, tasksFactory, $rootScope, $location ) {

    $scope.tasks = [];
 
    $scope.getAllTasksFromAuthor = function(){
       
        if( $rootScope.loggedUser == undefined && sessionStorage.getItem("loggedUser") == undefined ){  
            $location.path("/Login");
        }else{
            
            $rootScope.loggedUser = sessionStorage.getItem("loggedUser");
        }
        
        tasksFactory.getAllTasksFromAuthor( $rootScope.loggedUser, function( tasks ) {
            $scope.tasks = tasks;
        });
    }

    $scope.addTask = function(){
        tasksFactory.addTask( $scope.newTask.title, $scope.newTask.task, $rootScope.loggedUser, function() {
            $scope.getAllTasksFromAuthor();
        });
        $scope.newTask.title = '';
        $scope.newTask.task = '';
    }

    $scope.removeTask = function( task ){
        tasksFactory.removeTask( task._id, function() {
            $scope.getAllTasksFromAuthor(task.author);
        } );
    }

    $scope.setStatusTask = function( task ){
        tasksFactory.setStatusTask( task._id, !task.done, function() {
            $scope.getAllTasksFromAuthor( task.author );
        } );        
    }

    $scope.getAllTasksFromAuthor();
});

app.controller("registerController", function($scope, registerFactory, $location, $rootScope) {

    $scope.register = function(){
        $scope.error = '';

        if( $scope.register.password == $scope.register.passwordVerification ){
            registerFactory.register( $scope.register.username, $scope.register.password , function( available ) {
                if( !available ){
                    $scope.error = "Username not available";
                }else{
                    
                    sessionStorage.setItem("loggedUser",$scope.register.username);
        
                    $location.path( "/" );
                }
            });
        }else{
            $scope.error = "Your passwords do not match"
        }
        $scope.register.password = '';
        $scope.register.passwordVerification = '';
    }
});

app.controller("loginController", function($scope, loginFactory, $location, $rootScope ) {

    $scope.login = function(){
        $scope.error = '';

        loginFactory.getPasswordOfLogin( $scope.login.username, $scope.login.password , function( passwords ) {
            if( passwords.password != passwords.passwordToTest ){
                $scope.error = "Invalid username or password";
            }else{
                
                sessionStorage.setItem("loggedUser",$scope.login.username);
        
                $location.path( "/" );
            }
        });
        $scope.login.password = '';
    }

    $scope.logout = function(){
        console.log("logout");
        sessionStorage.removeItem("loggedUser");
        $rootScope.loggedUser = undefined;
        $location.path("/Login");
        
    }
});