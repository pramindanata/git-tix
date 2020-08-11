import nodeStan from 'node-nats-streaming';
import {} from './constant';
import { Event as IEvent } from './interface';

export abstract class Publisher<Event extends IEvent> {
  private stan: nodeStan.Stan;
  abstract readonly subject: Event['subject'];

  constructor(stan: nodeStan.Stan) {
    this.stan = stan;
  }

  publish(data: Event['data']): Promise<Event['subject']> {
    const parsedData = this.parseDataToStr(data);

    return new Promise((resolve, reject) => {
      this.stan.publish(this.subject, parsedData, (err) => {
        if (err) {
          return reject(err);
        }

        console.log(`${this.subject} event published`);

        return resolve();
      });
    });
  }

  private parseDataToStr(data: Event['data']): string {
    return JSON.stringify(data);
  }
}
