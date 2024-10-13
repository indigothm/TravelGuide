export interface Destination {
    name: string;
    image: string;
    description: string;
    location: {
      latitude: number;
      longitude: number;
    };
    suggestedTravelDates: string[];
  }
  
  export type RootStackParamList = {
    Home: undefined;
    Detail: { destination: Destination };
  };