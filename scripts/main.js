// Global Variables created & assigned, with any constants initialised at page load. Full global scope required for these variables. Object also initialised.
var _distance, _totalSeconds, _scoreNo, _livesNo, _highScore;
let gameTimeInterval, gameOverInterval, collisionInterval, powerUpInterval;
let gameInSession, twoGuards = false;
let startQuitButton = document.getElementsByClassName('startQuitButton')[0]; // This 0th index of the query selected array.
let projectBody = document.getElementById('projectContainerArea');
let playerIcon = document.getElementById('playerIcon');
let livesElement = document.getElementById('lives');
let distanceElement = document.getElementById('distance');
let scoreElement = document.getElementById('score');
let gameTimerElement = document.getElementById('timer');
let highScoreElement = document.getElementById('highScore');
let enemyElSelected = document.getElementsByClassName('enemy');
let powerUpElement = document.getElementById('powerUp');


// Calls the 'initialise' function through these event listeners, which are set to wait for the page's DOM to be fully loaded and ready.
if (document.addEventListener) document.addEventListener('DOMContentLoaded', initialise, false);
else window.onload = initialise;


function initialise() {
    // Init formation on page load.
    enemyFormation();
    initialised();
    livesElement.innerHTML = `Resistance: ${(_livesNo=0)}`;
    document.removeEventListener('DOMContentLoaded', initialise, false);

    startQuitButton.addEventListener('click', () => {
        if (startQuitButton.innerHTML.indexOf('Go!') > -1) {
            startGame();
        } else if (startQuitButton.innerHTML.indexOf('Quit') > -1) {
            quitGame();
        }
    });

    // Event listener for input box, to updates object's speed for the next motion.
    document.getElementById('speedInputField').addEventListener('change', function() {
        objectA._setSpeed(parseInt(this.value)); // Parses inputted value as an integer (to output an integer value), and runs '_setSpeed' setter method to set value.
        objectB._setSpeed(parseInt(this.value));
    });

    // Event listener for input box, to updates object's speed for the next motion.
    document.getElementById('formationField').addEventListener('change', function() {
        enemyFormation(this.value); // Parses inputted value as an integer (to output an integer value), and runs '_setSpeed' setter method to set value.
    });

    document.getElementById('guardsField').addEventListener('change', function() {
        twoGuards = parseInt(this.value);
    });

    // Small intervaled function that gets browser's local date & time, and updated every second (and dynamically displayed in page, through concatenation).
    setInterval(() => {
        let dDate = new Date(); // Local variable referencing the Date object.
        document.getElementById('dateTime').innerHTML = ('0' + dDate.getDate()).slice(-2) + '-' + ('0' + (dDate.getMonth()+1)).slice(-2) + '-' + dDate.getFullYear() + '; ' + ('0' + dDate.getHours()).slice(-2) + ':' + ('0' + dDate.getMinutes()).slice(-2) + ':' + ('0' + dDate.getSeconds()).slice(-2);
    }, 1000);
}


// This function is called when the page is ready, and contains the event listeners which will listen for, and control, some of the game's actions. Moreover the generated Hex code is applied to the background color here, after it has generated a random hex value by calling the 'hexColour' function. Furthermore, this function updates the displayed values with any initialised variables. Finally, it also contains start/quit game button controls.
function initialised(bool) {
    // Initialise variables/display.
    distanceElement.innerHTML = `Distance: ${(_distance=0)}`;
    scoreElement.innerHTML = `Score: ${(_scoreNo=0)}`;
    gameTimerElement.innerHTML = `${_totalSeconds=0} secs`;
    highScoreElement.innerHTML = `High Score: ${(_highScore = _highScore || 0)}`;
    if (!bool) livesElement.innerHTML = `Resistance: ${(_livesNo=0)}`;
    playerIcon.style.left = '92%';
    playerIcon.style.top = '92%';
    projectBody.style.background = '#7e000a';
    projectBody.style.color = 'black';
}


function startGame() {
    gameInSession = true;
    
    // Sets the Start Button to the Quit Button.
    startQuitButton.innerHTML = 'Quit';
    startQuitButton.setAttribute('label', 'quitB');
    livesElement.innerHTML = `Resistance: ${(_livesNo=20)}`;
    
    projectBody.addEventListener('mousemove', mouseTracking); // Calls 'mouseTracking' function, whenever the mouse is moved inside the div.
    for (let i=0; i < enemyElSelected.length; i++) { // Builds event listeners for each enemy image in the DOM structure.
        enemyElSelected[i].addEventListener('mouseover', roundOfGame);
        enemyElSelected[i].style.display = 'block';
    }

    objectA.start();
    if (twoGuards) objectB.start();
    timersProcessing(1);
}


function quitGame(bool) {
    gameInSession = false;

    // Sets the Quit Button back to the Start Button.
    startQuitButton.innerHTML = 'Go!';
    startQuitButton.setAttribute('label', 'startB');
    
    projectBody.removeEventListener('mousemove', mouseTracking); // Removes event listener for when the mouse is moved inside the div.
    for (let i=0; i < enemyElSelected.length; i++) { // Removes event listener for each enemy image in the DOM structure.
        enemyElSelected[i].removeEventListener('mouseover', roundOfGame);
        enemyElSelected[i].style.display = 'none';
    }

    objectA.stop();
    objectB.stop();
    timersProcessing(0);
    initialised(bool);
}


function enemyFormation(formationVal='541') { // Set css style properties, conditional based on formation selected from dropdown on page. With testing randomise option.
    let rightArray, topArray;
    switch(formationVal) {
        
        case '541':
            rightArray = [45,45,24,11,67,80,35,55,24,67];
            topArray = [70,20,20,45,20,45,45,45,70,70];
            for (let i=0; i < $('.enemy').length; i++) {
                document.getElementById(`imageEnemy${[i]}`).style.right = `${rightArray[i]}%`;
                document.getElementById(`imageEnemy${[i]}`).style.top = `${topArray[i]}%`;
            }
            break;
        
        case '343':
            rightArray = [45,24,5,66,86,45,45,45,45,45];
            topArray = [50,50,50,50,50,87,69,32,15,2];
            for (let i=0; i < $('.enemy').length; i++) {
                document.getElementById(`imageEnemy${[i]}`).style.right = `${rightArray[i]}%`;
                document.getElementById(`imageEnemy${[i]}`).style.top = `${topArray[i]}%`;
            }
            break;
        
        case 'random':
            
            function randomHeight(min, max) {
                return min + Math.random() * (max - min);
            }
            
            for (let i=0; i < enemyElSelected.length; i++) {
                enemyElSelected[i].style.top = randomHeight($('.inGameText').height(), $('#projectContainerArea').height()) + 'px';
                enemyElSelected[i].style.right = randomHeight($('.inGameText').width(), $('#projectContainerArea').width()) + 'px';
                
                if (i > 0 && enemyElSelected[i-1].style.top == enemyElSelected[i].style.top && enemyElSelected[i-1].style.right == enemyElSelected[i].style.right) {
                    enemyElSelected[i].style.top = '' + (Math.floor(Math.random()* 100) +1) + '%';
                    enemyElSelected[i].style.right = '' + (Math.floor(Math.random()* 100) +1) + '%';
                }
            }
            break;
    }
}


let hexColor = (bool, _generatedHex='') => { // Assigns a randomly generated hex string to a constant.
    
    for (let i=0; i < 6; i++) { // Loop through 6 times to get all the 6 required digits, excluding '#'.
        let chr = Math.floor(Math.random() * 16); // Generated random number between 0 and 15.
        
        if (chr < 10 && chr !== 'NaN') { // Assigns a numerical value if 'chr' < 10 & concatenates with each pass.
            _generatedHex = _generatedHex + '' + chr;
        } else if (chr >= 10 && chr !== 'NaN') { // Assign a hex alphabetical character (A-F), if 10<=chr<16, using the switch conditional statement. Concatenates with each pass.
            switch (chr) {
                case 10:
                    chr = 'A';
                    break;
                case 11:
                    chr = 'B';
                    break;
                case 12:
                    chr = 'C';
                    break;
                case 13:
                    chr = 'D';
                    break;
                case 14:
                    chr = 'E';
                    break;
                default:
                    chr = 'F';
            }
            _generatedHex += chr;
        }
    }
    _generatedHex = '#' + _generatedHex;

    // Checks whether the hex code is of the correct length, to then convert the hex string into an RGB format, in order to check the color isn't too dark for the informational text displayed. If it too dark, (i.e. black text on dark background), it will change the text font color accordingly.
    if (_generatedHex.length == 7 && bool) {
        convertHexToRGB(_generatedHex);
        
        // Dissect the three bytes that describe red, green & blue in the hex string. These bytes are then each passed into the 'parseInt' method, to be parsed as an integer, and then stored as a variable. In short; turn convert the generated hex value to and RGB value (not for use however).
        function convertHexToRGB(hexCode) {
            hexCode = hexCode.replace('#','');
            let rr = parseInt(hexCode.substring(0,2), 16); //radix = 16, so convert from hexadecimal.
            let gg = parseInt(hexCode.substring(2,4), 16);
            let bb = parseInt(hexCode.substring(4,6), 16);
            let result = rr + gg + bb;
            if (result < 204 || (rr < 96 && gg < 96 && bb < 96)) { // Detect if the background color will be too dark to read black text, and react if so.
                projectBody.style.color = 'white';
                livesElement.style.color = 'white';
            } else {
                projectBody.style.color = 'black';
                livesElement.style.color = 'black';
            }
        }
    }
    return _generatedHex; // Returns the newly generated & formatted hex code, with '#' pre-pended.
};


// This function handles each round (after a click in the div), by assessing number of lives. It reports the game's results and reinitialises on game over (lives = 0), or simply continues to count up if (and decrease lives) if not a game over, (i.e. lives < 0).
function roundOfGame() {
    
    if (gameInSession) {
        
        projectBody.style.backgroundColor = hexColor(true); // Passes true as argument to identify background color is the change that has been applied.
        _livesNo-= 2;

        if (_livesNo < 0) _livesNo = 0; // Exception handler to prevent lives falling below 0 (getting hit without having progressed a round).
        
        if (_livesNo <= 0) { // Game Over conditions MET: Sets the final statistic results, as well as the celebration color changing text.
            
            _scoreNo += Math.floor(parseInt(_distance)) + Math.floor(parseInt(_totalSeconds));
            // Runs an intervaled timer (in ms), which calls the 'hexColour' function, to apply a generated random hex to the specific game over text. Each interval applies a new color, for some graphics. Passes integer '1' as argument, to identify that this generated hex code is for the Game-Over text, (and so the surrounding text doesn't need to change color, as the background color is unchanged). Re-matches all the text color and closes the timer itself, once completed.
            if (_scoreNo > _highScore) { // Decide and set the new high score value, if condition met for a value higher than the previous stored value.
                _highScore = _scoreNo;
                livesElement.innerHTML = `NEW HIGH SCORE: ${_scoreNo} << >> Resistance: ${_livesNo}`;
            } else {
                livesElement.innerHTML = `Game Over! Your Score is: ${_scoreNo} << >> Resistance: ${_livesNo}`;
            }
            timersProcessing(2);
            quitGame(true); // Pass through argument true with call, so not to init lives to 0;

        } else if (_livesNo > 0) { // Game Over conditions NOT MET: Displays final statistic results, and game continues.
            
            scoreElement.innerHTML = `Score: ${(_scoreNo-=3)}`;
            livesElement.innerHTML = `Resistance: ${_livesNo}`;
        }
    }
}


function timersProcessing(val) {
    
    if (val==1) {

        clearInterval(gameOverInterval);
        livesElement.style.color = 'black';

        $(() => {
            startQuitButton.disabled = true;
            $('#dialog').dialog(); // Open the New Game pop-up dialog box (jQuery).
        });
        
        // Timeout function which closes the pop-up dialog box after the specified time (in ms). Also sets the Start Button as a Quit Button once clicked.
        setTimeout(() => {
            $('#dialog').dialog('close'); // Close the New Game pop-up dialog box (jQuery).
            startQuitButton.disabled = false;
        }, 1100);
        
        // Runs the intervaled timer, that simply adds 1 to a zeroed integer variable every interval (specified in ms). This counted up time is displayed in total seconds (not formatted, for now).
        gameTimeInterval = setInterval(() => {
            gameTimerElement.innerHTML = `${(_totalSeconds+=1)} secs`;
        }, 1000);
        
        // Checks for collisions in the two query selected elements that are passed into the 'interceptionCheck' function, as arguments, via a short intervaled timer. This happens from calling the text() method with the nested 'interceptionCheck()' function passed as an argument (with the two elements as it's own nested arguments).
        collisionInterval = setInterval(() => {
            if (gameInSession) for (let i=0; i < $('.enemy').length; i++) {interceptionCheck($('#playerIcon'), $(`#imageEnemy${[i]}`));}
            if (gameInSession) interceptionCheck($('#playerIcon'), $('#objectA'));
            if (twoGuards && gameInSession) interceptionCheck($('#playerIcon'), $('#objectB'));
            if (!prop && gameInSession) interceptionCheck($('#playerIcon'), $('#powerUp'), true);
        }, 200);

        let prop = true;
        powerUpInterval = setInterval(() => {
            prop = !(prop);
            powerUpElement.style.top = `${Math.floor(Math.random() * $('#projectContainerArea').height()/$('#projectContainerArea').height()*100)}%`;
            powerUpElement.style.left = `${Math.floor(Math.random() * $('#projectContainerArea').width()/$('#projectContainerArea').width()*100)}%`;
            (prop) ? powerUpElement.style.display = 'none' : powerUpElement.style.display = 'block';
        }, 7000);
        
    } else if (val==0) {

        clearInterval(collisionInterval);
        clearInterval(powerUpInterval);
        clearInterval(gameTimeInterval);

    } else if (val==2) {

        gameOverInterval = setInterval(() => {
            livesElement.style.color = hexColor(false);
        }, 400);

        setTimeout(() => {
            clearInterval(gameOverInterval);
            livesElement.style.color = 'black';
        },15000);
    }
}


// This function is called upon any mouse movement in the target div, as a result of the event listener. Triggers the targeted image element to move towards the mouse, and counts up a 'number of moves' based on mouse movement distance. Passes the Event object as an argument for the parameter applied passed into the function.
function mouseTracking(e) { // Passes 'e' event object into the function when called, as a parameter. The argument for this 'e' parameter is by default the event that calls the function, so in this case e is the mousemove event data (like layerX/Y properties for example).
    let _xCoord = e.layerX; // Get and store x-coord & y-coord of mouse pointer in the browser window.
    let _yCoord =  e.layerY;
    distanceElement.innerHTML = `Distance: ${Math.floor((_distance+=1)/16)}`;
    $('#playerIcon').stop().animate({left:_xCoord-20, top:_yCoord-20}); // jQuery used to create the positional vector for the element to be animated (moved) to, which in this case is the cursor position inside the div. Decrease x and y values by 20 to centrally align image with the mouse pointer.
}


// Function that is called by a short interval (called every interval, in ms), which is checking for the two elements (passed in as arguments) and if they are intercepting. Builds data from the elements that are passed in with the call, to deduce where they are positions in the container.
function interceptionCheck(el1, el2, bool) {
    // Element 1 data (The ball image).
    let el1Offset = el1.offset();
    let el1Height = el1.outerHeight(true);
    let el1Width = el1.outerWidth(true);
    let el1DistanceTop  = el1Offset.top + el1Height;
    let el1DistanceLeft = el1Offset.left + el1Width;

    // Element 2 data (The enemy image).
    let el2Offset = el2.offset();
    let el2Height = el2.outerHeight(true);
    let el2Width = el2.outerWidth(true);
    let el2DistanceTop = el2Offset.top + el2Height;
    let el2DistanceLeft = el2Offset.left + el2Width;

    let interceptionStatus = (el1DistanceTop < el2Offset.top || el1Offset.top > el2DistanceTop || el1DistanceLeft < el2Offset.left || el1Offset.left > el2DistanceLeft); // Returns boolean value, if an interception is detected through the comparison and or (||) operators.
    
    // If !interceptionStatus is truthy (i.e. interceptionStatus is falsey), acknowledges the player has been hit, and calls 'roundOfGame' function.
    if (!interceptionStatus && !bool) {
        roundOfGame();
    } else if (!interceptionStatus && bool) { // Third condition is so the invisible pickUp still wouldn't give 2 lives.
        powerUpPickup();
    }
}


function powerUpPickup() {
    livesElement.innerHTML =`Resistance: ${(_livesNo+=5)}`;
    scoreElement.innerHTML = `Score: ${(_scoreNo+=80)}`;
    powerUpElement.style.display = 'none';
    powerUpElement.style.top = `${Math.floor(Math.random() * $('#projectContainerArea').height()/$('#projectContainerArea').height()*100)}%`;
    powerUpElement.style.left = `${Math.floor(Math.random() * $('#projectContainerArea').width()/$('#projectContainerArea').width()*100)}%`;
}


// Object constructor. Properties which any resulting objects will inherit, using 'this' keyword (to specify our object rather than any global objects, like the document object). Various getter/setter methods will update these properties when called against the object.
class enemyObject {
    constructor(obj) {
        this.object = obj;
        this._pixelsPerSecond = 250;
        this.currentPosition = {
            x: 0,
            y: 0
        };
        // Init the running state to be set to false. This property value will conditionally determine the behavior of various getters/setters. Indicates whether the object is in motion (so is running/active).
        this._enemyObjectActive = false;
    }

    // Adds '_setSpeed' setter method to the object, which updates the '_pixelsPerSecond' property, which the constructed object will inherit. This property sets the animation (movement) speed of object, in pixels per second, when applied to the object.
    _setSpeed(speedPxs) {
        this._pixelsPerSecond = speedPxs;
    }

    // Adds getter method '_getContainerDimensions', which returns an object, representing the container element dimensions (height, width), which will update the 'containerSize' variable.
    _getContainerDimensions() {
        return {
            'height': $('#projectContainerArea').height(),
            'width': $('#projectContainerArea').width()
        };
    }

    // Adds a getter method, that returns an available movement position (as an (x,y) coordinate object) which has been constrained by the container area.
    _generateNewPosition() {
        // Works out available area dimensions to plot a movement for the object, from the ascertained container size, after subtracting the size of the generated object itself.
        let containerSize = this._getContainerDimensions(); // An object is returned by the getter method, representing area values (height, width).
        let availableHeight = containerSize.height; // Subtract height of the object/shape for y-axis.
        let availableWidth = containerSize.width;
        // Produces a random x and a random y coordinate from the deduced available area, which is rounded down to the nearest integer.
        let y = Math.floor(Math.random() * availableHeight);
        let x = Math.floor(Math.random() * availableWidth);
        return {
            x: x,
            y: y
        };
    }

    // Calculates the length of the distance to move (as a scalar) using this getter method. Vector is completed by the user defined speed, as well as a random direction being both applied to the object.
    _calcDistance(a, b) {
        // Work out the difference between current position: a(x,y); and the next position: b(x,y). Accesses the 'x' and 'y' properties of 'a' and 'b'. Individually works out the difference between the two 'x' points and difference between the two 'y' points, which are then used to work out the distance.
        let distanceX = a.x - b.x;
        let distanceY = a.y - b.y;
        let distanceXY = Math.sqrt(distanceX * distanceX + distanceY * distanceY); // Pythagoras' Theorem: [c = (a^2 + b^2)^0.5]. To work out distance/length.
        return distanceXY;
    }

    // Setter method to plot the movement and speed for the object, by running further methods which will return values to be applied via CSS attributes. These are all but into action, and each call of this function is one random movement.
    moveObject() {
        let nextPoint = this._generateNewPosition(); // Returns x,y coordinates object, which are random points in the available area, using the getter method.
        let distance = this._calcDistance(this.currentPosition, nextPoint); // Returns length that the object will move (scalar), from this getter method.
        let speed = Math.round((distance / this._pixelsPerSecond) * 100) / 100; // Speed of transition event, set by the setter value after being mathematically manipulated (result rounds to 2 decimal places).
        this.object.style.transition = 'transform ' + speed + 's linear'; // Sets CSS 'transition' & 'transform' attributes, using concatenation.
        this.object.style.transform = 'translate3d(' + nextPoint.x + 'px, ' + nextPoint.y + 'px, 0)';
        // Set's the new position the object just moved to (referenced in the 'nextPoint' variable) as the new current position, ready to be called again and provide a start point for the distance calculations.
        this.currentPosition = nextPoint;
    }

    // Start Button Pressed setter method. Calls other method(s), adds event listener to keep object in constant motion, and sets running state to true, once start button is clicked.
    start() {
        if (this._enemyObjectActive) { // Conditional error handling: Ignores second start button press, if the _enemyObjectActive property is truthy (indicating App is running).
            return;
        }

        this.object.style.display = 'block';
        this.object.pointerEvents = 'auto';
        playerIcon.style.display = 'block';
        
        // Set the right starting CSS attributes of our object.
        this.object.willChange = 'transform'; // Precaution the browser/UA (userAgent) of the expected change on our object, for optimization.<custom-ident> (an arbitrary value, author defined identifier, not recognized as a pre-defined keyword.
        this.boundEvent = this.moveObject.bind(this); // Creates new function that is bound to our object, by using the 'this' keyword as both argument and parameter (always first parameter). Avoids undefined results generated by the method, by targeting our object, as the 'this' keyword always refers to the object that invoked it.
        // Bind callback to keep it all moving.
        this.object.addEventListener('transitionend', this.boundEvent); // Listens for CSS Transition event to complete on the our targeted object, to then trigger the 'moveObject' method, which moves the object with a random vector. This is repeated every time, until stopped, so continually moves the object.
        // Moves the object, once to begin an instance for the event listener.
        this.moveObject();
        this._enemyObjectActive = true; // Set state to True, with this setter method. This property value will conditionally determine the behavior of various getters/setters. Indicates whether the targeted object is in motion (so the App is running).
    }

    // Stop button pressed setter function. Removes event listener that keeps object in motion.
    stop() {
        if (!this._enemyObjectActive) { // Checks to make sure objects is not running (stopped), if it isn't already running, then returns out (as no action required).
            return;
        }

        this.object.style.display = 'none';
        this.object.pointerEvents = 'none';
        powerUpElement.style.display = 'none';
        playerIcon.style.display = 'none';
        
        this.object.removeEventListener('transitionend', this.boundEvent); // Removes event listener that would again move the object after it had transitioned. Removed once the transition is completed.
        this._enemyObjectActive = false; // Set state to False, with this setter method. This property value will conditionally determine the behavior of various getters/setters. Indicates whether the targeted object is in motion (so the App is running or not).
    }
}

// Init the object. Create a new object with initial property value pairs, and passing the target element and the area for the resulting object to interact.
var objectA = new enemyObject(document.getElementById('objectA'), window);
var objectB = new enemyObject(document.getElementById('objectB'), window);