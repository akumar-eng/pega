import { useMemo } from 'react';
import { withConfiguration, Text } from '@pega/cosmos-react-core';

// PConnect Props interface for Pega Constellation components
export interface PConnFieldProps {
  getPConnect?: () => any;
  value?: any;
  validatemessage?: string;
  label?: string;
  hideLabel?: boolean;
  helperText?: string;
  testId?: string;
  additionalProps?: Record<string, any>;
  displayMode?: string;
  variant?: string;
  hasSuggestions?: boolean;
}

type DisplayDateProps = PConnFieldProps & {
  value?: string | Date | number;
  dateFormat?: string;
  showTime?: boolean;
  timeFormat?: '12' | '24';
  locale?: string;
  emptyValueDisplay?: string;
  getPConnect: any;
};

// Enhanced date formatting function with time support
const formatDate = (
  dateValue: string | Date | number, 
  format: string = 'dd/mm/yyyy',
  showTime: boolean = false,
  timeFormat: '12' | '24' = '12',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: string = 'en-US' // Available for future internationalization features
): string => {
  if (!dateValue) return '';

  try {
    let date: Date;
    
    if (dateValue instanceof Date) {
      date = dateValue;
    } else if (!Number.isNaN(Number(dateValue))) {
      date = new Date(Number(dateValue));
    } else {
      const dateStr = String(dateValue);
      // Handle ISO date strings properly to avoid timezone issues
      if (dateStr.includes('T') || dateStr.includes('Z')) {
        date = new Date(dateStr);
      } else {
        // For date-only strings, parse as local date to avoid timezone shifts
        const parts = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (parts) {
          date = new Date(parseInt(parts[1], 10), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10));
        } else {
          date = new Date(dateStr);
        }
      }
    }

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let dateStr = '';
    switch (format) {
      case 'mm/dd/yyyy':
        dateStr = `${month}/${day}/${year}`;
        break;
      case 'yyyy-mm-dd':
        dateStr = `${year}-${month}-${day}`;
        break;
      case 'dd-mm-yyyy':
        dateStr = `${day}-${month}-${year}`;
        break;
      case 'mm-dd-yyyy':
        dateStr = `${month}-${day}-${year}`;
        break;
      case 'yyyy/mm/dd':
        dateStr = `${year}/${month}/${day}`;
        break;
      case 'dd.mm.yyyy':
        dateStr = `${day}.${month}.${year}`;
        break;
      default:
        dateStr = `${day}/${month}/${year}`;
    }

    if (showTime) {
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      if (timeFormat === '12') {
        let displayHours = hours === 0 ? 12 : hours;
        if (hours > 12) {
          displayHours = hours - 12;
        }
        const ampm = hours >= 12 ? 'PM' : 'AM';
        dateStr += ` ${displayHours}:${minutes} ${ampm}`;
      } else {
        const displayHours = String(hours).padStart(2, '0');
        dateStr += ` ${displayHours}:${minutes}`;
      }
    }

    return dateStr;
  } catch (error) {
    return String(dateValue);
  }
};

const LHCExtensionsDisplayDate = (props: DisplayDateProps) => {
  const {
    value,
    dateFormat = 'dd/mm/yyyy',
    showTime = false,
    timeFormat = '12',
    locale = 'en-US',
    emptyValueDisplay = '-',
    testId,
    getPConnect,
    label,
    hideLabel,
    helperText,
    variant,
    displayMode,
    validatemessage,
    hasSuggestions,
    additionalProps,
    ...restProps
  } = props;

  // Get the actual value from PConnect if available
  const pConn = getPConnect?.();
  const actualValue = value || pConn?.getValue?.() || '';

  const formattedDate = useMemo(() => {
    if (!actualValue || (typeof actualValue === 'string' && actualValue.trim() === '')) {
      return emptyValueDisplay;
    }

    return formatDate(actualValue, dateFormat, showTime, timeFormat, locale);
  }, [actualValue, dateFormat, showTime, timeFormat, locale, emptyValueDisplay]);

  // Only pass through valid DOM props, excluding custom component props
  const domProps = Object.keys(restProps).reduce((acc, key) => {
    // Allow standard HTML attributes but exclude our custom props
    const customProps = ['showTime', 'timeFormat', 'locale', 'emptyValueDisplay', 'hideLabel', 'variant'];
    if (!customProps.includes(key)) {
      (acc as any)[key] = (restProps as any)[key];
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <div data-testid={testId} style={{ fontFamily: 'inherit' }} {...domProps}>
      <Text variant='primary' style={{ fontFamily: 'inherit' }}>
        {formattedDate}
      </Text>
    </div>
  );
};

export default withConfiguration(LHCExtensionsDisplayDate);