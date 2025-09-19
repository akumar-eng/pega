import type { Meta, StoryObj } from '@storybook/react';
import LhcExtensionsPulse from './index';

const meta: Meta<typeof LhcExtensionsPulse> = {
  title: 'Widgets/Pulse Feed',
  component: LhcExtensionsPulse,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    dataSource: {
      control: 'text',
      description: 'Data page or property for pulse messages'
    },
    messageProperty: {
      control: 'text',
      description: 'Property path for individual pulse messages'
    },
    authorProperty: {
      control: 'text',
      description: 'Property path for message author'
    },
    timestampProperty: {
      control: 'text',
      description: 'Property path for message timestamp'
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
    },
    enableAttachmentUpload: {
      control: 'boolean',
      description: 'Enable attachment upload functionality'
    },
    allowedFileTypes: {
      control: 'text',
      description: 'Comma-separated list of allowed file extensions'
    },
    maxFileSize: {
      control: { type: 'number', min: 1024, max: 52428800 },
      description: 'Maximum file size in bytes'
    },
    uploadEndpoint: {
      control: 'text',
      description: 'API endpoint for file uploads'
    },
    attachmentLabel: {
      control: 'text',
      description: 'Label for the attachment upload button'
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
    dataSource: 'D_PulseMessages',
    messageProperty: '.Message',
    authorProperty: '.Author',
    timestampProperty: '.Timestamp',
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
    dataSource: '',
    emptyText: 'No activity to display at this time'
  }
};

export const CustomConfiguration: Story = {
  args: {
    ...Default.args,
    headerText: 'Custom Pulse Configuration',
    dataSource: 'D_CustomPulseData',
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
    dataSource: 'D_SimplePulse',
    getPConnect: mockGetPConnect
  } as any
};

export const WithAttachmentUpload: Story = {
  args: {
    ...Default.args,
    headerText: 'Pulse Feed with File Upload',
    enableAttachmentUpload: true,
    allowedFileTypes: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif',
    maxFileSize: 5242880, // 5MB
    attachmentLabel: 'Attach File',
    uploadEndpoint: '', // Demo mode
    showActions: true
  }
};

export const AttachmentUploadCustom: Story = {
  args: {
    ...Default.args,
    headerText: 'Custom Upload Configuration',
    enableAttachmentUpload: true,
    allowedFileTypes: '.pdf,.docx,.xlsx,.pptx',
    maxFileSize: 10485760, // 10MB
    attachmentLabel: 'Upload Document',
    uploadEndpoint: '/api/upload',
    variant: 'detailed',
    showActions: true,
    enableRefresh: true
  }
};

export const AttachmentUploadImageOnly: Story = {
  args: {
    ...Default.args,
    headerText: 'Image Upload Only',
    enableAttachmentUpload: true,
    allowedFileTypes: '.jpg,.jpeg,.png,.gif,.webp',
    maxFileSize: 2097152, // 2MB
    attachmentLabel: 'Upload Image',
    uploadEndpoint: '',
    variant: 'compact',
    showTimestamp: true
  }
};

export const FullFeatured: Story = {
  args: {
    ...Default.args,
    headerText: 'Full-Featured Pulse Feed',
    variant: 'detailed',
    showTimestamp: true,
    showAuthor: true,
    showActions: true,
    enableRefresh: true,
    enableAttachmentUpload: true,
    allowedFileTypes: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.csv',
    maxFileSize: 10485760, // 10MB
    attachmentLabel: 'Add Attachment',
    uploadEndpoint: '/api/pulse/upload',
    maxMessages: 8
  }
};
