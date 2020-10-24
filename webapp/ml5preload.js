let classifier;
let img;
function preload() {
    classifier = ml5.imageClassifier('MobileNet');
}


function preload() {
    classifier = ml5.imageClassifier('MobileNet');
    img = loadImage('images/bird.png');
}

function setup() {
    classifier.classify(img, (oRes) => {
        console.log(oRes);
    });
}