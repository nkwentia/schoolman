'use strict';

angular.module('SchoolMan')
  .controller('ClasscouncilCtrl', function ($scope, $routeParams, model, Marksheets, Students, ClassCouncils, Groups, Forms, Departments, Terms, ClassMaster, CourseCatalog, Location, Mastersheet) {
    
    $scope.pageTitleEnglish = "CLASS COUNCIL REPORT";
    $scope.pageTitleFrench = "RAPPORT DU CONSEIL DE CLASSE";

    $scope.formIndex = $routeParams.formIndex;
    $scope.groupId = $routeParams.groupId;
    $scope.deptId = $routeParams.deptId;
    $scope.termIndex = parseInt($routeParams.termIndex);

    var classcouncilId = model.ClassCouncil.generateID($routeParams);

    $scope.data = {};
    $scope.data.forms = Forms.all();
    $scope.data.departments = Departments.getAll();
    $scope.data.groups = Groups.getAll();
    $scope.data.terms = Terms.getAll();
    $scope.data.currentDate = new Date();
    $scope.data.rankings = {};
    $scope.data.rankingsList = [];
    $scope.data.bestStudents = [];
    $scope.data.worstStudents = [];
    $scope.data.bestAverages = [];

    $scope.data.classcouncil = new model.ClassCouncil({_id:classcouncilId,formIndex:$scope.formIndex,groupId:$scope.groupId,deptId:$scope.deptId});

    ClassCouncils.get(classcouncilId).then(function(classcouncil){
        $scope.data.classcouncil = classcouncil;
    });


    $scope.groupStats = {};
    
    $scope.open = Location.open;


     Marksheets.query({
        formIndex:$routeParams.formIndex,
        deptId:$routeParams.deptId,
        groupId:$routeParams.groupId
      }).then(function(marksheets){

        // Convert marksheets to a list and store in $scope.data.marksheets

        
        
        $scope.data.marksheets = _.map(Object.keys(marksheets), function(marksheetId){
          return marksheets[marksheetId];
        });
        
        // combine all marksheets
        $scope.data.combinedMarksheet = Marksheets.combine($scope.data.marksheets);
        console.log("combined marksheet created:", $scope.data.combinedMarksheet);
        
        // summarize combined marksheet to get grand totals
        $scope.data.summarysheet = Marksheets.summarize($scope.data.combinedMarksheet, $scope.termIndex);;
        console.log("summary marksheet created:", $scope.data.summarysheet);

        
        
        $scope.groupStats = performanceStats();
        $scope.score = $scope.data.classcouncil.passingScore;
        
        // get rankings from combined marksheet
        $scope.data.rankings = Marksheets.rank($scope.data.combinedMarksheet);
        console.log("rankings:", $scope.data.rankings);
        
        updatePerformanceRanks();

       

      })
      .catch(function(error){
        console.log("Failed to find marksheets", error);
      });

    var performanceStats = function(){
        var stats = {
            numStudents:0,
            numPresent:0,
            passing:0,
            failing:0,
            percentPassing:0,
            percentFailing:0,
            classAverage:0,
            classRange:0
        };

        var minStudent = 20;
        var maxStudent = 0;
        var studentAvg = 0;
        var classTotal = 0;
        
        angular.forEach($scope.data.summarysheet, function(student, studentId){
            stats.numStudents = stats.numStudents +1;
            studentAvg = student[0];

            if(studentAvg >= $scope.data.classcouncil.passingScore){
                stats.passing = stats.passing +1;
            }
            if(!isNaN(studentAvg)){
                classTotal = classTotal + studentAvg;
                stats.numPresent = stats.numPresent + 1;
                if(studentAvg < minStudent){
                    minStudent = studentAvg;
                }
                if(studentAvg > maxStudent){
                    maxStudent = studentAvg;
                }
            }
        });

        stats.failing = stats.numStudents - stats.passing;
        stats.percentPassing = stats.passing / stats.numStudents;
        stats.percentFailing = 1 - stats.percentPassing;
        stats.classAverage = classTotal / stats.numStudents;
        stats.classRange = maxStudent - minStudent;
        return stats;
    }
    
    

    var updatePerformanceRanks = function(){
        var studentIds = Object.keys($scope.data.rankings);
        var rankingsList = _.map(studentIds, function(studentId){
            var obj = {};
            obj.rankings = $scope.data.rankings[studentId];
            obj.studentId = studentId;
            return obj;
        })
        console.log("rankingsList",rankingsList);
        var sortedList = rankingsList.sort(function(a,b){
            return a.rankings[$scope.termIndex] - b.rankings[$scope.termIndex];
        })
        console.log("sortedList:", sortedList);
        angular.forEach(sortedList, function(student, objId){
            console.log("object in sortedlist", student.rankings);
        })

        var top3 = [sortedList[0].studentId,sortedList[1].studentId,sortedList[2].studentId];
        var sortedListEnd = sortedList.slice(-3);
        var worst3 = [sortedListEnd[0].studentId,sortedListEnd[1].studentId,sortedListEnd[2].studentId];

        Students.getBatch(top3).then(function(students){
            $scope.data.bestStudents = _.map(students, function(student){
                student.average = $scope.data.summarysheet[student._id][0];
                console.log("best students:", student);
                return student;
            });
        }).catch(function(error){
          console.log("Failed to find students: ", error);
        });
        Students.getBatch(worst3).then(function(students){
            $scope.data.worstStudents = _.map(students, function(student){
                student.average = $scope.data.summarysheet[student._id][0];
                console.log("worst students:", student);
                return student;
            });
        }).catch(function(error){
          console.log("Failed to find students: ", error);
        });
    }
    
    $scope.changeAcRemark = function(remark){
        $scope.data.classcouncil.academicRemark[$scope.termIndex] = remark;
        $scope.save();
    }
    $scope.changeConRemark = function(remark){
        $scope.data.classcouncil.conductRemark = remark;
        $scope.save();
    }

    $scope.updatePassingScore = function(){
        if(isNaN(Number($scope.score))){
            $scope.score = $scope.data.classcouncil.passingScore;
        }
        else{
            
            $scope.data.classcouncil.passingScore = Number($scope.score);
            $scope.groupStats = performanceStats();
            $scope.save();
        }
    }

    $scope.save = function(){
        $scope.data.classcouncil.save().then(function(success){
            console.log("Council saved", success);
        }).catch(function(error){
            console.log("Council save error ", error);
        });
    }

    $scope.data.remarks = [
    	{text:"Excellent", css:"remark-excellent"},
    	{text:"Very Good", css:"remark-verygood"},
    	{text:"Good", css:"remark-good"},
    	{text:"Fair", css:"remark-fair"},
    	{text:"Average", css:"remark-average"},
    	{text:"Poor", css:"remark-poor"},
    	{text:"Very Poor", css:"remark-verypoor"}
    ];


  });