import type { Meta, StoryObj } from '@storybook/react';
import LhcExtensionsPulse from './index';

const meta: Meta<typeof LhcExtensionsPulse> = {
  title: 'LHC Extensions/Pulse Feed',
  component: LhcExtensionsPulse,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    messageIDs: {
      control: 'text',
      description: 'Property path for pulse message IDs'
    },
    showTimestamp: {
      control: 'boolean',
      description: 'Display timestamp for each pulse message'
    },
    maxMessages: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Maximum number of pulse messages to display'
    },
    enableRefresh: {
      control: 'boolean',
      description: 'Allow manual refresh of pulse messages'
    },
    refreshInterval: {
      control: { type: 'number', min: 5000, max: 300000 },
      description: 'Auto-refresh interval in milliseconds'
    },
    emptyText: {
      control: 'text',
      description: 'Text to display when no messages are available'
    },
    headerText: {
      control: 'text',
      description: 'Header text for the pulse feed'
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Choose the display style for pulse messages'
    },
    showAuthor: {
      control: 'boolean',
      description: 'Display author information for each message'
    },
    showActions: {
      control: 'boolean',
      description: 'Display action buttons for each message'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock getPConnect function for Storybook
const mockGetPConnect = () => ({
  getValue: (property: string) => `Mock value for ${property}`,
  setValue: (property: string, value: any) => console.log(`Setting ${property} to`, value),
  setProperty: (property: string, value: any) =>
    console.log(`Setting property ${property} to`, value)
});

export const Default: Story = {
  args: {
    messageIDs: '.PulseMessages',
    showTimestamp: true,
    maxMessages: 10,
    enableRefresh: false,
    emptyText: 'No pulse messages available',
    headerText: 'Pulse Feed',
    variant: 'default',
    showAuthor: true,
    showActions: false,
    getPConnect: mockGetPConnect
  } as any
};

export const CompactView: Story = {
  args: {
    ...Default.args,
    headerText: 'Activity Feed - Compact',
    variant: 'compact',
    showTimestamp: false,
    showAuthor: false,
    maxMessages: 20
  }
};

export const DetailedView: Story = {
  args: {
    ...Default.args,
    headerText: 'Pulse Feed - Detailed View',
    variant: 'detailed',
    showTimestamp: true,
    showAuthor: true,
    showActions: true,
    enableRefresh: true,
    maxMessages: 5
  }
};

export const WithRefresh: Story = {
  args: {
    ...Default.args,
    headerText: 'Auto-Refreshing Feed',
    enableRefresh: true,
    refreshInterval: 15000,
    showActions: true
  }
};

export const EmptyState: Story = {
  args: {
    ...Default.args,
    headerText: 'Empty Pulse Feed',
    messageIDs: '',
    emptyText: 'No activity to display at this time'
  }
};

export const CustomConfiguration: Story = {
  args: {
    ...Default.args,
    headerText: 'Custom Pulse Configuration',
    messageIDs: '.CustomPulseData',
    maxMessages: 15,
    showTimestamp: true,
    showAuthor: true,
    showActions: true,
    enableRefresh: true,
    refreshInterval: 30000,
    variant: 'detailed',
    emptyText: 'Your custom pulse feed is empty'
  }
};

export const MinimalSetup: Story = {
  args: {
    messageIDs: '.SimplePulse',
    getPConnect: mockGetPConnect
  } as any
};
