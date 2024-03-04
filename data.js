var relationshipsToWord = {
    "bull,dog": "bulldog",
    "dog,muscular": "bulldog",
    "mug,sour": "bulldog",
    "bark,pet": "dog",
    "strip,tree": "bark",
    "cup,handle": "mug"
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
console.log(getWords(reversedRelationships, 3));

