export type KioskConfig = {
  BackgroundImage: string;
  StartTitle: string;
  StartReminder: string;
  NumberTitle: string;
  NumberMin: string; // will be parsed as number
  NumberMax: string; // will be parsed as number
  NumberSpinDuration: string; // ms
  FlipPage: string;
  NumberOfBtn: string; // parsed as number
  NumberOfEvents: string; // parsed as number
  SkippedNumbers: string;
};

export type ButtonConfig = {
  name: string;
  link: string;
};

export type EventConfig = {
  name: string;
  venue: string;
  date: string;
  link: string;
  image: string;
};

export type SheetAPIResponse = {
  config: KioskConfig;
  buttons: ButtonConfig[];
  events: EventConfig[];
};
