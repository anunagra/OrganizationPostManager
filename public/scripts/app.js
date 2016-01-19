var globalModule = angular.module("globalModule" , ['ui.router', 'ngDragDrop' , 'adminModule']);
var adminModule = angular.module("adminModule" ,['ui.router', 'ngDragDrop']);

globalModule.config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state('main' , {
        url: '/main',
        controller:"globalController",
        template : "<ui-view><!-- Keep this --></ui-view>"
    }).state('register', {
        url: '/register',
        controller: "registerUserCtrl",
        templateUrl: 'views/global/partial-register.html',
        parent: 'main'
    }).state('edituser', {
        url: '/editUser',
        controller:"adminController",
        templateUrl: 'views/global/partial-edituser.html',
        parent: 'main'
    }).state('signin', {
        url: '/signin',
        controller: "registerUserCtrl",
        templateUrl: 'views/global/partial-signin.html',
        parent: 'main'
    }).state('adminHome', {
        url: '/adminHome',
        templateUrl: 'views/admin/partial-adminHome.html',
        controller: 'adminController',
        parent: 'main'
    }).state('organize', {
        url: '/organize',
        templateUrl: 'views/admin/partial-organize.html',
        controller: 'adminController',
        parent: 'main'
    }).state('newsfeed', {
        url: '/newsfeed',
        templateUrl: 'views/admin/partial-newsfeed.html',
        controller: 'commentsController',
        parent: 'main'
    }).state('events', {
        url: '/events',
        templateUrl: 'views/admin/partial-events.html',
        controller: 'adminController',
        parent: 'main'
    }).state('stuHome', {
        url: '/stuHome',
        templateUrl: 'views/admin/partial-stuHome.html'
    }).state('instHome', {
        url: '/instHome',
        templateUrl: 'views/admin/partial-instHome.html'
    });   
        
    $urlRouterProvider.otherwise('main');
});

globalModule.controller("globalController" , [ '$rootScope' ,"$scope" , "$state" , function ( $rootScope, $scope , $state) {
     $rootScope.showRegisterModal = false ;
     $rootScope.showSignInModal = false ;
    
     if(localStorage.getItem("userLoggedIn") !== undefined && localStorage.getItem("userLoggedIn") !== null){
         $rootScope.userLoggedIn = localStorage.getItem("userLoggedIn");
         $rootScope.username = localStorage.getItem("username");
         $rootScope.type = localStorage.getItem("type");
     }else {
          $rootScope.userLoggedIn = "false" ;
     }
    
    $('.nav-justified li').click(function (e) {
      $(".nav-justified li").removeAttr("class");
      $(this).attr("class" , "active");
    });
    
}]);

globalModule.directive('header', function () {
    return {
      templateUrl: 'views/global/global-header.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      controller : "registerUserCtrl",
      link: function postLink(scope, element, attrs) {
         
      }
    };
});

globalModule.directive('footer', function () {
    return {
      templateUrl: 'views/global/global-footer.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      link: function postLink(scope, element, attrs) {
      }
    };
});

globalModule.directive('modal', function () {
    return {
      template: '<div class="modal fade in">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content"  ng-transclude>' +               
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
        scope.close =attrs.visible;
          
        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
            scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
            scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
          
         scope.toggleModal = function(){
            $rootScope.showRegisterModal = !$rootScope.showRegisterModal;
         };
          
        scope.toggleSignInModal = function(){
            $rootScope.showSignInModal = !$rootScope.showSignInModal;
        };
         
      }
    };
  });




globalModule.controller("registerUserCtrl" , [ "$rootScope" ,"$scope" ,"$http", "$state" , function ($rootScope , $scope , $http , $state) {
     
    $scope.signOut = function(){         
         localStorage.removeItem("userLoggedIn");
         localStorage.removeItem("username");
         localStorage.removeItem("type");
         $rootScope.userLoggedIn = "false" ;
         $state.go("main");
     };
    
    $scope.toggleModal = function(){
        $rootScope.showRegisterModal = !$rootScope.showRegisterModal;
        $state.go("organize");
    };
   
    $scope.toggleSignInModal = function(){
        $rootScope.showSignInModal = !$rootScope.showSignInModal;
        $state.go("organize");
    };
    
    
    $scope.user = {};
    // calling our submit function.
    $scope.submitForm = function() {
    $http({
      method  : 'POST',
      url     : 'api/v1/user',
      data    : "username="+$scope.user.email +"&password="+ $scope.user.password +"&firstname="+$scope.user.firstname + "&lastname="+$scope.user.lastname +"&role="+$scope.user.role,       //forms user object
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     }).success(function(data) {
        if (data.error) {
          $scope.error = data.error;
        } else {
          if(data.success){
             console.log("created user with username:"+ data.success.dbObj.username +" ,role: "+data.success.dbObj.role);
             $rootScope.userLoggedIn = "true" ; 
             localStorage.setItem("userLoggedIn" , "true");
             $rootScope.username = data.success.dbObj.username;
             localStorage.setItem("username" , data.success.dbObj.username);
             $rootScope.type = data.success.userObj.type;
             localStorage.setItem("type" , data.success.userObj.type);
             $rootScope.showRegisterModal = !$rootScope.showRegisterModal;
             $(".modal-backdrop").remove();
             $("body").removeClass("modal-open");
             $state.go("organize");
          }
        }
      });
    };
    
     $scope.submitSignInForm = function() {
        $http({
          method  : 'POST',
          url     : 'api/v1/userdata',
          data    : "username="+$scope.user.email +"&password="+ $scope.user.password,       //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         }).success(function(data) {
            if (data.error) {
              $scope.error = data.error;
            } else {
              if(data.success){
                 console.log("retrieved user with username:"+ data.success.userObj.userName);
                 $rootScope.showSignInModal = !$rootScope.showSignInModal; 
                 $rootScope.userLoggedIn = "true" ; 
                 localStorage.setItem("userLoggedIn" , "true");
                 $rootScope.username = data.success.userObj.userName;
                 localStorage.setItem("username" , data.success.userObj.userName);
                 $rootScope.type = data.success.userObj.type;
                 localStorage.setItem("type" , data.success.userObj.type);
                 $(".modal-backdrop").remove();
                  $("body").removeClass("modal-open");
                 $state.go("organize");
              }else if(data.failure){
                console.log("database result:"+ data.failure.code);
                $scope.error = data.failure.code;
              }
            }
          });
        };
    
     $scope.clearForm = function() {
         $rootScope.showRegisterModal = !$rootScope.showRegisterModal; 
         $(".modal-backdrop").remove();
         $("body").removeClass("modal-open");
         $state.go("main");
     };
    
    $scope.clearSignInForm = function() {
        $rootScope.showSignInModal = !$rootScope.showSignInModal;
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $state.go("main");
     };
 }]);


globalModule.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

adminModule.controller("commentsController" , [ '$rootScope' ,"$scope" ,"$http", "$state" , 'socket' , function ( $rootScope, $scope , $http , $state , socket) {
   $scope.messages = [];
  
     $http({
          method  : 'POST',
          url : 'api/v1/comments'
        }).success(function(data) {
            $scope.messages = data.success.commentsObj;
        });


    socket.on('message-sent', function (message) {
        $scope.messages.push(message);
    });
    
    socket.on('message-deleted' ,function(){
      console.log("reload list");
        $http({
          method  : 'POST',
          url : 'api/v1/comments'
        }).success(function(data) {
            $scope.messages = data.success.commentsObj;
        });

    });
    
    $scope.deletePost = function(id){
        socket.emit('delete:message', {
          message_id: id
        });
    }
    
    $scope.sendMessage = function () {
        socket.emit('send:message', {
          message: $scope.message,
          username : $scope.username,
          type : $scope.type
        });
        $scope.message = '';
  };     
}]);


/*Starting of sub module */

adminModule.controller("adminController" , [ '$rootScope' ,"$scope" ,"$http", "$state" , function ( $rootScope, $scope , $http , $state) {
    $scope.createGroupPane = false;
    $scope.users = [];
    $scope.groupMembers =[];
    $scope.groups = [];
    
    $scope.group = { };
    $scope.group.name = "";
   /*Get  users from database*/ 
    $http({
      method  : 'GET',
      url : 'api/v1/users'
    }).success(function(data) {
        $scope.users = data.success.usersObj;
    });
     /*Get  groups  from database*/ 
     $http({
      method  : 'POST',
      url : 'api/v1/groups'
    }).success(function(data) {
        $scope.groups = data.success.groupsObj;
    });
    
    $scope.editUser = function(username){
        $http({
              method  : 'GET',
              url     : 'api/v1/user/'+username             
             }).success(function(data) {
                if (data.error) {
                  $scope.error = data.error;
                } else {
                  if(data.success){
                    $rootScope.showRegisterModal = !$rootScope.showRegisterModal;
                    $scope.user = data.success.usersObj;
                    $state.go("edituser");
                  }
                }
              });
    };
    
    $scope.deleteUser = function(username) {
        $http({
              method  : 'DELETE',
              url     : 'api/v1/user/'+username             
             }).success(function(data) {
                if (data.error) {
                  $scope.error = data.error;
                } else {
                  if(data.success){                    
                    $state.go("organize" ,null ,{reload: true, notify:true});
                  }
                }
              });
    };
    
    $scope.deleteGroup = function(groupName) {
        $http({
              method  : 'DELETE',
              url     : 'api/v1/group/'+groupName             
             }).success(function(data) {
                if (data.error) {
                  $scope.error = data.error;
                } else {
                  if(data.success){                    
                    $state.go("organize" ,null ,{reload: true, notify:true});
                  }
                }
              });
    };
    
    $scope.addGroup = function(){
        $http({
          method  : 'POST',
          url     : 'api/v1/group',
          data    : "groupName=" + $scope.group.name +"&groupMembers="+ JSON.stringify($scope.groupMembers)+"&groupAdmin="+$rootScope.username ,       //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}            
         }).success(function(data) {
            if (data.error) {
              $scope.error = data.error;
            } else {
              if(data.success){                    
                 $state.go("organize" ,null ,{reload: true, notify:true});
              }
            }
          });
    };
    
    $scope.removeUser = function(index){
        $scope.groupMembers.pop(index);
    };
    
    $scope.defaultState = function(){
        $scope.createGroupPane = !$scope.createGroupPane;
    };
    
    $scope.toggleCreateGroupPane = function(){
         $scope.createGroupPane = !$scope.createGroupPane;
    };
    
}]);



