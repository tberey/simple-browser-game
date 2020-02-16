var objectA = new enemyObject(document.getElementById('objectA'), window);

let bool=true;
window.setInterval(function() {
    (bool) ? objectA.start() : objectA.stop();
}, 10000);

document.getElementById('speedInputField').addEventListener('change', function() {
    objectA._setSpeed(parseInt(this.value)); // Parses inputted value as an integer (to output an integer value), and runs '_setSpeed' setter method to set value.
});

// Object constructor. Properties which any resulting objects will inherit, using 'this' keyword (to specify our object rather than any global objects, like the document object). Various getter/setter methods will update these properties when called against the object.
function enemyObject(obj, container) {
    this.$object = obj;
    this.$container = container;
    this._pixelsPerSecond = 250;
    this.currentPosition = {
        x: 0,
        y: 0
    };
    // Init the running state to be set to false. This property value will conditionally determine the behavior of various getters/setters. Indicates whether the object is in motion (so is running/active).
    this._enemyObjectActive = false;
}

// Adds '_setSpeed' setter method to the object, which updates the '_pixelsPerSecond' property, which the constructed object will inherit. This property sets the animation (movement) speed of object, in pixels per second, when applied to the object.
enemyObject.prototype._setSpeed = function(speedPxs) {
    this._pixelsPerSecond = speedPxs;
};

// Adds getter method '_getContainerDimensions', which returns an object, representing the container element dimensions (height, width), which will update the 'containerSize' variable.
enemyObject.prototype._getContainerDimensions = function() {
    return {
        'height': $('#projPlaceholder').height(), // Read-only property of container element's height/width (jQuery).
        'width': $('#projPlaceholder').width()
    };
};

// Adds a getter method, that returns an available movement position (as an (x,y) coordinate object) which has been constrained by the container area.
enemyObject.prototype._generateNewPosition = function() {

    // Works out available area dimensions to plot a movement for the object, from the ascertained container size, after subtracting the size of the generated object itself.
    let containerSize = this._getContainerDimensions(); // An object is returned by the getter method, representing area values (height, width).
    let availableHeight = containerSize.height - 45; // Subtract height of the object/shape for y-axis.
    let availableWidth = containerSize.width;

    // Produces a random x and a random y coordinate from the deduced available area, which is rounded down to the nearest integer.
    var y = Math.floor(Math.random() * availableHeight);
    var x = Math.floor(Math.random() * availableWidth);

    return { // Returned new position's random x,y coordinates as an object.
        x: x,
        y: y
    };
};

// Calculates the length of the distance to move (as a scalar) using this getter method. Vector is completed by the user defined speed, as well as a random direction being both applied to the object.
enemyObject.prototype._calcDistance = function(a, b) {

    // Work out the difference between current position: a(x,y); and the next position: b(x,y). Accesses the 'x' and 'y' properties of 'a' and 'b'. Individually works out the difference between the two 'x' points and difference between the two 'y' points, which are then used to work out the distance.
    let distanceX = a.x - b.x;
    let distanceY = a.y - b.y;
    var distanceXY = Math.sqrt(distanceX * distanceX + distanceY * distanceY); // Pythagoras' Theorem: [c = (a^2 + b^2)^0.5]. To work out distance/length.
    return distanceXY;
};

// Setter method to plot the movement and speed for the object, by running further methods which will return values to be applied via CSS attributes. These are all but into action, and each call of this function is one random movement.
enemyObject.prototype.moveObject = function() {
    let nextPoint = this._generateNewPosition(); // Returns x,y coordinates object, which are random points in the available area, using the getter method.
    let distance = this._calcDistance(this.currentPosition, nextPoint); // Returns length that the object will move (scalar), from this getter method.
    let speed = Math.round((distance / this._pixelsPerSecond) * 100) / 100; // Speed of transition event, set by the setter value after being mathematically manipulated (result rounds to 2 decimal places).

    this.$object.style.transition = 'transform ' + speed + 's linear'; // Sets CSS 'transition' & 'transform' attributes, using concatenation.
    this.$object.style.transform = 'translate3d(' + nextPoint.x + 'px, ' + nextPoint.y + 'px, 0)';

    // Set's the new position the object just moved to (referenced in the 'nextPoint' variable) as the new current position, ready to be called again and provide a start point for the distance calculations.
    this.currentPosition = nextPoint;
};

// Start Button Pressed setter method. Calls other method(s), adds event listener to keep object in constant motion, and sets running state to true, once start button is clicked.
enemyObject.prototype.start = function() {

    if (this._enemyObjectActive) { // Conditional error handling: Ignores second start button press, if the _enemyObjectActive property is truthy (indicating App is running).
        return;
    }
    bool = false;
    objectElement.style.display = 'block';

    // Set the right starting CSS attributes of our object.
    this.$object.willChange = 'transform'; // Precaution the browser/UA (userAgent) of the expected change on our object, for optimization.<custom-ident> (an arbitrary value, author defined identifier, not recognized as a pre-defined keyword.
    this.$object.pointerEvents = 'auto';

    this.boundEvent = this.moveObject.bind(this); // Creates new function that is bound to our object, by using the 'this' keyword as both argument and parameter (always first parameter). Avoids undefined results generated by the method, by targeting our object, as the 'this' keyword always refers to the object that invoked it.

    // Bind callback to keep it all moving.
    this.$object.addEventListener('transitionend', this.boundEvent); // Listens for CSS Transition event to complete on the our targeted object, to then trigger the 'moveObject' method, which moves the object with a random vector. This is repeated every time, until stopped, so continually moves the object.

    // Moves the object, once to begin an instance for the event listener.
    this.moveObject();

    this._enemyObjectActive = true; // Set state to True, with this setter method. This property value will conditionally determine the behavior of various getters/setters. Indicates whether the targeted object is in motion (so the App is running).
};

// Stop button pressed setter function. Removes event listener that keeps object in motion.
enemyObject.prototype.stop = function() {

    if (!this._enemyObjectActive) { // Checks to make sure objects is not running (stopped), if it isn't already running, then returns out (as no action required).
        return;
    }
    bool = true;
    objectElement.style.display = 'none';

    this.$object.removeEventListener('transitionend', this.boundEvent); // Removes event listener that would again move the object after it had transitioned. Removed once the transition is completed.

    this._enemyObjectActive = false; // Set state to False, with this setter method. This property value will conditionally determine the behavior of various getters/setters. Indicates whether the targeted object is in motion (so the App is running or not).
};