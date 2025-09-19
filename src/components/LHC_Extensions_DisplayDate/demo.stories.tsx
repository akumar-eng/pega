import type { StoryObj } from '@storybook/react';
import { LHCExtensionsDisplayDate } from './index';

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
      description: 'Date value to display'
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
      description: 'Whether to show time'
    },
    timeFormat: {
      control: 'select',
      options: ['12', '24'],
      description: 'Time format (12 or 24 hour)'
    },
    locale: {
      control: 'select',
      options: ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT'],
      description: 'Locale for time formatting'
    },
    emptyValueDisplay: {
      control: 'text',
      description: 'Text to display when value is empty'
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
    emptyValueDisplay: '-'
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
    emptyValueDisplay: 'No date provided'
  }
};
