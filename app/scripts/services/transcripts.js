'use strict';

function Transcripts($q, model, modelTransformer, pouchdb, Subjects, Students, SchoolInfos) {

  	var db = model.Transcript.db;
    if(typeof db === "string"){
      db = pouchdb.create(model.Transcript.db);
    }

  	var _transcripts = {};
    var subjects = Subjects.getAll();

  	self = {};

  	var dataModel = model.Transcript;

    self.get = function(studentId, cycleIndex){
      var deferred = $q.defer();
      var transcriptId = "transcript_" + studentId + ":" + cycleIndex;
      var student;

      Students.get(studentId).then(function(success){
        student = success;

        db.get(transcriptId).then(function(data){
          var spec = model.parse2(data, data.datatype);
          var transcript = new model.Transcript(spec);

          angular.forEach(subjects, function(subject, subjectId){
            if(!(transcript.table.hasOwnProperty(subjectId))){
              if(cycleIndex === 0 && info.version !== "gths"){
                transcript.table[subjectId]=["","","","","","","","","","","","","","",""];
              }else if(cycleIndex === 0 && info.version === "gths"){
                transcript.table[subjectId]=["","","","","","","","","","","","",];
              }else if(cycleIndex === 1 && info.version !== "gths"){
                transcript.table[subjectId]=["","","","","",""];
              }else {
                transcript.table[subjectId]=["","","","","","","","",""];
              }
            }
          });

          deferred.resolve(transcript);
        }).catch(function(error){
          if(error.status === 404){
            var transcript = new model.Transcript({studentId:studentId, cycleIndex:cycleIndex});
            SchoolInfos.get("schoolinfo").then(function(info){
              angular.forEach(subjects, function(subject, subjectId){
                if(cycleIndex === 0 && info.version !== "gths"){
                  transcript.table[subjectId]=["","","","","","","","","","","","","","",""];
                }else if(cycleIndex === 0 && info.version === "gths"){
                  transcript.table[subjectId]=["","","","","","","","","","","","",];
                }else if(cycleIndex === 1 && info.version !== "gths"){
                  transcript.table[subjectId]=["","","","","",""];
                }else {
                  transcript.table[subjectId]=["","","","","","","","",""];
                }
              })

              transcript.save().then(function(success){
                deferred.resolve(transcript);
              }).catch(function(error){
                deferred.reject(error);
              })
            });
          } else{
            deferred.reject(error);
          }
        });
      }).catch(function(error){
        console.log("Failed to retreive student", error);
      });
      return deferred.promise;
    };

    self.destroy = function(){
    	db.destroy().then(function(success){
    		console.log("Destroyed transcripts db");
    	}).catch(function(error){
    		console.log("failed to destroy transcripts db", error)
    	});
    }

    return self;
  }
  Transcripts.$inject = ['$q', 'model', 'modelTransformer', 'pouchdb', 'Subjects', 'Students', 'SchoolInfos'];
  angular.module('SchoolMan').service('Transcripts', Transcripts);
