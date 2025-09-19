import { useMemo } from 'react';
import { withConfiguration, Text } from '@pega/cosmos-react-core';
import '../create-nonce';

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
  variant?: 'default' | 'compact' | 'detailed';
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
    else if (!Number.isNaN(Number(dateValue))) {
      date = new Date(Number(dateValue));
    }
    // If it's a string
    else {
      date = new Date(dateValue);
    }

    // Check if date is valid
    if (Number.isNaN(date.getTime())) {
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
    label,
    hideLabel = false,
    helperText,
    testId,
    variant = 'default',
    getPConnect,
    ...otherProps
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

  // Determine styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return { fontSize: '12px', padding: '2px 4px' };
      case 'detailed':
        return { fontSize: '16px', padding: '8px', fontWeight: '500' };
      default:
        return { fontSize: '14px' };
    }
  };

  return (
    <div data-testid={testId} style={{ fontFamily: 'inherit' }} {...otherProps}>
      {!hideLabel && label && (
        <div
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#333'
          }}
        >
          {label}
        </div>
      )}

      <Text
        variant='primary'
        style={{
          fontFamily: 'inherit',
          ...getVariantStyles()
        }}
      >
        {formattedDate}
      </Text>

      {helperText && (
        <div
          style={{
            fontSize: '11px',
            color: '#666',
            marginTop: '2px'
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default withConfiguration(LHCExtensionsDisplayDate);
