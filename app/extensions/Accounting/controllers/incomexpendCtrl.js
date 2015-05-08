'use strict';

function IncomexpendCtrl($scope, $routeParams, model, Location, Items,  Lang) {

    $scope.showValidaton = false;
    $scope.dict = Lang.getDict();
    $scope.balance = 0;
    

    var data = $scope.data = {
        items: {},
        balance: 0
    };

    Items.getAll().then(function(success){
        $scope.data.items = success;    
        angular.forEach($scope.data.items, function(item, itemId){
            $scope.balance += item.income - item.expenditure;
            item.balance = $scope.balance;
        })
    })

    $scope.newItem = new model.Item();
    $scope.newItem.registrar = $routeParams.username;
    console.log("NewItem", $scope.newItem);

    

    $scope.add = function(item){
        typeof item.income === "string" ? item.income = Number(item.income.replace(/[^0-9\.]+/g,"")) : "";
        typeof item.expenditure === "string" ? item.expenditure = Number(item.expenditure.replace(/[^0-9\.]+/g,"")) : "";
        item.save().then(function(success){
            $scope.showValidaton = false;
            $scope.balance += item.income - item.expenditure;
            item.balance = $scope.balance;
            $scope.data.items.push(item);
            $scope.newItem = new model.Item();
            $scope.newItem.registrar = $routeParams.username;
        }).catch(function(error){
            $scope.showValidation = true;
            console.log("Failed to save item: ", error);
        })
    }


}
IncomexpendCtrl.$inject = ['$scope', '$routeParams', 'model', 'Location', 'Items', 'Lang'];
angular.module('SchoolMan.Accounting').controller('IncomexpendCtrl', IncomexpendCtrl);


