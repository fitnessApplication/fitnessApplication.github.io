window.addEventListener(
    "load",
    function() {
        var elt = document.querySelector(".principal > div.pagebody[aria-expanded=true]");
        if (elt) {
            var toolbarId = elt.getAttribute("aria-owns");
            if (toolbarId) showToolbar(toolbarId);
        }
        registerButton();
//        loading();
    }
);

function registerButton(){
    document.getElementById('backSettings').onclick = function() {deleteShowTable('homeBoard');revealPage('homePage');showHomepage();};
    document.getElementById('backEditMeal').onclick = function() {revealPage(previousPages.pop())};
    document.getElementById('backMealsToAdd').onclick = function() {revealPage(previousPages.pop())};
    document.getElementById('backEditExercise').onclick = function() {revealPage(previousPages.pop())};
    document.getElementById('backExercisesToAdd').onclick = function() {revealPage(previousPages.pop())};
    document.getElementById('backNewMealToGlobalPage').onclick = function() {document.getElementById('addNewMealToGlobalForm').reset();revealPage(previousPages.pop())};
    document.getElementById('backMealFromGlobalPage').onclick = function() {document.getElementById('addMealFromGlobalForm').reset();revealPage(previousPages.pop())};
    document.getElementById('backNewMealPage').onclick = function() {document.getElementById('addNewMealForm').reset();revealPage(previousPages.pop())};
    document.getElementById('backExercisePage').onclick = function() {document.getElementById('addExerciseForm').reset();revealPage(previousPages.pop())};
    document.getElementById('uploadButton').onclick = function() {document.getElementById('upJsonFile').click();};
    document.getElementById('saveJsonButton').onclick = function() {saveJSON()};
    document.getElementById('deleteLocalButton').onclick = function() {deleteLocal()};
    document.getElementById('calculateButton').onclick = function() {calculateBmi()};
    document.getElementById('homePageMenu').onclick = function() {deleteShowTable('homeBoard');previousPages=[];previousPages.push('homePage');showHomepage()};
    document.getElementById('mealsPageMenu').onclick = function() {deleteShowTable('mealsBoard');previousPages=[];previousPages.push('pageMeals');showGlobalMeals(false);};
    document.getElementById('execisesPageMenu').onclick = function() {deleteShowTable('exercisesBoard');previousPages=[];previousPages.push('pageExercises');showGlobalExercises(false);};
    document.getElementById('daysPageMenu').onclick = function() {deleteShowTable('dayBoard');previousPages=[];previousPages.push('pageDay');showDay();};
    document.getElementById('graphsPageMenu').onclick = function() {showGraph(document.getElementById('graphType'),document.getElementById('graphNumberOfDay'))};
    document.getElementById('upJsonFile').onchange = function() {loadFromFile(this.files)};
    document.getElementById('graphType').onchange = function() {showGraph(this,document.getElementById('graphNumberOfDay'))};
    document.getElementById('graphNumberOfDay').onchange = function() {showGraph(document.getElementById('graphType'),this)};
    document.getElementById('heightTitle').onchange = function() {refreshHeightPlaceholder()};
    document.getElementById('weightTitle').onchange = function() {refreshWeightPlaceholder()};
}