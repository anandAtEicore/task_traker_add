declare module 'react-native-dates' {
    import { Moment } from 'moment';
    import { ViewProps } from 'react-native';
  
    interface DatesProps extends ViewProps {
      onDatesChange: (props: {
        startDate?: Moment;
        endDate?: Moment;
        focusedInput: 'startDate' | 'endDate';
      }) => void;
      isDateBlocked?: (date: Moment) => boolean;
      startDate?: Moment;
      endDate?: Moment;
      focusedInput?: 'startDate' | 'endDate';
      range?: boolean;
      date?: Moment;
    }
  
    const Dates: React.ComponentType<DatesProps>;
    export default Dates;
  }