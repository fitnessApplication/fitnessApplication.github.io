QUnit.test( "add exercise to DB", function( assert ) {
    globalExercisesManager.addExercise(new Exercise("run1",800));
    assert.notOk( globalExercisesManager.isEmpty() , "Add to db was OK!, DB is not empty" );
});
QUnit.test( "add incorrect exercise to DB", function( assert ) {
    var newExercise = new Exercise("run3",700);
    newExercise.name="";
    assert.throws(function() {globalExercisesManager.addExercise(newExercise);},"throws, exercise with incorrect name (empty string)");
    newExercise.name=null;
    assert.throws(function() {globalExercisesManager.addExercise(newExercise);},"throws, exercise with incorrect name (null)");
    newExercise.name="run3";
    newExercise.kcal=0;
    assert.throws(function() {globalExercisesManager.addExercise(newExercise);},"throws, exercise with incorrect kcal (0)");
    newExercise.kcal=-1;
    assert.throws(function() {globalExercisesManager.addExercise(newExercise);},"throws, exercise with incorrect kcal (-1)");
    newExercise.kcal=null;
    assert.throws(function() {globalExercisesManager.addExercise(newExercise);},"throws, exercise with incorrect kcal (null)");
    newExercise.kcal="";
    assert.throws(function() {globalExercisesManager.addExercise(newExercise);},"throws, exercise with incorrect kcal (\"\")");
});
QUnit.test( "next free exercise id", function( assert ) {
    assert.ok( globalExercisesManager.nextExerciseId()==2 , "Next free ID (2) is OK" );
    globalExercisesManager.addExercise(new Exercise("run2",600));
    assert.ok( globalExercisesManager.nextExerciseId()==3 , "Next free ID (3) is OK" );
});
QUnit.test( "is exercise with ID in DB", function( assert ) {
    assert.ok( globalExercisesManager.isIdInDB(1) , "Exercise with ID 1 is in the DB" );
    assert.notOk( globalExercisesManager.isIdInDB(3) , "Exercise with ID 3 is not in the DB" );
});
QUnit.test( "is exercise with ID in DB with incorrect parameter", function( assert ) {
    assert.throws(function() {globalExercisesManager.isIdInDB("");},"throws, isIdInDB with id (\"\")");
    assert.throws(function() {globalExercisesManager.isIdInDB(null);},"throws, isIdInDB with id (null)");
});
QUnit.test( "get all exercises", function( assert ) {
    assert.equal(2,globalExercisesManager.getAllExercises().length,"All exercises are in the returned DB");
});
QUnit.test( "get exercise by id", function( assert ) {
    var originalExercise=new Exercise("run3",900);
    globalExercisesManager.addExercise(originalExercise);
    var exerciseFromDb = globalExercisesManager.getExerciseByID(3);
    originalExercise.id = 3;
    assert.deepEqual(originalExercise, exerciseFromDb , "exercises are equal" );
    originalExercise.kcal=400;
    exerciseFromDb = globalExercisesManager.getExerciseByID(3);
    assert.notDeepEqual(originalExercise, exerciseFromDb , "exercises are not same, change protein not affected value in DB" );
});
QUnit.test( "get exercise by id with incorrect parameter", function( assert ) {
    assert.throws(function() {globalExercisesManager.getExerciseByID(8);},"throws, get exercise with incorect id");
    assert.throws(function() {globalExercisesManager.getExerciseByID("");},"throws, get exercise with incorect id (\"\")");
    assert.throws(function() {globalExercisesManager.getExerciseByID(null);},"throws, get exercise with incorect id (null)");
});
QUnit.test( "update exercise", function( assert ) {
    var updateExercise = globalExercisesManager.getExerciseByID(2);
    updateExercise.name="2run2";
    globalExercisesManager.updateExercise(updateExercise);
    assert.equal(updateExercise.name,globalExercisesManager.getExerciseByID(2).name,"Name was been updated");
    updateExercise.kcal="400";
    globalExercisesManager.updateExercise(updateExercise);
    assert.equal(updateExercise.kcal,globalExercisesManager.getExerciseByID(2).kcal,"Kcal was been updated");
    assert.deepEqual(updateExercise, globalExercisesManager.getExerciseByID(2) , "exercises are equal" );
});
QUnit.test( "update exercise with incorrect parameter", function( assert ) {
    var updateExercise = globalExercisesManager.getExerciseByID(2);
    updateExercise.id="";
    assert.throws(function() {globalExercisesManager.updateExercise(updateExercise);},"throws, exercise with incorrect id (empty string)");
    updateExercise.id=null;
    assert.throws(function() {globalExercisesManager.updateExercise(updateExercise);},"throws, exercise with incorrect id (null)");
    updateExercise.name="";
    assert.throws(function() {globalExercisesManager.updateExercise(updateExercise);},"throws, exercise with incorrect name (empty string)");
    updateExercise.name=null;
    assert.throws(function() {globalExercisesManager.updateExercise(updateExercise);},"throws, exercise with incorrect name (null)");
    updateExercise.name="run2";
});
QUnit.test( "test number function", function( assert ) {
    assert.equal(2100,globalExercisesManager.sumKcal(),"sum of kcal");
});
QUnit.test( "delete exercises", function( assert ) {
    for(var i=1;i<=3;i++){
        globalExercisesManager.deleteExerciseByID(i);
    }
    assert.ok( globalExercisesManager.isEmpty() , "DB is empty" );
    assert.ok( globalExercisesManager.nextExerciseId()==1 , "Passed! next free Id after delete" );
});
QUnit.test( "delete exercise with incorrect parameter", function( assert ) {
    assert.throws(function() {globalExercisesManager.deleteExercise("");},"throws, delete exercise with id (\"\")");
    assert.throws(function() {globalExercisesManager.deleteExercise(null);},"throws, delete exercise with id (null)");
    assert.throws(function() {globalExercisesManager.deleteExercise(10);},"throws, delete exercise with wrong id");
});
QUnit.test( "delete storage", function( assert ) {
    localStorage.clear();
    globalExercisesManager.getAllExercises().length=0;
    assert.equal(1,globalExercisesManager.nextExerciseId(), "storage was deleted" );
});