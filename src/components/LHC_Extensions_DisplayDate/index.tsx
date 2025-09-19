import { useMemo } from 'react';
import { withConfiguration, Text } from '@pega/cosmos-react-core';
import '../create-nonce';

type DisplayDateProps = {
  value: string;
  dateFormat?: string;
  showTime?: boolean;
  timeFormat?: '12' | '24';
  locale?: string;
  emptyValueDisplay?: string;
  getPConnect: any;
};

// Helper function to format date based on the specified format
const formatDate = (
  dateValue: string | Date | number,
  format: string = 'dd/mm/yyyy',
  showTime: boolean = false,
  timeFormat: '12' | '24' = '12',
  locale: string = 'en-US'
): string => {
  if (!dateValue) return '';

  try {
    // Parse the date - handle various input formats
    let date: Date;
    
    // If it's already a Date object
    if (dateValue instanceof Date) {
      date = dateValue;
    }
    // If it's a timestamp
    else if (!isNaN(Number(dateValue))) {
      date = new Date(Number(dateValue));
    }
    // If it's a string
    else {
      date = new Date(dateValue);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return String(dateValue); // Return original value if parsing fails
    }

    // Format based on the specified pattern
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const shortYear = year.slice(-2);

    let formattedDate = format
      .replace(/dd/g, day)
      .replace(/mm/g, month)
      .replace(/yyyy/g, year)
      .replace(/yy/g, shortYear);

    // Add time if requested
    if (showTime) {
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12'
      };
      
      const timeString = date.toLocaleTimeString(locale, options);
      formattedDate += ` ${timeString}`;
    }

    return formattedDate;
  } catch (error) {
    // If any error occurs, return the original value
    return String(dateValue);
  }
};

export const LHCExtensionsDisplayDate = (props: DisplayDateProps) => {
  const { 
    value, 
    dateFormat = 'dd/mm/yyyy', 
    showTime = false, 
    timeFormat = '12',
    locale = 'en-US',
    emptyValueDisplay = '-',
    getPConnect 
  } = props;

  const formattedDate = useMemo(() => {
    if (!value || value.trim() === '') {
      return emptyValueDisplay;
    }
    
    return formatDate(value, dateFormat, showTime, timeFormat, locale);
  }, [value, dateFormat, showTime, timeFormat, locale, emptyValueDisplay]);

  return (
    <Text variant="primary" style={{ fontFamily: 'inherit' }}>
      {formattedDate}
    </Text>
  );
};

export default withConfiguration(LHCExtensionsDisplayDate);