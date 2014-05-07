'use strict';

angular.module('SchoolMan')
  .controller('LoginCtrl', 
    function ($scope, $location, $routeParams, $user, $log, DEV, User, Path, Cache, Location, TimeTable, MockData) {


    $log.info("Path: ", $location.path()); 

    var DEFAULT_START_PAGE = {
        admin:{
            page:"users",
            view:"all"
        },
        classmaster:{
            page:"classmasterMarksheet",
            view:"all"
        },
        registrar:{
            page:"registration",
            view:"all"
        },
        teacher:{
            page:"myclasses",
            view:"simple"}
    }

    $scope.open = Location.open;
    $scope.page = $routeParams.page;

    // This data is used for creating the access dropdown in the login view
    // It should be moved to a service
    $scope.accessLevels = User.roles;

    $scope.access = $scope.accessLevels[$routeParams.accessCode];

    // Get a user object. 
    // Note: this user may not actually exist as a registered user
    $scope.userData = {
        fullname:$routeParams.fullname === 'null' ? '' : $routeParams.fullname, 
        accessCode:$routeParams.accessCode
    };

    $scope.login = function(page){
        var tempUser = $user.create($scope.userData);
        var accessRequest = $scope.userData.accessCode;

        $user.login(tempUser, accessRequest, function(user){
            if(user){
                
                Cache.set({user:user});

                Location.open({
                    page:page || DEFAULT_START_PAGE[accessRequest].page,
                    view:DEFAULT_START_PAGE[accessRequest].view,
                    formIndex:0,
                    groupIndex:0,
                    subjectKey:'engl',
                    studentId:0,
                    termIndex:0,
                    username:user.username,
                    accessCode:$scope.userData.accessCode});
            } else {
                Location.open({
                    page:"login404",
                    username:$scope.userData.fullname,
                    accessCode:$scope.userData.accessCode
                });
            }
        });
    };

    $scope.createNewAccount = function(){
        Location.open({
            page:"register",
            username:$scope.username||null
        });
    }


    if(DEV.AUTO_LOGIN){
        $scope.userData.fullname = DEV.AUTO_LOGIN_USER;
        $scope.userData.accessCode = DEV.AUTO_LOGIN_ACCESS;
        var page = DEV.hasOwnProperty("AUTO_LOGIN_PAGE") ? DEV.AUTO_LOGIN_PAGE : undefined;
        $scope.login(page); 
    }
    

  });
