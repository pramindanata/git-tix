import {
  Publisher,
  Subject,
  ExpirationCompleteEvent,
} from '@teh-tix/common/pubsub'

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subject.ExpirationComplete
}
