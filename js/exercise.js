/**
 * Created by mkralik on 2/13/16.
 */

/**
 * Type of exercise
 * @param name - name of exercise
 * @param kcal - count of exercise
 * @constructor
 */
function Exercise(name,kcal){
    this.id=null;
    this.name=name;
    this.kcal=kcal;

    this.toString = function () {
        return "Exercise " + this.name + " have " +this.kcal+ "kcal per minute.";
    }
}
