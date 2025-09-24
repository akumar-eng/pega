import localizations from './localizations.json';

// Type definitions for utility functions
export interface PulseMessage {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  actions?: string[];
  attachments?: PulseAttachment[];
  priority?: 'low' | 'medium' | 'high';
  status?: 'read' | 'unread';
}

export interface PulseAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface PulseConfiguration {
  dataSource: string;
  messageProperty: string;
  authorProperty: string;
  timestampProperty: string;
  maxMessages: number;
  variant: 'default' | 'compact' | 'detailed';
  showTimestamp: boolean;
  showAuthor: boolean;
  showActions: boolean;
}

// Utility functions
export class PulseUtils {
  
  /**
   * Get localized text for the pulse component
   * @param key - The localization key
   * @param locale - The locale (defaults to 'en')
   * @param params - Parameters to replace in the localized text
   * @returns Localized text
   */
  static getLocalizedText(key: string, locale: string = 'en', params: string[] = []): string {
    try {
      const keys = key.split('.');
      let value: any = (localizations as any)[locale];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if key not found in requested locale
          value = localizations.en;
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              return key; // Return key if not found
            }
          }
          break;
        }
      }
      
      if (typeof value === 'string') {
        // Replace parameters {0}, {1}, etc.
        return params.reduce((text, param, index) => {
          return text.replace(new RegExp(`\\{${index}\\}`, 'g'), param);
        }, value);
      }
      
      return key;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error getting localized text for key:', key, error);
      return key;
    }
  }

  /**
   * Format timestamp for display
   * @param timestamp - The timestamp to format
   * @param locale - The locale for formatting
   * @returns Formatted timestamp string
   */
  static formatTimestamp(timestamp: string | Date, locale: string = 'en'): string {
    try {
      const date = new Date(timestamp);
      
      // Check if date is valid
      if (Number.isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      // Format based on locale
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };

      return date.toLocaleString(locale, options);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error formatting timestamp:', timestamp, error);
      return timestamp.toString();
    }
  }

  /**
   * Format file size for display
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Validate file based on allowed types and size limits
   * @param file - The file to validate
   * @param allowedTypes - Comma-separated list of allowed file extensions
   * @param maxSize - Maximum file size in bytes
   * @param locale - Locale for error messages
   * @returns Validation result with success flag and error message
   */
  static validateFile(
    file: File, 
    allowedTypes: string, 
    maxSize: number, 
    locale: string = 'en'
  ): { isValid: boolean; error?: string } {
    
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024);
      return {
        isValid: false,
        error: this.getLocalizedText('pulse.upload.fileSizeError', locale, [maxSizeMB.toString()])
      };
    }

    // Check file type
    const allowedTypesArray = allowedTypes.split(',').map(type => type.trim().toLowerCase());
    const nameParts = file.name.split('.');
    const fileExtension = nameParts.length > 1 ? `.${nameParts[nameParts.length - 1]?.toLowerCase()}` : '';

    if (!allowedTypesArray.includes(fileExtension)) {
      return {
        isValid: false,
        error: this.getLocalizedText('pulse.upload.fileTypeError', locale, [allowedTypes])
      };
    }

    return { isValid: true };
  }

  /**
   * Extract property value from a data object using a property path
   * @param data - The data object
   * @param propertyPath - The property path (e.g., '.Message', '.Author.Name')
   * @returns The extracted value or null if not found
   */
  static extractProperty(data: any, propertyPath: string): any {
    if (!data || !propertyPath) return null;

    try {
      // Remove leading dot if present
      const path = propertyPath.startsWith('.') ? propertyPath.substring(1) : propertyPath;
      
      // Split path and traverse object
      const keys = path.split('.');
      let value = data;

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return null;
        }
      }

      return value;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error extracting property:', propertyPath, error);
      return null;
    }
  }

  /**
   * Sort pulse messages by timestamp (newest first)
   * @param messages - Array of pulse messages
   * @param timestampProperty - Property path for timestamp
   * @returns Sorted array of messages
   */
  static sortMessagesByTimestamp(messages: any[], timestampProperty: string): any[] {
    try {
      return [...messages].sort((a, b) => {
        const timestampA = this.extractProperty(a, timestampProperty) || a.timestamp;
        const timestampB = this.extractProperty(b, timestampProperty) || b.timestamp;
        
        const dateA = new Date(timestampA).getTime();
        const dateB = new Date(timestampB).getTime();
        
        return dateB - dateA; // Newest first
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error sorting messages:', error);
      return messages;
    }
  }

  /**
   * Filter and limit pulse messages
   * @param messages - Array of pulse messages
   * @param maxMessages - Maximum number of messages to return
   * @param filterFn - Optional filter function
   * @returns Filtered and limited array of messages
   */
  static limitMessages(
    messages: any[], 
    maxMessages: number, 
    filterFn?: (message: any) => boolean
  ): any[] {
    try {
      let filtered = messages;
      
      if (filterFn) {
        filtered = messages.filter(filterFn);
      }
      
      return filtered.slice(0, maxMessages);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error limiting messages:', error);
      return messages.slice(0, maxMessages);
    }
  }

  /**
   * Generate mock pulse data for testing and demos
   * @param count - Number of mock messages to generate
   * @returns Array of mock pulse messages
   */
  static generateMockData(count: number = 3): PulseMessage[] {
    const mockMessages: PulseMessage[] = [];
    const sampleMessages = [
      'Customer case updated with new requirements',
      'New assignment available for review',
      'Document uploaded to case folder',
      'Status changed to In Progress',
      'Comment added by team member',
      'Priority escalation requested',
      'Approval workflow completed',
      'System notification: Data sync completed'
    ];
    
    const sampleAuthors = ['John Smith', 'Jane Doe', 'System', 'Mike Johnson', 'Sarah Wilson'];
    const sampleActions = [
      ['View', 'Reply'],
      ['Accept', 'Decline'],
      ['Download', 'View'],
      ['Edit', 'Delete'],
      ['Approve', 'Reject']
    ];

    for (let i = 0; i < count; i += 1) {
      const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      const randomAuthor = sampleAuthors[Math.floor(Math.random() * sampleAuthors.length)];
      const randomActions = sampleActions[Math.floor(Math.random() * sampleActions.length)];
      
      // Determine priority based on message index
      let priority: 'high' | 'medium' | 'low';
      if (i === 0) {
        priority = 'high';
      } else if (i === 1) {
        priority = 'medium';
      } else {
        priority = 'low';
      }

      mockMessages.push({
        id: (i + 1).toString(),
        message: randomMessage,
        author: randomAuthor,
        timestamp: new Date(Date.now() - (i * 300000)).toISOString(), // 5 minutes apart
        actions: randomActions,
        priority,
        status: i < 2 ? 'unread' : 'read'
      });
    }

    return mockMessages;
  }

  /**
   * Debounce function for performance optimization
   * @param func - Function to debounce
   * @param wait - Wait time in milliseconds
   * @returns Debounced function
   */
  static debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Check if the component is in development mode
   * @returns True if in development mode
   */
  static isDevelopmentMode(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Log debug information if in development mode
   * @param message - Debug message
   * @param data - Optional data to log
   */
  static debugLog(message: string, data?: any): void {
    if (this.isDevelopmentMode()) {
      if (data) {
        // eslint-disable-next-line no-console
        console.log(`LHC_Extensions_Pulse: ${message}`, data);
      } else {
        // eslint-disable-next-line no-console
        console.log(`LHC_Extensions_Pulse: ${message}`);
      }
    }
  }

  /**
   * Get display variant specific configuration
   * @param variant - Display variant
   * @returns Configuration object for the variant
   */
  static getVariantConfig(variant: 'default' | 'compact' | 'detailed') {
    const configs = {
      default: {
        messageStyle: { padding: '12px' },
        contentStyle: { fontSize: '14px' },
        showBorder: true,
        showActions: true
      },
      compact: {
        messageStyle: { padding: '8px' },
        contentStyle: { fontSize: '13px' },
        showBorder: false,
        showActions: false
      },
      detailed: {
        messageStyle: { padding: '12px', borderLeft: '4px solid #007bff' },
        contentStyle: { fontSize: '14px' },
        showBorder: true,
        showActions: true
      }
    };

    return configs[variant] || configs.default;
  }
}