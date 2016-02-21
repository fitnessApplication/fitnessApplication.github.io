/**
 * Created by mkralik on 2/21/16.
 */
var testFactory = new TestFunction();


/**
 * Class for test function
 * @constructor
 */
function TestFunction(){
    this.nextMealId = function(){
        document.getElementById("nextFreeIdMeal").innerHTML = managerM.nextMealId();
    };
    this.nextExerciseId = function(){
        document.getElementById("nextFreeIdExercise").innerHTML = managerE.nextExerciseId();
    };
    this.isMealIdInDB = function(form){
        var id = form[0].value;
        document.getElementById("freeIdMeal").innerHTML = managerM.isIdInDB(id);
    };
    this.isExerciseIdInDB = function(form){
        var id = form[0].value;
        document.getElementById("freeIdExercise").innerHTML = managerE.isIdInDB(id);
    };
    this.deleteMeal = function(form){
        var id = form[0].value;
        managerM.deleteMealByID(id);
        refreshShowDB();
    };
    this.deleteExercise = function(form){
        var id = form[0].value;
        managerE.deleteExerciseByID(id);
        refreshShowDB();
    };
}