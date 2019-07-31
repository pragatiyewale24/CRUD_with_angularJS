angular.module('plunker', ['ui.bootstrap']);
var adminModalCtrl = function ($scope, $modal, $log, $http) {
  $scope.login = function () {
    var uname=$scope.username_login;          
    var password1 =$scope.password1_login;
    if (uname==null || uname==""){ 
      swal("Username should not be empty."); 
      $("#username_login").focus();
      return false;  
    }
    if (password1==null || password1==""){ 
      swal("Password should not be empty."); 
      $("#password1_login").focus();
      return false;  
    }
    var data = {  
      'username':uname,
      'password1':password1,
    }
    $http.post("adminlogin", data).then(function(response){
      if (response.data.status_code==200) {
        window.location="userswitch"
      }
      else{
        swal(response.data.result);
      }
    });

  };
  $scope.register=function(){
    var addModalInstance = $modal.open({
      templateUrl: 'addModalContent.html',
      controller:'AddAdminCntrl',
      scope:$scope,
      size:'', 
      resolve: {
        
        }
    });
  };
};

var AddAdminCntrl=function($scope, $modalInstance, $http){

  $scope.validateForm = function () {
    var uname=$("#username").val();          
    var password1 =$("#password1").val();
    var confirm_pass=$("#confirm_pass").val();
    if (uname==null || uname==""){ 
      swal("Username should not be empty."); 
      $("#username").focus();
      return false;  
    }
    if (password1==null || password1==""){ 
      swal("Password should not be empty."); 
      $("#password1").focus();
      return false;  
    }
    else if(password1.length<"8"){
      swal("Password should minimum 8 digit or more");
      $("#password1").focus();
      return false;
    }
    else if (password1 != confirm_pass) { 
      swal ("Password did not match: Please try again...");
      $("#confirm_pass").focus(); 
      return false; 
    } 
    else{
     var data={
       'username':uname,
       'password1':password1,
      }
      $http.post("admininsert", data).then(function(response){
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



