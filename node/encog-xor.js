var ENCOG = require('encog-node');

//var XOR_INPUT = [
//    [0, 0],
//    [1, 0],
//    [0, 1],
//    [1, 1]
//];
var XOR_INPUT = [
    [0],
    [1],
    [5],
    [10]
];

var XOR_IDEAL = [
    [5],
    [8],
    [20],
    [35]
];

var network = ENCOG.BasicNetwork.create( [
    ENCOG.BasicLayer.create(ENCOG.ActivationLinear.create(), 1, 1),
    ENCOG.BasicLayer.create(ENCOG.ActivationLinear.create(), 3, 3),
    //ENCOG.BasicLayer.create(ENCOG.ActivationSigmoid.create(), 3, 1),
    //ENCOG.BasicLayer.create(ENCOG.ActivationTANH.create(), 3, 1),
    ENCOG.BasicLayer.create(ENCOG.ActivationLinear.create(), 1, 0)
] );

network.randomize();

var train = ENCOG.PropagationTrainer.create(network, XOR_INPUT, XOR_IDEAL, "BPROP", 0, 0);

var iteration = 1;

do {
    train.iteration();
    var trainResultString = "Training Iteration #" + iteration + ", Error: " + train.error;
    console.log(trainResultString + "\n");
    iteration++;
} while (iteration < 1000 && train.error > 0.001);

var input = [20];
var output = [];

console.log("Testing neural network: \n");

for (var i=0;i<XOR_INPUT.length;i++) {
    network.compute(XOR_INPUT[i],output);
    var testResultString = "Input: " + String(XOR_INPUT[i][0]) +
        //" ; " + String(XOR_INPUT[i][1]) +
        "   Output: " + String(output[0]) +
        "   Ideal: " + String(XOR_IDEAL[i][0]);
    console.log(testResultString + "\n");
}

var arr = [];
network.compute(input, arr);
console.log(arr[0]);