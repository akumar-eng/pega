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
  getPConnect: any;
};

// Simple date formatting function
const formatDate = (dateValue: string | Date | number, format: string = 'dd/mm/yyyy'): string => {
  if (!dateValue) return '';

  try {
    let date: Date;
    
    if (dateValue instanceof Date) {
      date = dateValue;
    } else if (!Number.isNaN(Number(dateValue))) {
      date = new Date(Number(dateValue));
    } else {
      date = new Date(String(dateValue));
    }

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'mm/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-mm-dd':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  } catch (error) {
    return String(dateValue);
  }
};

const LHCExtensionsDisplayDate = (props: DisplayDateProps) => {
  const {
    value,
    dateFormat = 'dd/mm/yyyy',
    testId,
    getPConnect,
    ...otherProps
  } = props;

  // Get the actual value from PConnect if available
  const pConn = getPConnect?.();
  const actualValue = value || pConn?.getValue?.() || '';

  const formattedDate = useMemo(() => {
    if (!actualValue || (typeof actualValue === 'string' && actualValue.trim() === '')) {
      return '-';
    }

    return formatDate(actualValue, dateFormat);
  }, [actualValue, dateFormat]);

  return (
    <div data-testid={testId} style={{ fontFamily: 'inherit' }} {...otherProps}>
      <Text variant='primary' style={{ fontFamily: 'inherit' }}>
        {formattedDate}
      </Text>
    </div>
  );
};

export default withConfiguration(LHCExtensionsDisplayDate);