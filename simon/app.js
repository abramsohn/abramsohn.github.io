class Simon {
    constructor() {
        this.buttons = {
            green: {
                buttonNode: document.querySelector('#greenButton'),
                soundFrequency: 392.0
            },
            red: {
                buttonNode: document.querySelector('#redButton'),
                soundFrequency: 293.7
            },
            yellow: {
                buttonNode: document.querySelector('#yellowButton'),
                soundFrequency: 329.6
            },
            blue: {
                buttonNode: document.querySelector('#blueButton'),
                soundFrequency: 440.0
            },
        }

        this.buttonsArray = [this.buttons.green, this.buttons.red, this.buttons.yellow, this.buttons.blue]
        
        // Selectors // 
        this.greenButton = document.querySelector('#greenButton'); 
        this.redButton = document.querySelector('#redButton'); 
        this.yellowButton = document.querySelector('#yellowButton'); 
        this.blueButton = document.querySelector('#blueButton'); 
        
        this.lastButton = document.querySelector('#lastButton');
        this.startButton = document.querySelector('#startButton')
        this.longestButton = document.querySelector('#longestButton');
        this.longestCounter = document.querySelector('#longestCounter');
        this.moveCounter = document.querySelector('#moveCounter');
        
        // this.simonMove = this.generateSimonMove() // TODO: check for a better place to store this
    
        // Sound //
        this.audioContext = new AudioContext()

        // State //
        this.speed = 1500;
        this.delay = 1500;
        
        // this.timeCounter = 5;
        this.playerSequenceCounter = 0;
        this.simonSequence = [];
        this.longestSequence = [];
    }

    // Methods //
    setup() { // TODO: chack if this can run automaticly on instantiation
        this.setEventHandelers();
        
        const storedSequence = this.getStateFromLocalSorage();
        if (storedSequence) {
            // this.longestCounter.innerText = `Record: ${storedSequence.simon}`
        } else if (this.longestSequence.length > 0) {
            this.longestCounter.innerText = `${this.longestSequence.length}`
        }
        
    }

    setStateToLocalSorage(sequence) {
        const storage = window.localStorage;
        storage.setItem('simonRecord', JSON.stringify(sequence));
    }

    getStateFromLocalSorage() {
        const storage = window.localStorage;
        const record = storage.getItem('simonRecord', this.longestSequence);
        if (record) {
            this.longestSequence =  JSON.parse(record);
        }

    }

    startGame() {
        this.resetState()
        this.generateSimonMove();
        this.displaySequence(this.simonSequence, this.speed ,100);
    }
    
    setEventHandelers() {
        this.startButton.addEventListener('click', () => { this.startGame() });
        this.lastButton.addEventListener('click', () => {
            this.displaySequence(this.simonSequence, this.speed, this.delay)
        });
        this.longestButton.addEventListener('click', () => {
            this.displaySequence(this.longestSequence, 500, 500);
        });
        this.greenButton.addEventListener('click', this.handleClickOnGreen);
        this.greenButton.addEventListener('click', () => { this.handlePlayerMove(this.buttons.green) });
        this.redButton.addEventListener('click', () => { this.handlePlayerMove(this.buttons.red) });
        this.yellowButton.addEventListener('click', () => { this.handlePlayerMove(this.buttons.yellow) });
        this.blueButton.addEventListener('click', () => { this.handlePlayerMove(this.buttons.blue) });
    }

    generateSimonMove() {
        const randomNumber = Math.floor(Math.random() * this.buttonsArray.length);
        this.simonSequence.push(this.buttonsArray[randomNumber]);
    }

    handlePlayerMove(pressedButton) {
        if (!this.simonSequence.length) {
            this.handleError();
            return false;
        }
        
        
        this.playerSequenceCounter++;
        
        // Correct player move:
        if (pressedButton == this.simonSequence[this.playerSequenceCounter - 1]) {
            this.handleMove(pressedButton.buttonNode, pressedButton.soundFrequency, 1500)
            
            // Start Over when reaching the last move of the current sequence 
            if (this.playerSequenceCounter == this.simonSequence.length) {
                this.generateSimonMove();
                this.changeLevel();
                this.displaySequence(this.simonSequence, this.speed ,this.delay);
                this.playerSequenceCounter = 0;
            }
        // Wrong Player move:
        } else {
            this.handleLose();
        }
    }

    handleMove(pressedButton, soundFrequency, speed) {


        pressedButton.classList.add('clicked');
        this.generateSound(soundFrequency, "triangle", (speed / 1000), 0.2);
        // this.playerSequence.push(pressedButton)
        setTimeout(() => {
            pressedButton.classList.remove('clicked');
        }, speed - 100); // Remove the class faster so  it will still light up if the same button go twice
    }

    displaySequence(sequenceArray, speed, delay) {
        let index = 0;
        if (!sequenceArray.length || !(sequenceArray[0].buttonNode instanceof Element)) { // TODO: this is a quick fix to solve local storage nested object problem, need to find a permanent fix
            this.handleError();
        } else {
            this.toggleButtonsState();
            setTimeout(() => {
                const intervalId = setInterval(() => {
                    this.handleMove(sequenceArray[index].buttonNode, sequenceArray[index].soundFrequency, speed)
                    this.moveCounter.innerText = `${sequenceArray.length}`
                    index++;
                    if (index === sequenceArray.length) {
                        clearInterval(intervalId);
                        this.toggleButtonsState(delay - 100);
                    }
                }, delay);
                
            }, delay);
        }
    }

    toggleButtonsState(delay = 0) {
        setTimeout(() => {
            this.buttonsArray.forEach(button => {
                button.buttonNode.classList.toggle('disable');
            });
        }, delay);
    }

    changeLevel() {
        switch (this.playerSequenceCounter) {
            case 5:
                this.speed = 1100;
                this.delay = 1100;
                break;
            case 9:
                this.speed = 800;
                this.delay = 800;
                break;
            case 13:
                this.speed = 500;
                this.delay = 500;
                break;
            default:
                break;
        }
    }

    // displayLongestSequence() {
    //     this.displaySequence(this.longestSequence, 1500, 1500, );
    //     this.resetState();
    // }

    handleLose() {
        // store the sequence if it is the longest so far
        if (this.simonSequence.length - 1 > this.longestSequence.length) {
            this.longestSequence = this.simonSequence.splice(0, this.simonSequence.length - 1);
            this.longestCounter.innerText = `${this.longestSequence.length}`
            this.setStateToLocalSorage(this.longestSequence);
        }

        this.simonSequence = [];
        const keys = Object.keys(simon.buttons)
         const intervalId = setInterval(() => {
            keys.forEach(key => {
                this.buttons[key].buttonNode.classList.toggle('clicked');
                this.generateSound(174.6, "square", 0.6, 0.02);
                this.moveCounter.innerText = `${this.simonSequence.length}`;
            });
        }, 200);
        

        setTimeout(() => {
            keys.forEach(key => {
                const currentStyle = this.buttons[key].buttonNode.classList;
                if (currentStyle == 'clicked') {
                    currentStyle.remove('clicked');
                }
            });
            clearInterval(intervalId);
        }, 1800);
    }

    handleError() {
        const keys = Object.keys(simon.buttons)
        keys.forEach(key => { // TODO refactore to use the buttons arra
            this.buttons[key].buttonNode.classList.add('clicked');
            this.generateSound(174.6, "square", 0.6, 0.02);
            setTimeout(() => {
                this.buttons[key].buttonNode.classList.remove('clicked');
            }, 550);
         });
    }

    resetState() {
        this.simonSequence = [];
        this.playerSequenceCounter = 0;
    }

    //frequency in Hz, type can be sine, square, triangle, and sawtooth, ducation in secounds 
    generateSound(frequency, type, duration, volume) {    
        let oscillator = this.audioContext.createOscillator()
        let gainNode = this.audioContext.createGain()
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.value = volume;
        oscillator.type = type;
        oscillator.frequency.value = frequency;

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
}

simon = new Simon();
simon.setup();