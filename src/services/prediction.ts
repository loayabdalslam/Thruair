import * as brain from 'brain.js';

export class StockPredictor {
  private network: brain.recurrent.LSTMTimeStep;
  private normalizedData: number[];
  private min: number;
  private max: number;

  constructor() {
    this.network = new brain.recurrent.LSTMTimeStep({
      inputSize: 1,
      hiddenLayers: [8, 8],
      outputSize: 1
    });
  }

  normalize(data: number[]): number[] {
    this.min = Math.min(...data);
    this.max = Math.max(...data);
    return data.map(x => (x - this.min) / (this.max - this.min));
  }

  denormalize(value: number): number {
    return value * (this.max - this.min) + this.min;
  }

  async train(data: number[]): Promise<void> {
    this.normalizedData = this.normalize(data);
    
    return new Promise((resolve) => {
      this.network.train([this.normalizedData], {
        learningRate: 0.005,
        errorThresh: 0.02,
        iterations: 1000
      });
      resolve();
    });
  }

  predict(steps: number): number[] {
    const forecast = this.network.forecast(
      this.normalizedData,
      steps
    );
    
    return forecast.map(value => this.denormalize(value));
  }
}