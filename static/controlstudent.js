angular.module('plunker', ['ui.bootstrap']);
var studentModalCtrl = function ($scope, $modal, $log, $http) {
  $scope.addstudentmodal = function () {
    var addModalInstance = $modal.open({
      templateUrl: 'addModalContent.html',
      controller:'AddStudentCntrl',
      scope:$scope,
      size:'', 
      resolve: {
        
        }
    });

  };
  $scope.update=function(size){
    $http.get("/getstudent/"+size)
   .then(function(response){
    var updateModalInstance = $modal.open({
          templateUrl: 'updateModalContent.html',
          controller: 'UpdateStudentCtrl',
          size: '',
          scope:$scope,
          resolve: {  
            record: function () {
              return response.data; }
          }
      });
   });
   
  };
  $scope.deletRecord = function(id) {
    if(id>0)
    {
      swal("Are you sure you want to delete this?",{
        buttons:{
          cancel:{
            text:"Cancel",
            value:null,
            visible:true,
            className:"",
            closeModal:true,
          },
          confirm:{
            text:"OK",
            value:true,
            visible:true,
            className:"",
            closeModal:true
          }
        },
      }).then((buttonsconfirm) => {
          if (buttonsconfirm) {
            $http.get("/studentdelete/"+id).then(function(response){
                window.location.reload(true);
            });
            
          } 
          else {
            window.location.reload(true);
          }
        });
    }
  };
};

var AddStudentCntrl=function($scope, $modalInstance, $http){

  $scope.validateForm = function () {
    var class_name=$("#class_name").val();
    var is_monitor=$('input:radio[name="is_monitor"]:checked').val();
    var studying_subjects=$("#studying_subjects").val();
    $("#is_monitor1").click(function(){
      $("#is_monitor1").prop("checked", true);
    });
    $("#is_monitor0").click(function(){
      $("#is_monitor0").prop("checked", true);
    });

    if (class_name==""){ 
      swal("class_name can't be blank");
      $("#class_name").focus();
      return false;  
      }
    else if(is_monitor==undefined){
      swal("is_monitor can't be blank");
      $("#is_monitor").focus();  
      return false;  
      }
                
    else if(studying_subjects==""){
      swal("studying_subject can't be blank");
      $("#studying_subjects").focus();
      return false;
      }
    else{ 
      var data = {
        'class_name':class_name,
        'is_monitor': is_monitor,
        'studying_subjects':studying_subjects,
        }
        $http.post("studentinsert", data).then(function(response){
          if (response.data.status_code==200) {
            setTimeout(function() {
                swal({
                        text: response.data.result,
                    }).then(function() {
                window.location.reload(true);
                });
            }, 500);
            }
          else{
            swal(response.data.result);
            }
        });
    }
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var UpdateStudentCtrl = function ($scope, $modalInstance, $http, record) {
  $scope.row = {};
  function init(){
    $scope.row.id=record.id;
    $scope.row.class_name=record.class_name;
    $scope.row.is_monitor=record.is_monitor;
    $scope.row.studying_subjects=record.studying_subjects;
  }
  $scope.updatestudent=function(){
    if(!angular.isDefined($scope.row.class_name) || $scope.row.class_name === '') {
      swal("Class_name can't be blank");
      $("#class_name").focus();
      return false;
    }
    else if(!angular.isDefined($scope.row.is_monitor) || $scope.row.is_monitor === ''){
      swal("Is monitor can't be blank");
      $("#is_monitor").focus();
      return false;
    }
    else if(!angular.isDefined($scope.row.studying_subjects) || $scope.row.studying_subjects === ''){
      swal("Studying Subject can't be blank");
      $("#studying_subjects").focus();
      return false;
    }
    $scope.validateFormupdate($scope.row);
  }
  $scope.validateFormupdate=function(){
    var data = {
      'id':$scope.row.id,
      'class_name':$scope.row.class_name,
      'is_monitor': $scope.row.is_monitor,
      'studying_subjects':$scope.row.studying_subjects,
    }
    $http.post("studentupdate", data).then(function(response){
      if (response.data.status_code==200) {
        setTimeout(function() {
                swal({
                        text: response.data.result,
                    }).then(function() {
                window.location.reload(true);
                });
            }, 500);
      }
      else{
        swal(response.data.result);
      }
    });
  };
init();
$scope.cancel = function () {
    $modalInstance.dismiss('cancel');
};
};

  