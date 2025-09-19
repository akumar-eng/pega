import type { StoryObj } from '@storybook/react';
import LHCExtensionsDisplayDate from './index';

export default {
  title: 'Fields/Display Date',
  argTypes: {
    getPConnect: {
      table: {
        disable: true
      }
    },
    value: {
      control: 'text',
      description: 'Date value to display (string, timestamp, or Date object)'
    },
    dateFormat: {
      control: 'select',
      options: [
        'dd/mm/yyyy',
        'mm/dd/yyyy',
        'yyyy-mm-dd',
        'dd-mm-yyyy',
        'mm-dd-yyyy',
        'yyyy/mm/dd',
        'dd.mm.yyyy'
      ],
      description: 'Date format pattern'
    },
    showTime: {
      control: 'boolean',
      description: 'Whether to show time component'
    },
    timeFormat: {
      control: 'select',
      options: ['12', '24'],
      description: 'Time format (12 or 24 hour)'
    },
    locale: {
      control: 'select',
      options: ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'ja-JP', 'zh-CN'],
      description: 'Locale for date and time formatting'
    },
    emptyValueDisplay: {
      control: 'text',
      description: 'Text to display when value is empty'
    },
    label: {
      control: 'text',
      description: 'Field label text'
    },
    hideLabel: {
      control: 'boolean',
      description: 'Hide the field label'
    },
    helperText: {
      control: 'text',
      description: 'Additional help text'
    },
    testId: {
      control: 'text',
      description: 'Test identifier'
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Display variant'
    }
  },
  component: LHCExtensionsDisplayDate
};

const mockGetPConnect = () => {
  return {
    getStateProps: () => ({}),
    getConfigProps: () => ({})
  };
};

type Story = StoryObj<typeof LHCExtensionsDisplayDate>;

export const Default: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-09-19',
    dateFormat: 'dd/mm/yyyy',
    showTime: false,
    timeFormat: '12',
    locale: 'en-US',
    emptyValueDisplay: '-',
    label: 'Date Field',
    hideLabel: false,
    variant: 'default'
  }
};

export const USFormat: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-09-19',
    dateFormat: 'mm/dd/yyyy',
    showTime: false,
    timeFormat: '12',
    locale: 'en-US',
    emptyValueDisplay: '-'
  }
};

export const ISOFormat: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-09-19T14:30:00',
    dateFormat: 'yyyy-mm-dd',
    showTime: false,
    timeFormat: '12',
    locale: 'en-US',
    emptyValueDisplay: '-'
  }
};

export const WithTime12Hour: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-09-19T14:30:00',
    dateFormat: 'dd/mm/yyyy',
    showTime: true,
    timeFormat: '12',
    locale: 'en-US',
    emptyValueDisplay: '-'
  }
};

export const WithTime24Hour: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-09-19T14:30:00',
    dateFormat: 'dd/mm/yyyy',
    showTime: true,
    timeFormat: '24',
    locale: 'en-US',
    emptyValueDisplay: '-'
  }
};

export const GermanFormat: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-09-19T14:30:00',
    dateFormat: 'dd.mm.yyyy',
    showTime: true,
    timeFormat: '24',
    locale: 'de-DE',
    emptyValueDisplay: '-'
  }
};

export const EmptyValue: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '',
    dateFormat: 'dd/mm/yyyy',
    showTime: false,
    timeFormat: '12',
    locale: 'en-US',
    emptyValueDisplay: 'No date provided',
    label: 'Optional Date',
    variant: 'default'
  }
};

export const WithLabel: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-09-19T14:30:00',
    dateFormat: 'mm/dd/yyyy',
    showTime: true,
    timeFormat: '12',
    locale: 'en-US',
    label: 'Event Date & Time',
    hideLabel: false,
    helperText: 'This shows the scheduled event date and time',
    variant: 'detailed'
  }
};

export const CompactVariant: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-09-19',
    dateFormat: 'dd/mm/yyyy',
    showTime: false,
    label: 'Created Date',
    hideLabel: false,
    variant: 'compact',
    testId: 'created-date-field'
  }
};

export const NoLabel: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: mockGetPConnect
    };
    return <LHCExtensionsDisplayDate {...props} />;
  },
  args: {
    value: '2025-12-25T00:00:00',
    dateFormat: 'dd/mm/yyyy',
    showTime: false,
    label: 'Hidden Label',
    hideLabel: true,
    variant: 'default'
  }
};
