'use strict';

angular.module('SchoolMan')
  .service('Departments', function Departments($q, Data2, modelTransformer, model, InsertionError) {

		var departments = {};  	

  	var self = {};

  	self.getAll = function(){
  		return departments;
  	};

  	self.get = function(departmentKey){
  		return departments[departmentKey];
  	};

  	self.add = function(department){
  		console.log("inside department add function");
      if(departments.hasOwnProperty(department.code)){
  			throw new InsertionError("departments", department.code);
  		} else {
  			departments[department.code] = department;
        console.log("added department");
  		}
  	};

    self.remove = function(department){
      Data2.remove(department).then(function(success){
        console.log("Department removed: ", success);
        delete departments[department._id];
      }).catch(function(error){
        $log.error("departments.js : remove :", error);
      });
    };

  	self.save = function(){
  		Data.saveLater({departments: departments});
  	};

    self.load = function(){
      var deferred = $q.defer();
      // Load Data
      var map = function(doc, emit){
        if(doc.datatype === model.Department.datatype._id){
          emit(doc._id, {_id:doc.datatype, data:doc});
        } 
      };
      Data2.query(map, {include_docs : true}).then(function(success){
        angular.forEach(success.rows, function(data, rowIndex){
          var spec = data.doc;
          var obj = model.parse(data.value.data, spec);
          var department = modelTransformer.transform(obj, model.Department);
          departments[department._id] = department;
          });
          console.log("Departments:Query success", departments);
          deferred.resolve(departments);
        }).catch(function(error){
          console.log("Departments: Query failed", error);
          deferred.reject(error);
      });

      return deferred.promise;
    }

    return self;

  });
