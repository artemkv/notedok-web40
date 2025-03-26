export enum EventType {
  // "Never" event is never triggered in the app
  // this is just to make TS happy
  Never,
}

export interface NeverEvent {
  type: EventType.Never;
}

export type AppEvent = NeverEvent;
