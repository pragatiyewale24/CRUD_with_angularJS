angular.module('plunker', ['ui.bootstrap']);
var teacherModalCtrl = function ($scope, $modal, $log, $http) {
  $scope.addteachermodal = function () {
    var addModalInstance = $modal.open({
      templateUrl: 'addModalContent.html',
      controller:'AddTeacherCntrl',
      scope:$scope,
      size:'', 
      resolve: {
        
        }
    });

  };
  $scope.update=function(size){
    $http.get("/getteacher/"+size)
   .then(function(response){
    var updateModalInstance = $modal.open({
          templateUrl: 'updateModalContent.html',
          controller: 'UpdateTeacherCtrl',
          size: '',
          scope:$scope,
          resolve: {  
            record: function () {
              return response.data;
                }
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
            $http.get("/teacherdelete/"+id).then(function(response){
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

var AddTeacherCntrl=function($scope, $modalInstance, $http){

  $scope.validateForm = function () {
    var department_name=$("#department_name").val();
    var is_hod=$('input:radio[name="is_hod"]:checked').val();
    var teaching_subject=$("#teaching_subject").val();

    $("#is_hod1").click(function(){
      $("#is_hod1").prop("checked", true);
    });
    $("#is_hod0").click(function(){
      $("#is_hod0").prop("checked", true);
    });

    if (department_name==""){ 
      swal("department_name can't be blank");
      $("#department_name").focus();
      return false;  
      }
    else if(is_hod==undefined){
      swal("is_hod can't be blank");  
      $("#is_hod").focus();
      return false;  
      }
                
    else if(teaching_subject==""){
      swal("teaching_subject can't be blank");
      $("#teaching_subject").focus();
      return false;
      }
    else{ 
      var data = {
        'department_name':department_name,
        'is_hod': is_hod,
        'teaching_subject':teaching_subject,
        }
        $http.post("teacherinsert", data).then(function(response){
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

var UpdateTeacherCtrl = function ($scope, $modalInstance, $http, record) {
  $scope.row = {};
  function init(){
    $scope.row.id=record.id;
    $scope.row.department_name=record.department_name;
    $scope.row.is_hod=record.is_hod;
    $scope.row.teaching_subject=record.teaching_subject;
  }
  $scope.updateteacher=function(){
    if(!angular.isDefined($scope.row.department_name) || $scope.row.department_name === '') {
      swal("department_name can't be blank");
      $("#department_name").focus();
      return false;
    }
    else if(!angular.isDefined($scope.row.is_hod) || $scope.row.is_hod === ''){
      swal("is_hod can't be blank");
      $("#is_hod").focus();
      return false;
    }
    else if(!angular.isDefined($scope.row.teaching_subject) || $scope.row.teaching_subject === ''){
      swal("teaching_subject can't be blank");
      $("#teaching_subject").focus();
      return false;
    }
    $scope.validateFormupdate($scope.row);
  }
  $scope.validateFormupdate=function(){
    var data = {
      'id':$scope.row.id,
      'department_name':$scope.row.department_name,
      'is_hod': $scope.row.is_hod,
      'teaching_subject':$scope.row.teaching_subject,
    }
    $http.post("teacherupdate", data).then(function(response){
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

  