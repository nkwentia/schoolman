'use strict';

angular.module('SchoolMan')
  .controller('PromotionCtrl', function ($scope, $routeParams, Groups, Forms, Data, ClassMaster, CourseCatalog, Location, Registrar, Mastersheet) {
    $scope.formIndex  = $routeParams.formIndex;

    $scope.forms = Forms.all();
    $scope.form  = $scope.forms[$routeParams.formIndex];

    $scope.groups = Groups.getAll();

    $scope.open = Location.open;

    $scope.groupStats = {
        0:{passing:0, failing:0, percentPassing:0},
        1:{passing:0, failing:0, percentPassing:0}
        // ... etc - populated during buildMastersheet
    }

    $scope.mastersheets = {};
    
    var subjects = CourseCatalog.getSubjects($routeParams.formIndex);

    var updateGroupStats = function(group, stats){
        console.log("Updating ", group , stats);
        $scope.groupStats[group] = stats;
    };

    // This is doing more work than it needs to because we dont need a mastersheet
    // for every course
    var buildMastersheet = function(groupIndex){
        
        var courses = CourseCatalog.getCourses($routeParams.formIndex, groupIndex);
        var courseIds = courses.map(function(course){return course.id});

        var marksheets = ClassMaster.getMarksheets(courseIds);
        var mastersheet = new Mastersheet({
            termIndex:0,
            subjects:subjects,
            marksheets:marksheets,
            getSubjectKey:CourseCatalog.getSubjectKey
        });
        $scope.mastersheets[groupIndex] = mastersheet;
        var passingScore = $scope.groups[groupIndex].getPromoPass($routeParams.formIndex)
        updateGroupStats(groupIndex, mastersheet.numstats(passingScore));
        
    }

    angular.forEach($scope.groups, function(group, groupIndex){
        if(group.forms[$scope.formIndex].active){
           buildMastersheet(groupIndex); 
        }
    });

    $scope.save = function(groupIndex){
        var formIndex = $routeParams.formIndex;
        var newPass = parseFloat($scope.groups[groupIndex].forms[formIndex].pass);
        var oldPass = parseFloat($scope.groups[groupIndex].getPromoPass(formIndex));
        if(newPass !== oldPass){
           $scope.groups[groupIndex].setPass(formIndex, newPass); 
           buildMastersheet(groupIndex);
        }
    };
  });
