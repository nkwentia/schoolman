'use strict';

angular.module('SchoolMan')
  .controller('MastersheetCtrl', function ($scope, $routeParams, Departments, Groups, SubjectTypes, Forms, Cache, Registrar, CourseCatalog, ClassMaster, TimeTable, Data, Location, Mastersheet, PROMOTE_OPTIONS) {
  	
    $scope.subjects = CourseCatalog.getSubjects($routeParams.formIndex);
    $scope.departments = Departments.getAll();

    $scope.getSubjectsByType = function(reqType){
      
      var subgroup = {};
      var subtypes = SubjectTypes.all();

      angular.forEach($scope.subjects, function(subject, subjectKey){
        if(subject.type === reqType){
          subgroup[subjectKey] = subject;
        }
      });

      return subgroup;
    };

    var courseId = CourseCatalog.getCourseId($routeParams);
    $scope.students = Registrar.getStudentsByCourse(courseId);
    $scope.pageTitleEnglish = "ACADEMIC REPORT CARD";
    $scope.pageTitleFrench = "BULLETIN DE NOTES";

    $scope.open = Location.open;

    $scope.getMastersheet = function(m){
      var formIndex = $routeParams.formIndex;
      var groupIndex = $routeParams.groupIndex;
      if(m){
        formIndex = m.hasOwnProperty('formIndex') ? m.formIndex : formIndex;
        groupIndex = m.hasOwnProperty('groupIndex') ? m.groupIndex : groupIndex;
      }
      var courses = CourseCatalog.getCourses(formIndex, groupIndex);
      var courseIds = courses.map(function(course){return course.id});
      var marksheets = ClassMaster.getMarksheets(courseIds);
      console.log("MastersheetCtrl subjects", $scope.subjects)
      var mastersheet = new Mastersheet({
        termIndex:$routeParams.termIndex,
        students:$scope.students,
        subjects:$scope.subjects,
        marksheets:marksheets,
        getSubjectKey:CourseCatalog.getSubjectKey
      });
      return mastersheet; 
    };

    if($routeParams.page === 'mastersheet'){

      // for D3 Barchart
      $scope.graphView = {};
      $scope.graphView.view = Cache.get("graphView");
      if($scope.graphView.view === undefined){
        $scope.graphView.view = "mastersheet";
      }

      $scope.setGraphView = function(view){
        $scope.graphView.view = view;
        Cache.set({"graphView":view});
      }

      var margin = {top: 20, right: 40, bottom: 30, left: 40},
      width = 1100 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10, "");

      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<table>"+
                      "<tr>" +
                        "<td style='text-align:right;'>Subject:</td>"+
                        "<td class='tip-subject'>"+$scope.subjects[d.subject].en+"</td>"+
                      "</tr>"+
                      "<tr>"+
                        "<td style='text-align:right;'>Average:</td>"+
                        "<td class='tip-average'>"+d.average+"</td>"+
                      "</tr>"+
                    "</table>"
            
          })

      var svg = d3.select(".d3-barchart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip);

      var studentsData = [];
      angular.forEach($scope.getMastersheet().table.students, function(student, studentId){
        studentsData.push(student);
      });

      var subjectData = [];
      angular.forEach($scope.subjects, function(subject, subjectKey){
        subjectData.push(subjectKey);
      });



      var data = subjectData.map(function(subject){

        var dataItem = {};
        dataItem.subject = subject;

        var reduceRuns = 0;
        var nanRuns = 0;
        var normalRuns = 0;

        var validScores = 0;
        var total = studentsData.reduce(function(t, student){
          if(isNaN(student[subject].average)){
            return t;
          } else {
            validScores += 1;
            return t + parseFloat(student[subject].average);
          }
        },0.0);

        dataItem.average = validScores === 0 ? 0 : total / validScores;

        return dataItem;
      });

      console.log("studentsData", data);

        x.domain(data.map(function(d) { return d.subject; }));
        y.domain([0, 20]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Class Average");

        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.subject); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.average); })
            .attr("height", function(d) { return height - y(d.average); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    } 

    var reportCards = ['reportcard', 'reportcardGTHS']
    if(reportCards.indexOf($routeParams.page) > -1){

      $scope.PROMOTE_OPTIONS = PROMOTE_OPTIONS;

      $scope.student = $routeParams.studentId === "0" ?
        $scope.students[0] :
        Registrar.getStudent($routeParams.studentId);

      $scope.forms = Forms.all();
      $scope.form  = $scope.forms[$routeParams.formIndex];

      $scope.groups = Groups.getAll();
      $scope.group  = $scope.groups[$routeParams.groupIndex];

      $scope.terms = CourseCatalog.getTerms();
      $scope.term  = $scope.terms[$routeParams.termIndex];
      $scope.termIndex = $routeParams.termIndex;

      // get all marksheets for all subjects in this class
      $scope.marksheets = {};
      angular.forEach($scope.subjects, function(subject, subjectKey){
        var params = {
          formIndex:$routeParams.formIndex,
          groupIndex:$routeParams.groupIndex,
          subjectKey:subjectKey};
        $scope.marksheets[subjectKey] = ClassMaster.getMarksheet(CourseCatalog.getCourseId(params));
      });

      $scope.getCourseId = function(d){
        var params = angular.copy($routeParams);
        angular.forEach(d, function(param, paramKey){
          params[paramKey] = param;
        });
        return  CourseCatalog.getCourseId(params);
      }

      $scope.getTeacher = function(subjectKey){
        var courseId = $scope.getCourseId({subjectKey:subjectKey});
        var bookmark = TimeTable.getTeacher(courseId);
        var username = bookmark.username || "";
        var teacher = {};
        Data.get('users', function(users){
          var user = users[username];
          teacher.fullname = user ? user.fullname : "";
        });
        return teacher;
      };

      $scope.getMarksheet = function(subjectKey){
        return $scope.marksheets[subjectKey];
      };
      $scope.getRemark = function(average){
        return ClassMaster.getRemark(average);
      };

    $scope.open = Location.open;


    }

  });