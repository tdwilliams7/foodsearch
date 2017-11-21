var myApp = angular.module('myApp',[]);

(function(app){
    app.controller('recipeController',  function($scope, $http){
        let foodTitle = document.getElementById('foodTitle');
        let foodImage = document.getElementById('foodImg1');
        let link = document.getElementById('foodLink');
        let buttonId = document.getElementById('buttonId');
        let title;

        $scope.recipes = [];
            $http({
                method: 'GET',
                url: "https://api.edamam.com/search?q=chicken&app_id=933b24e9&app_key=5ec51a21d4c001a6109da140caf5ecef"
            })
                .then (function(response){
                    var recArr = response.data.hits;
                    angular.forEach(recArr, function(recipeObj){
                        $scope.recipes.push(recipeObj.recipe);
                    });
                },  function(response){
                    console.log('nope');
                });

        $scope.addRecipe = function($event){
            $http.post('/myrecipes', $event.recipe)
                .then( (data) =>{
                    alert('added');
                },  (data) =>{
                    console.log(data);
                });
                $scope.mySavedRecipes();
        };
        ($scope.recipeSearch = function(){
            let start = Math.round((Math.random() * 10 * Math.random() * 10));
            let end = start + 10;
            let protein = document.getElementById('proteinSelect').value;
            let url = "https://api.edamam.com/search?q=" + protein +"&app_id=933b24e9&app_key=5ec51a21d4c001a6109da140caf5ecef&from=" + start + "&to=" + end;
            $scope.recipes = [];

            $http({
                method: 'GET',
                url: url
            })
                .then (function(response){
                    var recArr = response.data.hits;
                    angular.forEach(recArr, function(recipeObj){
                        $scope.recipes.push(recipeObj.recipe);
                    });
                    angular.forEach( function(response){
                        $scope.names.push(response.data.hits.recipe);
                    });
                },  function(response){
                    console.log('nope');
                });
        });
        ($scope.mySavedRecipes = function(){
            $scope.myRecipes = [];
            $http.get('/myrecipes')
                .then(function(response){
                    $scope.myRecipes = response.data;
                }, function(data){
                    console.log(data);
                });
        })();
        ($scope.removeSavedRecipe = ($event) =>{
            var id = $event.recipe._id;

            $http.delete( '/myrecipes/' + id)
                .then(function(data){
                    $scope.myRecipes = data;
                    $scope.mySavedRecipes();
                }),
            function(data){
                console.log(data);
            };
        });


    });
})(myApp);

// (function getRecipes(){
//     $.ajax({
//         url: recipes,
//         dataType: 'jsonp',
//         success: function(data){
//             title = data.hits[0].recipe.label;
//             console.log(title);
//             foodTitle.textContent = title;
//             link.href = data.hits[0].recipe.url;
//             foodImage.src = data.hits[1].recipe.image;
//             buttonId.name = data.hits[1].recipe.uri;
//         }
//     });
// })();

//     $scope.getMyRecipes =function($http){
//         $http.get('/myrecipes')
//             .success(function(data){
//                 foods = (data);
//             })
//             .error(function(data){
//                 console.log(data);
//             });