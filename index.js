const tf = require('@tensorflow/tfjs');

const trainLR = async (featureCount, trainingData, testingData) => {
    const model = tf.sequential();
    model.add(
        tf.layers.dense({
            units: 2,
            activation: "softmax",
            inputShape: [featureCount]
        })
    );
    

}