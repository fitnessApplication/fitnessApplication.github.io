/**
 * Created by mkralik on 2/13/16.
 */

function loadDB(file){  //TODO temp function
    if (storageAvailable('localStorage')) {
        if(localStorage.getItem('isInLocal')){
            if(loadLocal()){
                document.getElementById("loadButton").disabled=true;
                document.getElementById("input").disabled=true;
            }
        }else if(file != null){
            loadJSONasFile(file);
            document.getElementById("loadButton").disabled=true;
            document.getElementById("input").disabled=true;
        }
        else{ //first start
            alert("local storage is empty, please load backup json file or start new story")
        }
        showAllDB();
    }else {
        alert("local storage is not supported, please update your browser."); //TODO
    }
}
/**
 * load DB from upload file, next time data will be on the local storage
 * @param jsonFiles
 */
function loadJSONasFile(jsonFiles){
    var reader = new FileReader();
    reader.onload = function(event) {
        var tempArr = JSON.parse(event.target.result);
        var saveJSON = {
            meals : tempArr['meals'],
            exercises : tempArr['exercises'],
            days : tempArr['days']
        };
        var data = JSON.stringify(saveJSON);
        localStorage.setItem('jsonData',data);
        var days = tempArr['daysContent'];
        var currentDate= null;
        for(var i= 0;i<days.length;i++){
            currentDate=days[i]['date'];
            saveJSON={
                date : currentDate,
                dayMeals : days[i]['dayMeals'],
                dayExercises : days[i]['dayExercises']
            };
            data = JSON.stringify(saveJSON);
            localStorage.setItem(currentDate,data);
        }
        localStorage.setItem('isInLocal',true);
        loadLocal();
        console.log("db was add from JSON file to local storage and loaded");
        refreshShowDB();
    };
    reader.readAsText(jsonFiles[0]);
}
/**
 * Load from local storage
 */
function loadLocal(){
    var data = localStorage.getItem('jsonData');
    var tempArr = JSON.parse(data);
    if(!parseJSONtoLocal(tempArr)){
        throw "DB unsuccessfully loaded from local DB";
    }
    if(globalMealsManager.isEmpty() && globalMealsManager.isEmpty() && globalDaysManager.isEmpty()){ //DB in local storage was been empty
        throw "DB in the local storage is empty!";
    }
    console.log("DB was successful loaded from local storage");
    return true;
}

/**
 * Save DB(changed) to local storage
 */
function saveLocal(){
    var saveJSON = {
        meals : globalMealsManager.getAllMeals(),
        exercises : globalExercisesManager.getAllExercises(),
        days : globalDaysManager.getAllDays()
    };
    var data = JSON.stringify(saveJSON);   //TODO save as only one a JSON type or each of them as a separated JSON type (meals,exercises,days)?
    localStorage.setItem('jsonData',data);
    var days = globalDaysManager.getAllDays();
    var         currentDate= null;
    for(var i= 0;i<days.length;i++){
        currentDate=days[i].date.toDateString();
        saveJSON={
            date : currentDate,
            dayMeals : days[i].mealsManager.getAllMeals(),
            dayExercises : days[i].exercisesManager.getAllExercises()
        };
        data = JSON.stringify(saveJSON);
        localStorage.setItem(currentDate,data);
    }
    localStorage.setItem('isInLocal',true);
    console.log("DB was saved");
}
/**
 * Export DB to JSON file
 */
function saveJSON(){ //TODO download file, right way ?
    var saveJSON = {
        meals : globalMealsManager.getAllMeals(),
        exercises : globalExercisesManager.getAllExercises(),
        days : globalDaysManager.getAllDays(),
        daysContent : []
    };
    var days = globalDaysManager.getAllDays();
    var currentDate,day= null;
    for(var i= 0;i<days.length;i++){
        currentDate=days[i].date.toDateString();
        day={
            date : currentDate,
            dayMeals : days[i].mealsManager.getAllMeals(),
            dayExercises : days[i].exercisesManager.getAllExercises()
        };
        saveJSON.daysContent.push(day);
    }
    var data = 'data:text/json;charser=utf8,'+ encodeURIComponent(JSON.stringify(saveJSON));
    var a = document.createElement('a');
    a.href = data;
    a.download = 'data.json';
    document.getElementById("downloadVisible").appendChild(a);
    a.click();
}

/**
 * delete DB in the local storage
 */
function deleteLocal(){
    if (confirm("Delete local storage! Make sure that you download DB!") == true) {
        alert("Local storage was deleted. App will be reload");
        localStorage.clear();
        console.log("Local storage was been deleted");
        location.reload();
    }
}

/**
 * Parsing JSON to the local objects
 * @param tempArr - parse JSON
 * @returns {boolean}
 */
function parseJSONtoLocal(tempArr){
    if(tempArr == null){
        return false;
    }
    for(var i=0;i<tempArr["meals"].length;i++){ //load meals
        globalMealsManager.addMeal(new Meal(
            tempArr["meals"][i].name,
            tempArr["meals"][i].protein,
            tempArr["meals"][i].carbohydrate,
            tempArr["meals"][i].fat,
            tempArr["meals"][i].kcal,
            tempArr["meals"][i].method
        ));
    }
    for(i=0;i<tempArr["exercises"].length;i++){ //load exercises
        globalExercisesManager.addExercise(new Exercise(
            tempArr["exercises"][i].name,
            tempArr["exercises"][i].kcal));
    }
    var saveDay,storageDay,dayManagers,dayDate = null;
    var specificDay = []; // helpful variable
    for(i=0;i<tempArr["days"].length;i++){  //load days with days and exercises
        specificDay = tempArr["days"][i];
        dayDate = new Date(specificDay['date']);
        storageDay = localStorage.getItem(dayDate.toDateString());
        dayManagers= JSON.parse(storageDay);
        saveDay = new Day(dayDate);
        //todo add managers data
        for(var j=0;j<dayManagers['dayMeals'].length;j++){ //add all meals to day
            saveDay.mealsManager.addMeal(new Meal(
                dayManagers["dayMeals"][j].name,
                dayManagers["dayMeals"][j].protein,
                dayManagers["dayMeals"][j].carbohydrate,
                dayManagers["dayMeals"][j].fat,
                dayManagers["dayMeals"][j].kcal,
                dayManagers["dayMeals"][j].method
            ));
        }
        for(j=0;j<dayManagers['dayExercises'].length;j++){ //add all exercises to day
            saveDay.exercisesManager.addExercise(new Exercise(
                dayManagers["dayExercises"][j].name,
                dayManagers["dayExercises"][j].kcal));
        }
        globalDaysManager.addDay(saveDay);
    }
    return true;
}

/**
 * test if web browser supported local storage
 */
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

/**
 * Test how many items will fit into the local storage
 * (don't forget to delete the database after test!)
 */
function storageTest(){
    var data = null;
    var count = 0;
    while(true) {
        try {
            data = new Meal(100,"meso tesco classic",100,100,100,1000);
            localStorage.setItem('TEST'+count,data);
            count++;
        } catch (e) {
            alert("Plna pamet! Pocet zaznamov: " +count+"\n " +
                "(meal(100,\"meso tesco classic\",100,100,100,1000)) \n" +
                "pocet dni v DB pri 100 miestnej databaze cvikov a jedal s priemerom 15 jedal na den: " + ((count/15) - 100) + " dni.");
            break;
        }
    }
    if (confirm("Clear storage?") == true) {
        localStorage.clear();
    }
}

/**
 * add value to current date
 * @param form
 */
function addDB(form){
    if(form["addToDB"].checked){ //save to db
        if(form.name=="addMeal"){
            addToDB("meal",form);
        }else{
            addToDB("exercise",form);
        }
    }
    if(form["addToDay"].checked){ //save to date
        if(form.name=="addMeal"){
            addToDay("meal",form);
        }else{
            addToDay("exercise",form);
        }
    }
    form.reset();
}

/**
 * add value to DB with form
 * @param mode - type of value
 * @param form - form from html
 */
function addToDB(mode,form){
    if(mode=="meal"){
        globalMealsManager.addMeal(new Meal(
            form[0].value,
            form[1].value,
            form[2].value,
            form[3].value,
            form[4].value
        ));
    }else if(mode=="exercise"){
        globalExercisesManager.addExercise(new Exercise(
            form[0].value,
            form[1].value
        ));
    }
    refreshShowDB();
    saveLocal();
}

/** TODO
 * add new meal or exercise to the new or exist day
 * @param mode - type of value
 * @param form - form from html
 */
function addToDay(mode,form){
    //TODO if current date or setted day
    var dateElement=document.getElementById("setDate");
    var date=dateElement.value;
    if(date==""){
        alert("Set date!");
        return;
    }
    var tmp = new Date(date);
    //TODO get day by date , if it not exist create new
    var newDay = new Day(tmp);
    if(mode=="meal"){
        newDay.addMeal(new Meal(
            form[0].value,
            form[1].value,
            form[2].value,
            form[3].value,
            form[4].value,
            form[5].value
        ));
    }else if(mode=="exercise"){
        newDay.addExercise(new Exercise(
            form[0].value,
            form[1].value,
            form[2].value
        ));
    }
    days.push(newDay);
    refreshShowDB();
    saveLocal();
}
