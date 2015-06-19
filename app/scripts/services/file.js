'use strict';

function File(pouchdb, $q, model, settings, Users, Fees, Departments, Subjects, Groups, Students, Payments, Data2, SchoolInfos) {
  // AngularJS will instantiate a singleton by calling "new" on this function

  var self = {};


  self.import = function(previous_flag){
    var data = [];
    var deferred = $q.defer();
    var promise;

    chrome.fileSystem.chooseEntry({type:"openFile"}, 
      function(entry){
        entry.file(function(file){
          var reader = new FileReader();

          reader.onloadend = function(success){
            var data = JSON.parse(success.target.result);
            console.log("Read successful.", data);
            if(previous_flag){
              $q.when(savePreviousToDB(data)).then(function(success){
                reloadData(true);
              });
            } else {
              $q.when(saveToDB(data)).then(function(success){
                reloadData(false);
              });
            }
          }
          reader.onerror = function(error){
            console.log("Read failed:", error);
            deferred.reject(error);
          }

          reader.readAsText(file);

        }).catch(function(error){
          console.log("error reading file", error);
        });
    });
    var reloadData = function(previous_flag) {

      var settingsP = settings.load();
      var userP = Users.load();
      var feesP = Fees.load();
      var deptP = Departments.load();
      var subjP = Subjects.load();
      var groupP= Groups.load();
      var studentsP= Students.load();
      var infosP = SchoolInfos.get();

      // Initialize/Register ClassCouncil datatype
      var instClassCouncil = new model.ClassCouncil();

      var promises = [settingsP, deptP, groupP, subjP, feesP, userP, studentsP, infosP];

      $q.all(promises).then(function(success){
        var students = success[6];
        
        if(previous_flag){
          angular.forEach(students, function(student, studentIndex){
            if(student.totalPaid !== 0){
              student.totalPaid = 0;
              student.save().then(function(success){
              });
            }
          });
          deferred.resolve();
        } else {
          angular.forEach(students, function(student, studentIndex){
            Payments.query({studentId:student._id}).then(function(payments){
              var totalPaid = _.reduce(payments, function(total, payment){
                return total + payment.amount;
              },0);
              if(student.totalPaid !== totalPaid){
                student.totalPaid = totalPaid;
                student.save().then(function(success){
                  console.log("Student saved:", success);
                });
              }
            }).catch(function(error){
              console.log("Failed to load payments for ", student.name, error);
            });
          });
          deferred.resolve();
        }

      });

    }
    
    return deferred.promise;
  }
  var saveToDB = function(data){
    var deferred = $q.defer();
    var dbs = [{name:"gen", list:[], db:pouchdb.create('gths')},
                {name:"students", list:[], db:pouchdb.create('db_students'), datatype:"datatype/student/v1"},
                {name:"payments", list:[], db:pouchdb.create('db_payments'), datatype:"datatype/payment/v1"},
                {name:"marksheets", list:[], db:pouchdb.create('db_marksheets'), datatype:"datatype/marksheet/v1"},
                {name:"transcripts", list:[], db:pouchdb.create('db_transcripts'), datatype:"datatype/transcript/v1"},
                {name:"items", list:[], db:pouchdb.create('db_items'), datatype:"datatype/item/v1"}]
    
    angular.forEach(data, function(item, itemKey){
      if(item.doc.datatype === dbs[1].datatype){
        dbs[1].list.push(item.doc);
      }
      else if(item.doc.datatype === dbs[2].datatype){
        dbs[2].list.push(item.doc);
      }
      else if(item.doc.datatype === dbs[3].datatype){
        dbs[3].list.push(item.doc);
      }
      else if(item.doc.datatype === dbs[4].datatype){
        dbs[4].list.push(item.doc);
      }
      else if(item.doc.datatype === dbs[5].datatype){
        dbs[5].list.push(item.doc);
      }
      else {
        dbs[0].list.push(item.doc);
      }
    });
    
    
    dbs[0].db.bulkDocs({docs: dbs[0].list}, {new_edits:false}).then(function(success){
      console.log(dbs[0].name, "imported", success, dbs[0].list);
      dbs[1].db.bulkDocs({docs: dbs[1].list}, {new_edits:false}).then(function(success){
        console.log(dbs[1].name, "imported", success, dbs[1].list);
        dbs[2].db.bulkDocs({docs: dbs[2].list}, {new_edits:false}).then(function(success){
          console.log(dbs[2].name, "imported", success, dbs[2].list);
          dbs[3].db.bulkDocs({docs: dbs[3].list}, {new_edits:false}).then(function(success){
            console.log(dbs[3].name, "imported", success, dbs[3].list);
            dbs[4].db.bulkDocs({docs: dbs[4].list}, {new_edits:false}).then(function(success){
              console.log(dbs[4].name, "imported", success, dbs[4].list);
              dbs[5].db.bulkDocs({docs: dbs[5].list}, {new_edits:false}).then(function(success){
                console.log(dbs[5].name, "imported", success, dbs[5].list);
                deferred.resolve();
              });
            });
          });
        });
      });
    }).catch(function(error){
        console.log("Error saving to Import DB:", error);
        deferred.reject();
    });
    return deferred.promise;
  }
  
  var savePreviousToDB = function(data){
    var deferred = $q.defer();
    var dbs = [{name:"gen", list:[], db:pouchdb.create('gths')},
                {name:"students", list:[], db:pouchdb.create('db_students'), datatype:"datatype/student/v1"}];
    var exclude = ["datatype/payment/v1", 
                  "datatype/marksheet/v1", 
                  "datatype/item/v1", 
                  "datatype/classcouncil/v1", 
                  "datatype/comment/v1",
                  "datatype/dcard/v1",
                  "datatype/transcript/v1"];

    //account for changes to the model for required attributes
    var modelChanges = ["datatype/user/v1",
                        "datatype/settings/v1",
                        "datatype/schoolinfo/v1"];
    
    angular.forEach(data, function(item, itemKey){
      if(exclude.indexOf(item.doc.datatype) > -1){
        //do not import
      }
      else if(item.doc.datatype === dbs[1].datatype){
        dbs[1].list.push(item.doc);
      }
      else {
        angular.forEach(modelChanges, function(dataype){
          if(item.doc.datatype === dataype){
            console.log(dataype, "Item:", item);
          }
        })
        dbs[0].list.push(item.doc);
      }
    });
    
    
    dbs[0].db.bulkDocs({docs: dbs[0].list}, {new_edits:false}).then(function(success){
      console.log(dbs[0].name, "imported", success, dbs[0].list);
      dbs[1].db.bulkDocs({docs: dbs[1].list}, {new_edits:false}).then(function(success){
        console.log(dbs[1].name, "imported", success, dbs[1].list);
        deferred.resolve();
      });
    }).catch(function(error){
        console.log("Error saving to Import DB:", error);
        deferred.reject();
    });
    return deferred.promise;
  }

  self.export = function(){
    
  	var dbs = [];
  	var data = [];
    var deferred = $q.defer();
          
    var services = [
    	{getDB:function(){return 'gths'}},
    	{getDB:function(){return 'db_students'}},
      {getDB:function(){return 'db_payments'}},
      {getDB:function(){return 'db_marksheets'}},
      {getDB:function(){return 'db_transcripts'}},
      {getDB:function(){return 'db_items'}}
    ]

    angular.forEach(services, function(service){
    	//Collect all the databases
    	var db = service.getDB();
    	if(dbs.indexOf(db) === -1){
    		dbs.push(db);
    	}
    });

    var merge = function(dbs){
      pouchdb.create(dbs[0]).allDocs({include_docs:true, attachments:true}).then(function(success){
        data = data.concat(success.rows);
        if(dbs.length === 1){
          Data2.get("logo", {attachments:true}).then(function(success){
            angular.forEach(data, function(item){
              if(item['id'] === "logo"){
                item['doc']['_attachments']['logo.png'] = success['_attachments']['logo.png'];
              }
            })
            console.log("Merge successful:", data);
            writeData(JSON.stringify(data));
          }).catch(function(error){
            console.log("Merge successful:", data);
            writeData(JSON.stringify(data));
          })
        }
        else if(dbs.length > 1){
          merge(dbs.slice(1));
        }
      });
    }
    var writeData = function(data){
      

      chrome.fileSystem.chooseEntry({
        type:"saveFile", 
        suggestedName:"schoolman.data"}, 
        function(entry){
          entry.createWriter(function(fileWriter){
            fileWriter.onwriteend = function(error) {
              if(fileWriter.length === 0){
                fileWriter.write(blob);
              } else{
                console.log('Write completed.');
                deferred.resolve();
              }
            };

            fileWriter.onerror = function(error) {
              console.log('Write failed: ' + error);
              deferred.reject(error);
            };

            var blob = new Blob([data], {type: 'text/plain'});

            fileWriter.truncate(0);
                        
          }).catch(function(error){
            console.log("error creating writer", error)
          });
        });
    }


    merge(dbs);
    return deferred.promise;
  }

  self.exportSchool = function(school){
    console.log("Exporting", school);
    chrome.fileSystem.chooseEntry({
    type:"saveFile", 
    suggestedName:"school.data"}, 
    function(entry){
      entry.createWriter(function(fileWriter){
        fileWriter.onwriteend = function(error) {
          if(fileWriter.length === 0){
            fileWriter.write(blob);
          } else{
            console.log('Write completed.');
          }
        };

        fileWriter.onerror = function(error) {
          console.log('Write failed: ' + error);
        };

        var blob = new Blob([JSON.stringify(school)], {type: 'text/plain'});

        fileWriter.truncate(0);
                    
      }).catch(function(error){
        console.log("error creating writer", error)
      });
    });
  }
  

  window._export = self.export;
  return self;
}
File.$inject = ['pouchdb', '$q', 'model', 'settings', 'Users', 'Fees', 'Departments', 'Subjects', 'Groups', 'Students', 'Payments', 'Data2', 'SchoolInfos'];
angular.module('SchoolMan').service('File', File);