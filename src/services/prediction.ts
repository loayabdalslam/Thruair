import * as tf from '@tensorflow/tfjs';

export class StockPredictor {
  private model: tf.LayersModel;
  private min: number;
  private max: number;

  constructor() {
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 50,
          inputShape: [30, 1],
          returnSequences: true
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({
          units: 50,
          returnSequences: false
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
  }

  private normalize(data: number[]): number[] {
    this.min = Math.min(...data);
    this.max = Math.max(...data);
    return data.map(x => (x - this.min) / (this.max - this.min));
  }

  private denormalize(value: number): number {
    return value * (this.max - this.min) + this.min;
  }

  private createSequences(data: number[], lookback: number = 30): [tf.Tensor, tf.Tensor] {
    const X = [];
    const y = [];
    
    for (let i = 0; i < data.length - lookback; i++) {
      X.push(data.slice(i, i + lookback));
      y.push(data[i + lookback]);
    }

    return [
      tf.tensor3d(X, [X.length, lookback, 1]),
      tf.tensor2d(y, [y.length, 1])
    ];
  }

  async train(data: number[]): Promise<void> {
    const normalizedData = this.normalize(data);
    const [X, y] = this.createSequences(normalizedData);

    await this.model.fit(X, y, {
      epochs: 50,
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.1,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          console.log(`Epoch ${epoch + 1} - loss: ${logs?.loss.toFixed(4)}`);
        }
      }
    });

    // Clean up tensors
    X.dispose();
    y.dispose();
  }

  async predict(data: number[], steps: number): Promise<number[]> {
    const normalizedData = this.normalize(data);
    const predictions: number[] = [];
    let currentInput = normalizedData.slice(-30);

    for (let i = 0; i < steps; i++) {
      const inputTensor = tf.tensor3d([currentInput], [1, 30, 1]);
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const predictedValue = (await prediction.data())[0];
      
      predictions.push(this.denormalize(predictedValue));
      currentInput = [...currentInput.slice(1), predictedValue];

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();
    }

    return predictions;
  }

  dispose(): void {
    this.model.dispose();
  }
}