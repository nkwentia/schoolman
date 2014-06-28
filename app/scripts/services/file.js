'use strict';

angular.module('SchoolMan')
  .service('File', function File(pouchdb, $q, settings, model, Users, Fees, Departments, Subjects, Groups, Students) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var self = {};
    

    self.import = function(){
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
              $q.when(saveToDB(data)).then(function(success){
                reloadData();
              });
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
      var reloadData = function() {

        var settingsP = settings.load();
        var userP = Users.load();
        var feesP = Fees.load();
        var deptP = Departments.load();
        var subjP = Subjects.load();
        var groupP= Groups.load();
        var studentsP= Students.load();

        // Initialize/Register ClassCouncil datatype
        var instClassCouncil = new model.ClassCouncil();

        var promises = [settingsP, deptP, groupP, subjP, feesP, userP, studentsP];

        $q.all(promises).then(function(success){
          console.log("Successes", success);
          deferred.resolve();
        });
      }
      
      return deferred.promise;
    }
    var saveToDB = function(data){
      var deferred = $q.defer();
      var dbs = [{name:"gen", list:[], db:pouchdb.create('gths')},
                  {name:"students", list:[], db:pouchdb.create('db_students'), datatype:"datatype/student/v1"},
                  {name:"payments", list:[], db:pouchdb.create('db_payments'), datatype:"datatype/payment/v1"}]
      
      angular.forEach(data, function(item, itemKey){
        if(item.doc.datatype === dbs[1].datatype){
          dbs[1].list.push(item.doc);
        }
        else if(item.doc.datatype === dbs[2].datatype){
          dbs[2].list.push(item.doc);
        }
        else {
          dbs[0].list.push(item.doc);
        }
      });
      
      /*angular.forEach(dbs, function(dbItem, key){
        dbItem.db.bulkDocs({docs: dbItem.list}).then(function(success){
          //dbItem.db.allDocs({include_docs:true}).then(function(success){
          //  console.log(dbItem.name, " all docs:", success);
          //}, function(error){
          //  console.log("error getting docs", dbItem.name, error);
          //});
          console.log(dbItem.name, "imported");
        }).catch(function(error){
          console.log("Error saving to Import DB:", error);
        });
      });*/
      dbs[0].db.bulkDocs({docs: dbs[0].list}).then(function(success){
        console.log(dbs[0].name, "imported");
        dbs[1].db.bulkDocs({docs: dbs[1].list}).then(function(success){
          console.log(dbs[1].name, "imported");
          dbs[2].db.bulkDocs({docs: dbs[2].list}).then(function(success){
            console.log(dbs[2].name, "imported");
            deferred.resolve();
          });
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
        {getDB:function(){return 'db_payments'}}
      ]

      angular.forEach(services, function(service){
      	//Collect all the databases
      	var db = service.getDB();
      	if(dbs.indexOf(db) === -1){
      		dbs.push(db);
      	}
      });

      var merge = function(dbs){
        pouchdb.create(dbs[0]).allDocs({include_docs:true}).then(function(success){
          data = data.concat(success.rows);
          if(dbs.length === 1){
            console.log("Merge successful:", data);
            writeData(JSON.stringify(data));
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
    

    window._export = self.export;
    return self;
  });
