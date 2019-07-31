angular.module('plunker', ['ui.bootstrap']);
var userModalCtrl = function ($scope, $modal, $log, $http) {
  $scope.addusermodal = function () {
    var addModalInstance = $modal.open({
      templateUrl: 'addModalContent.html',
      controller:'AddUserCntrl',
      scope:$scope,
      size:'', 
      resolve: {
        
        }
    });

  };
  $scope.update=function(size){

    $http.get("/getuser/"+size)
   .then(function(response){
    var updateModalInstance = $modal.open({
          templateUrl: 'updateModalContent.html',
          controller: 'UpdateUserCtrl',
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
            $http.get("/userdelete/"+id).then(function(response){
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

var AddUserCntrl=function($scope, $modalInstance, $http){

  $scope.validateForm = function () {
    var fname=$("#first_name").val();
    var lname=$("#last_name").val();
    var email=$("#email").val();
    var phone=$("#phone").val();
    var about=$("#about").val();
    if (fname==null || fname==""){
      swal("FirstName can't be blank");
      $("#first_name").focus();
      return false;  
      }
    else if(lname==null || lname==""){
      swal("LastName can't be blank");  
      $("#last_name").focus();
      return false;  
      }
    else if(email==null||email==""){
      swal("Email Address can't be blank");
      $("#email").focus();
      return false;
      }
    else if(phone==null||phone==""){
      swal("Mobile number can't be blank");  
      $("#phone").focus();
      return false;
      }
    else if(isNaN(phone)){
      swal("Enter valid Mobile number");  
      $("#phone").focus();
      return false;
      }
    else if(phone.length<10){
      swal("Enter valid Mobile number");  
      $("#phone").focus();
      return false;
      }
    else{
      var data = {
        'first_name':fname,
        'last_name': lname,
        'email':email,
        'phone':phone,
        'about':about,
        }
        $http.post("userinsert", data).then(function(response){
          if (response.data.status_code==200) {
            setTimeout(function() {
                swal({
                        text: response.data.result,
                    }).then(function() {
                window.location.reload(true);
                });
            }, 50);
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

var UpdateUserCtrl = function ($scope, $modalInstance, $http, record) {
$scope.row = {};
function init(){
    $scope.row.id=record.id;
    $scope.row.fname=record.fname;
    $scope.row.lname=record.lname;
    $scope.row.email=record.email;
    $scope.row.phone=record.phone;
    $scope.row.about=record.about;
    
}
$scope.updateuser=function(){
      if(!angular.isDefined($scope.row.fname) || $scope.row.fname === '') {
                swal("FirstName can't be blank");
                $("#first_name").focus();
                return false;
        }
      else if(!angular.isDefined($scope.row.lname) || $scope.row.lname === ''){
                swal("LastName can't be blank");
                $("#last_name").focus();
                return false;
        }
      else if(!angular.isDefined($scope.row.email) || $scope.row.email === ''){
                swal("Email can't be blank");
                $("#email").focus();
                return false;
        }
      else if(!angular.isDefined($scope.row.phone) || $scope.row.phone === ''){
                swal("Mobile number can't be blank");
                $("#phone").focus();
                return false;
        }
        $scope.validateFormupdate($scope.row);
}

  $scope.validateFormupdate=function(){

  var data = {
    'id':$scope.row.id,
    'first_name':$scope.row.fname,
    'last_name': $scope.row.lname,
    'email':$scope.row.email,
    'phone':$scope.row.phone,
    'about':$scope.row.about,
                                       
                    }
                    
  $http.post("userupdate", data).then(function(response){
    if (response.data.status_code==200) {
      setTimeout(function() {
                swal({
                        text: response.data.result,
                    }).then(function() {
                window.location.reload(true);
                });
            }, 50);
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

  