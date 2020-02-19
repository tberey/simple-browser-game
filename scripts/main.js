// Global Variables Space. Global scope is required for these.
var _distance, _totalSeconds, _scoreNo, _livesNo, _highScore;
let gameTimeInterval, gameOverInterval, collisionInterval, powerUpInterval;
let gameInSession, twoGuards = false;
let startQuitButton = document.getElementsByClassName('startQuitButton')[0];//First (0th) index of the returned array of element (we know there's only 1).
let projectBody = document.getElementById('projectContainerArea');
let playerIcon = document.getElementById('playerIcon');
let livesElement = document.getElementById('lives');
let distanceElement = document.getElementById('distance');
let scoreElement = document.getElementById('score');
let gameTimerElement = document.getElementById('timer');
let highScoreElement = document.getElementById('highScore');
let enemyElSelected = document.getElementsByClassName('enemy');
let powerUpElement = document.getElementById('powerUp');


// Calls 'initialise' func, after waiting for page/DOM to be fully loaded and ready.
if (document.addEventListener) document.addEventListener('DOMContentLoaded', initialise, false);
else window.onload = initialise;


// Initialise event listeners for dropdowns and button. Also init date/time and heads-up display.
function initialise() {
    enemyFormation();//Init layout of enemy elements on page load.
    initialised();
    livesElement.innerHTML = `Resistance: ${(_livesNo=0)}`;
    document.removeEventListener('DOMContentLoaded', initialise, false);

    //Listener for start/quit button, to call startGame/quitGame respectively.
    startQuitButton.addEventListener('click', () => {
        if (startQuitButton.innerHTML.indexOf('Go!') > -1) {
            startGame();
        } else if (startQuitButton.innerHTML.indexOf('Quit') > -1) {
            quitGame();
        }
    });

    //Listener for speed dropdown, to set objects speeds for the next motion.
    document.getElementById('speedInputField').addEventListener('change', function() {
        objectA._setSpeed(parseInt(this.value));
        objectB._setSpeed(parseInt(this.value));
    });

    //Listener for layout/formation dropdown, to set new layout.
    document.getElementById('formationField').addEventListener('change', function() {
        enemyFormation(this.value);
    });

    //Listener for number of patrolling guards dropdown, to inc/decrease the number.
    document.getElementById('guardsField').addEventListener('change', function() {
        twoGuards = parseInt(this.value);
    });

    //Set/display date & time.
    setInterval(() => {
        let dDate = new Date();
        document.getElementById('dateTime').innerHTML = ('0' + dDate.getDate()).slice(-2) + '-' + ('0' + (dDate.getMonth()+1)).slice(-2) + '-' + dDate.getFullYear() + '; ' + ('0' + dDate.getHours()).slice(-2) + ':' + ('0' + dDate.getMinutes()).slice(-2) + ':' + ('0' + dDate.getSeconds()).slice(-2);
    }, 1000);
}


// Initialise heads-up display.
function initialised(bool) {
    //Init variables/display/props.
    distanceElement.innerHTML = `Distance: ${(_distance=0)}`;
    scoreElement.innerHTML = `Score: ${(_scoreNo=0)}`;
    gameTimerElement.innerHTML = `${_totalSeconds=0} secs`;
    highScoreElement.innerHTML = `High Score: ${(_highScore = _highScore || 0)}`;//Assign truthy value (so on init; no high score achieved; set to 0).
    if (!bool) livesElement.innerHTML = `Resistance: ${(_livesNo=0)}`;//Do not init this if func is called from quitGame(bool), so bool argument is true.
    playerIcon.style.left = '92%';
    playerIcon.style.top = '92%';
    projectBody.style.background = '#7e000a';
    projectBody.style.color = 'black';
}


// Call only on start button press by user, to begin the game.
function startGame() {
    gameInSession = true;
    
    //Set Start Button to Quit Button and set starting lives.
    startQuitButton.innerHTML = 'Quit';
    startQuitButton.setAttribute('label', 'quitB');
    livesElement.innerHTML = `Resistance: ${(_livesNo=20)}`;
    
    //Listen for mousemove in the game space, to set diamond follow route.
    projectBody.addEventListener('mousemove', mouseTracking);

     //Build event listener for each enemy image in the DOM structure.
    for (let i=0; i < enemyElSelected.length; i++) {
        enemyElSelected[i].addEventListener('mouseover', roundOfGame);
        enemyElSelected[i].style.display = 'block';
    }

    //Begin all game mechanics.
    objectA.start();
    if (twoGuards) objectB.start();//Only start second obj if user has selected so.
    timersProcessing(1);//Pass 1 as arg, to start intervals.
}


// Call to end the game.
function quitGame(bool) {
    gameInSession = false;

    //Set Quit Button back to the Start Button.
    startQuitButton.innerHTML = 'Go!';
    startQuitButton.setAttribute('label', 'startB');
    
    projectBody.removeEventListener('mousemove', mouseTracking);

    //Remove event listener for each enemy a listener was attached to.
    for (let i=0; i < enemyElSelected.length; i++) {
        enemyElSelected[i].removeEventListener('mouseover', roundOfGame);
        enemyElSelected[i].style.display = 'none';
    }

    //Stop all game mechanics.
    objectA.stop();
    objectB.stop();
    timersProcessing(0);//Pass 0 as arg, to clear intervals.
    initialised(bool);//Pass the argument from this call into the next call.
}


// Set css style properties, conditionally from dropdown selection. (With testing 'random' option). Default parameter for init.
function enemyFormation(formationVal='541') {
    let rightArray, topArray;
    switch(formationVal) {
        
        case '541':
            rightArray = [45,45,24,11,67,80,35,55,24,67];
            topArray = [70,20,20,45,20,45,45,45,70,70];
            for (let i=0; i < $('.enemy').length; i++) {//Using array and loop, build/set positional layout for each enemy image on page.
                document.getElementById(`imageEnemy${[i]}`).style.right = `${rightArray[i]}%`;
                document.getElementById(`imageEnemy${[i]}`).style.top = `${topArray[i]}%`;
            }
            break;
        
        case '343':
            rightArray = [45,24,5,66,86,45,45,45,45,45];
            topArray = [50,50,50,50,50,87,69,32,15,2];
            for (let i=0; i < $('.enemy').length; i++) {//Using array and loop, build/set positional layout for each enemy image on page.
                document.getElementById(`imageEnemy${[i]}`).style.right = `${rightArray[i]}%`;
                document.getElementById(`imageEnemy${[i]}`).style.top = `${topArray[i]}%`;
            }
            break;
        
        case 'random':
            
            function randomHeight(min, max) {
                return min + Math.random() * (max - min);
            }
            //Set a random position for each element.
            for (let i=0; i < enemyElSelected.length; i++) {
                enemyElSelected[i].style.top = randomHeight($('.inGameText').height(), $('#projectContainerArea').height()) + 'px';
                enemyElSelected[i].style.right = randomHeight($('.inGameText').width(), $('#projectContainerArea').width()) + 'px';
                
                //Stop any overlapping elements, else set a new random pos.
                if (i > 0 && enemyElSelected[i-1].style.top == enemyElSelected[i].style.top && enemyElSelected[i-1].style.right == enemyElSelected[i].style.right) {
                    enemyElSelected[i].style.top = '' + (Math.floor(Math.random()* 100) +1) + '%';
                    enemyElSelected[i].style.right = '' + (Math.floor(Math.random()* 100) +1) + '%';
                }
            }
            break;
    }
}


// Call to assign a randomly generated hexadecimal colour string to variable. New colour with each call. Default param clear hex for each new color.
let hexColor = (bool, _generatedHex='') => {
    
    for (let i=0; i < 6; i++) {//Loop through 6 times to get all the 6 required digits, excluding '#'.
        let chr = Math.floor(Math.random() * 16);//Generated random number between 0 and 15.
        
        //Assign a hex value if random number less than 10. Assign a hex character (A-F), if number greater than 9. Concatonates with each pass.
        if (chr < 10 && chr !== 'NaN') {
            _generatedHex = _generatedHex + '' + chr;
        } else if (chr > 9 && chr !== 'NaN') {
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

    //Convert hex string to RGB format, to check random color applied to background (argument bool=true) isn't too dark for text displayed. Change text color accordingly.
    if (_generatedHex.length == 7 && bool) {
        convertHexToRGB(_generatedHex);
        
        //Dissect the three bytes that describe red, green & blue in the hex string. These bytes are then each passed into the 'parseInt' method, to be parsed as an integer, and then stored as a variable. In short; turn convert the generated hex value to and RGB value (not for use however).
        function convertHexToRGB(hexCode) {
            hexCode = hexCode.replace('#','');
            let rr = parseInt(hexCode.substring(0,2), 16); //radix = 16, so convert from hexadecimal.
            let gg = parseInt(hexCode.substring(2,4), 16);
            let bb = parseInt(hexCode.substring(4,6), 16);
            let result = rr + gg + bb;
            if (result < 204 || (rr < 96 && gg < 96 && bb < 96)) {//Detect if the background color will be too dark to read black text.
                projectBody.style.color = 'white';
                livesElement.style.color = 'white';
            } else {
                projectBody.style.color = 'black';
                livesElement.style.color = 'black';
            }
        }
    }
    return _generatedHex;//Return newly generated hex code, with '#' prepended.
};


// Call on any negative interaction (something to lose a life). Randomise background colour. Decide if game is over yet, else deduct lives.
function roundOfGame() {
    
    if (gameInSession) {
        
        projectBody.style.backgroundColor = hexColor(true);//Passes true as arg to enable check text color against background color.
        _livesNo-= 2;

        if (_livesNo < 0) _livesNo = 0;
        
        if (_livesNo <= 0) {//Game Over conditions met: Set heads-up display.
            
            _scoreNo += Math.floor(parseInt(_distance)) + Math.floor(parseInt(_totalSeconds));//Conclusion score calculation.
            
            if (_scoreNo > _highScore) {//New high score check, and total score display.
                _highScore = _scoreNo;
                livesElement.innerHTML = `NEW HIGH SCORE: ${_scoreNo} << >> Resistance: ${_livesNo}`;
            } else {
                livesElement.innerHTML = `Game Over! Your Score is: ${_scoreNo} << >> Resistance: ${_livesNo}`;
            }
            timersProcessing(2);//Pass '2' as argument, to set game over text interval (flashing randomly coloured text).
            quitGame(true);//Pass through truthy argument with call, so not to init lives.

        } else if (_livesNo > 0) {//Continue game.
            
            scoreElement.innerHTML = `Score: ${(_scoreNo-=3)}`;
            livesElement.innerHTML = `Resistance: ${_livesNo}`;
        }
    }
}


// Intervals/Timer controls, to enable game mechanics.
function timersProcessing(val) {
    
    if (val==1) {//Start some stopped mechanics, on Start Game.

        clearInterval(gameOverInterval);//Set back text colour and clear colour randomisation.
        livesElement.style.color = 'black';

         //Anon function call, to bring up dialog/pop-up box.
        $(() => {
            startQuitButton.disabled = true;
            $('#dialog').dialog();
        });
        
        //Timeout function to close the pop-up dialog box.
        setTimeout(() => {
            $('#dialog').dialog('close');
            startQuitButton.disabled = false;
        }, 1100);
        
        //In-game seconds timer.
        gameTimeInterval = setInterval(() => {
            gameTimerElement.innerHTML = `${(_totalSeconds+=1)} secs`;
        }, 1000);
        
        //Interval check for collisions in selected elements which are passed into the 'interceptionCheck' function, as args, if the game is running.
        collisionInterval = setInterval(() => {
            if (gameInSession) for (let i=0; i < $('.enemy').length; i++) {interceptionCheck($('#playerIcon'), $(`#imageEnemy${[i]}`));}//Each image.
            if (gameInSession) interceptionCheck($('#playerIcon'), $('#objectA'));
            if (twoGuards && gameInSession) interceptionCheck($('#playerIcon'), $('#objectB'));
            if (!prop && gameInSession) interceptionCheck($('#playerIcon'), $('#powerUp'), true);
        }, 150);

        //Interval to randomly spawn the power-up location, and periodically display in-game.
        let _prop = true;//Var to alternate css display property.
        powerUpInterval = setInterval(() => {
            _prop = !(_prop);
            powerUpElement.style.top = `${Math.floor(Math.random() * $('#projectContainerArea').height()/$('#projectContainerArea').height()*100)}%`;
            powerUpElement.style.left = `${Math.floor(Math.random() * $('#projectContainerArea').width()/$('#projectContainerArea').width()*100)}%`;
            (_prop) ? powerUpElement.style.display = 'none' : powerUpElement.style.display = 'block';
        }, 7000);
        
    } else if (val==0) {//Clear all necessary intervals, on Quit Game.

        clearInterval(collisionInterval);
        clearInterval(powerUpInterval);
        clearInterval(gameTimeInterval);

    } else if (val==2) {//Set multi-coloured text on Game-Over conditions met.

        //Interval to randomly set text color
        gameOverInterval = setInterval(() => {
            livesElement.style.color = hexColor(false);//Passes false as arg to disable check text color against background color.
        }, 400);

        setTimeout(() => {//Set back text colour and clear own interval after a set time.
            clearInterval(gameOverInterval);
            livesElement.style.color = 'black';
        },15000);
    }
}


// Call on mouse move, to track mouse/touch and plot player icon element to it.
function mouseTracking(e) {//Passes 'e' event object for mouse move property: layer location.
    let _xCoord = e.layerX;
    let _yCoord =  e.layerY;
    distanceElement.innerHTML = `Distance: ${Math.floor((_distance+=1)/16)}`;//Calculate and update display of distance, in-game.
    $('#playerIcon').stop().animate({left:_xCoord-20, top:_yCoord-20});//Move element.
}


// Call to check if two elements overlap.
function interceptionCheck(el1, el2, bool) {
    //Element 1 data extrapolation.
    let el1Offset = el1.offset();
    let el1Height = el1.outerHeight(true);
    let el1Width = el1.outerWidth(true);
    let el1DistanceTop  = el1Offset.top + el1Height;
    let el1DistanceLeft = el1Offset.left + el1Width;

    //Element 2 data extrapolation.
    let el2Offset = el2.offset();
    let el2Height = el2.outerHeight(true);
    let el2Width = el2.outerWidth(true);
    let el2DistanceTop = el2Offset.top + el2Height;
    let el2DistanceLeft = el2Offset.left + el2Width;

    let interceptionStatus = (el1DistanceTop < el2Offset.top || el1Offset.top > el2DistanceTop || el1DistanceLeft < el2Offset.left || el1Offset.left > el2DistanceLeft);//Return boolean value for deduced interception from extrapolated data.
    
    //If '!interceptionStatus' is truthy (i.e. 'interceptionStatus' is falsey), then there is an interception.
    if (!interceptionStatus && !bool) {
        roundOfGame();
    } else if (!interceptionStatus && bool) {//Truthy bool arg, indicates player intercepted the positive pick-up.
        powerUpPickup();
    }
}


//Call when player intercepts the pick-up img, to add lives and score, then remove it.
function powerUpPickup() {
    livesElement.innerHTML =`Resistance: ${(_livesNo+=5)}`;
    scoreElement.innerHTML = `Score: ${(_scoreNo+=80)}`;
    powerUpElement.style.display = 'none';
    powerUpElement.style.top = `${Math.floor(Math.random() * $('#projectContainerArea').height()/$('#projectContainerArea').height()*100)}%`;
    powerUpElement.style.left = `${Math.floor(Math.random() * $('#projectContainerArea').width()/$('#projectContainerArea').width()*100)}%`;
}


//Class constructor. Properties/getters/setters any object instance will initially inherit. Use 'this' keyword to target each instanced object.
class enemyObject {
    constructor(obj) {
        this.object = obj;
        this._pixelsPerSecond = 250;
        this.currentPosition = {
            x: 0,
            y: 0
        };
        this._enemyObjectActive = false;
    }

    //Setter method which updates the '_pixelsPerSecond' property, which sets the animation speed of object.
    _setSpeed(speedPxs) {
        this._pixelsPerSecond = speedPxs;
    }

    //Getter method to return an object representing the container element dimensions.
    _getContainerDimensions() {
        return {
            'height': $('#projectContainerArea').height(),
            'width': $('#projectContainerArea').width()
        };
    }

    //Add get method, that returns a position as an (x,y) coordinate object.
    _generateNewPosition() {
        
        //Works out available area to plot a movement.
        let containerSize = this._getContainerDimensions();// An object is returned by the getter method, representing area values (height, width).
        let availableHeight = containerSize.height;
        let availableWidth = containerSize.width;
        // Produces a random x and a random y coordinate from the deduced available area, which is rounded down to the nearest integer.
        let y = Math.floor(Math.random() * availableHeight);
        let x = Math.floor(Math.random() * availableWidth);
        return {
            x: x,
            y: y
        };
    }

    //Add get method to calculate length to move (scalar returned).
    _calcDistance(a, b) {

        //Calc distance between current position a(x,y), and next position b(x,y). Access 'x' and 'y' props of 'a' and 'b' to work out diff between the two 'x' coords and two 'y' coords, which are then used to work out the distance between point 'a' and 'b'.
        let distanceX = a.x - b.x;
        let distanceY = a.y - b.y;
        let distanceXY = Math.sqrt(distanceX * distanceX + distanceY * distanceY);//Pythagoras' Theorem: c = (a^2 + b^2)^0.5
        return distanceXY;
    }

    //Add method to set movement pos and speed, for the object, applied via CSS attributes. Each call is one random movement.
    moveObject() {
        let nextPoint = this._generateNewPosition();//Returns (x,y) coords object.
        let distance = this._calcDistance(this.currentPosition, nextPoint);//Returns scalar length.
        let speed = Math.round((distance / this._pixelsPerSecond) * 100) / 100;//Speed to 2 d.p.
        this.object.style.transition = 'transform ' + speed + 's linear';
        this.object.style.transform = 'translate3d(' + nextPoint.x + 'px, ' + nextPoint.y + 'px, 0)';
        //Set new position as new current position, ready to call again and provide a new starting point.
        this.currentPosition = nextPoint;
    }

    //Begin and keep object in motion, as well as set other elements CSS props, for simultaneous mechanics.
    start() {
        if (this._enemyObjectActive) {
            return;
        }

        this.object.style.display = 'block';
        this.object.pointerEvents = 'auto';
        playerIcon.style.display = 'block';
        
        this.object.willChange = 'transform';//Precaution the browser/user agent of the expected change on our object, for optimization.

        //Creates new function that is bound to our object, by using the 'this' keyword as both argument and parameter for new bound func.
        this.boundEvent = this.moveObject.bind(this);

        // Bind callback to keep it all moving.
        this.object.addEventListener('transitionend', this.boundEvent);
        
        this.moveObject();//Move object once to begin an instance for the event listener.
        this._enemyObjectActive = true;
    }

    //Stop objects, and hide all necessary icons.
    stop() {
        if (!this._enemyObjectActive) {
            return;
        }

        this.object.style.display = 'none';
        this.object.pointerEvents = 'none';
        powerUpElement.style.display = 'none';
        playerIcon.style.display = 'none';
        
        this.object.removeEventListener('transitionend', this.boundEvent);//Stop constant motion of object.

        this._enemyObjectActive = false;
    }
}

// Init objects, with initial property value pairs, and pass both the target element, and the area for the resulting object to move.
var objectA = new enemyObject(document.getElementById('objectA'), window);
var objectB = new enemyObject(document.getElementById('objectB'), window);