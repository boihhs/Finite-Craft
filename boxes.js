

let lives = 3
let boxes = [];
let restart = false;

var relationshipsToWord = {
    "bull,dog": "bulldog",
    "dog,muscular": "bulldog",
    "mug,sour": "bulldog",
    "citric,lemon": "sour",
    "bark,pet": "dog",
    "strip,tree": "bark",
    "club,money": "strip",
    "cup,handle": "mug",
    "horns,rodeo": "bull",
    "gym,protien": "muscular",
    "animal,tamed": "pet",
    "seed,sun": "tree",
    "container,water": "cup"
};

var reversedRelationships = {};

for (var key in relationshipsToWord) {
    var word = relationshipsToWord[key];
    if (reversedRelationships.hasOwnProperty(word)) {
        reversedRelationships[word].push(key);
    } else {
        reversedRelationships[word] = [key];
    }
}

class MovableBox {

    constructor(text, x, y) {
        this.text = text;
        this.calledOnce = false
        this.createBox(x, y);
        this.addEventListeners();
        this.updateBoxData();
        boxes.push(this);
    }

    createBox(x, y) {

        this.box = document.createElement('div');
        this.box.classList.add('draggable');
        this.box.textContent = this.text;
        document.body.appendChild(this.box);
        this.box.style.left = x + 'px';
        this.box.style.top = y + 'px';
    }

    addEventListeners() {
        this.box.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    onMouseDown(event) {
        if(this.box.textContent == "restart" || this.box.textContent == "play"){
            this.destroy();
            if (boxes.length > 0 ){
                boxes[0].destroy();
            }
            playGame();
            
            
        }
        else {
            this.isDragging = true;
            this.offsetX = event.clientX - this.box.getBoundingClientRect().left;
            this.offsetY = event.clientY - this.box.getBoundingClientRect().top;
            this.calledOnce = false;
        }
        

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseMove(event) {
        if (this.isDragging) {
            const newX = event.clientX - this.offsetX;
            const newY = event.clientY - this.offsetY;

            this.box.style.left = newX + 'px';
            this.box.style.top = newY + 'px';
            this.updateBoxData();
            
        }
    }

    onMouseUp(event) {
        if(!this.calledOnce) {
            this.isDragging = false;
            
            
            document.removeEventListener('mousemove', this.onMouseMove.bind(this));
            document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    
            checkCollisions();
            this.calledOnce = true;
        }
    }

    updateBoxData() {
        this.boxData = {
            top: this.box.offsetTop,
            left: this.box.offsetLeft,
            width: this.box.offsetWidth,
            height: this.box.offsetHeight
        };
    }

    destroy() {
        document.body.removeChild(this.box);
        const index = boxes.indexOf(this);
        if (index !== -1) {
            boxes.splice(index, 1);
        }
    }

   
}

function spawnBox(text, x, y) {
    
    new MovableBox(text,x,y);
}

function checkCollisions() {  
    var livesDiv = document.getElementById("lives");
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            if (isColliding(boxes[i], boxes[j])) {
                console.log('Collision detected!');
                texts = []
                texts.push(boxes[i].box.textContent);
                texts.push(boxes[j].box.textContent);
                texts.sort();
                if (relationshipsToWord.hasOwnProperty(texts[0]+","+texts[1])) {
                    boxes[i].box.textContent = relationshipsToWord[texts[0]+","+texts[1]];
                    boxes[i].box.classList.add("animateGreen")
                    boxes[j].destroy();
                    if (boxes[i].box.textContent == "bulldog") {
                        
                        
                        livesDiv.innerHTML = "You win";
                        spawnBox("restart", 750, 250);
                        lives = 3;
                    }

                }
                else {
                    boxes[i].box.classList.add("animateRed")
                    boxes[j].box.classList.add("animateRed")
                    lives = lives - 1;
                    
                    if (lives == 0) {
                        livesDiv.innerHTML = "Game Over";
                        for (let e = boxes.length -1; e >= 0; e--) {
                            console.log(boxes)
                            
                            boxes[e].destroy();
                        }
                        
                        boxes = []
                        spawnBox("restart", 750, 250);
                        lives = 3;
                    }
                    else {
                        livesDiv.innerHTML = "Lives left: " + lives;
                    }
                    
                }
                break;
            }
        }
    }
}

function isColliding(box1, box2) {
    return !(
        box1.box.offsetTop + box1.box.offsetHeight < box2.box.offsetTop ||
        box1.box.offsetTop > box2.box.offsetTop + box2.box.offsetHeight ||
        box1.box.offsetLeft + box1.box.offsetWidth < box2.box.offsetLeft ||
        box1.box.offsetLeft > box2.box.offsetLeft + box2.box.offsetWidth
    );
}



function getWords(reversedRelationships, totalWords) {
    var words = [];
    var choice = reversedRelationships["bulldog"];
    var randomIndex = Math.floor(Math.random() * choice.length);
    var randomElement = choice[randomIndex];
    var array = randomElement.split(",");
    words.push(array[0]);
    words.push(array[1]);
    
    while (words.length < totalWords) {
        
        randomIndex = Math.floor(Math.random() * words.length);
        randomElement = words[randomIndex];
        if (reversedRelationships.hasOwnProperty(randomElement)){
            words.splice(randomIndex,1);
            choice = reversedRelationships[randomElement];
            
            randomIndex = Math.floor(Math.random() * choice.length);
            randomElement = choice[randomIndex];
            
            array = randomElement.split(",");
            words.push(array[0]);
            words.push(array[1]);
           
        }
    }
    return words;

}




function playGame(){
    lives = 3;
    var livesDiv = document.getElementById("lives");
    livesDiv.innerHTML = "Lives left: " + lives;
    boxes = []
    allWords = getWords(reversedRelationships, 5);
    for (let i = 0; i< allWords.length; i++){
        const x = Math.floor(Math.random() * (1500));
        const y = Math.floor(Math.random() * (500));
        spawnBox(allWords[i], x, y);
        
    }
}

spawnBox("play", 750, 250);








