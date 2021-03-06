'use strict';
/**
 * @ngdoc controller
 * @name SchoolMan.controller:Departments
 * @method {function} add
 * @method {function} remove
 * @method {function} toggleForm
 * @description Departments view controller
 *
 */

function DepartmentsCtrl($scope, $log, Registrar, model, Students, Departments, CourseCatalog){

  $scope.forms = CourseCatalog.getForms();

  $scope.departments = Departments.getAll();
  console.log($scope.departments);

  $scope.newDepartment = new model.Department();

		$scope.allStudents = {};

  $scope.add = function(department){
    department.save().then(function(success){
              console.log("Department saved", success);
              $scope.departments[success.id] = department;
              Departments.set($scope.newDepartment, success.id);
              $scope.allStudents[$scope.newDepartment._id]  = [];
              $scope.newDepartment = new model.Department();
          }).catch(function(error){
              console.log("Department save error ", error);
          });
  };

  $scope.remove = function(department){
    Departments.remove(department).then(function(success){
      delete $scope.departments[department._id];
    });
  };

  $scope.toggleForm = function(department, formIndex){
    department.toggleForm(formIndex).save().then(function(success){
      Departments.set(department, department._id);
    });
  };

  Students.getAll().then(function(students){
      angular.forEach($scope.departments, function(dept, deptId){
        $scope.allStudents[deptId] = [];
      });
      angular.forEach(students, function(student, studentId){
        $scope.allStudents[student.deptId].push(student);
      });
    console.log("Got all students: ", $scope.allStudents);
  }).catch(function(error){
    console.log("Failed to get all students, ", error);
  });

}

DepartmentsCtrl.$inject = ['$scope', '$log', 'Registrar', 'model', 'Students', 'Departments', 'CourseCatalog'];
angular.module('SchoolMan').controller('DepartmentsCtrl', DepartmentsCtrl);