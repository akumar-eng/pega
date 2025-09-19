import React, { useState, useRef } from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';

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

// Component's local type definition
export interface PulseProps extends PConnFieldProps {
  // Data Source Props
  dataSource?: string;
  messageProperty?: string;
  authorProperty?: string;
  timestampProperty?: string;

  // Configuration Props
  showTimestamp?: boolean;
  maxMessages?: number;
  enableRefresh?: boolean;
  refreshInterval?: number;

  // Display Props
  emptyText?: string;
  headerText?: string;

  // Styling Props
  variant?: 'default' | 'compact' | 'detailed';
  showAuthor?: boolean;
  showActions?: boolean;

  // Attachment Upload Props
  enableAttachmentUpload?: boolean;
  allowedFileTypes?: string;
  maxFileSize?: number;
  uploadEndpoint?: string;
  attachmentLabel?: string;

  // Required Pega Connection
  getPConnect?: () => any;
}

function LhcExtensionsPulse(props: PulseProps) {
  const {
    // Data Source Props
    dataSource = 'D_PulseMessages',
    messageProperty = '.Message',
    authorProperty = '.Author',
    timestampProperty = '.Timestamp',
    
    // Configuration Props
    showTimestamp = true,
    maxMessages = 10,
    enableRefresh = false,
    refreshInterval = 30000,
    emptyText = 'No pulse messages available',
    headerText = 'Pulse Feed',
    variant = 'default',
    showAuthor = true,
    showActions = false,
    // Attachment Upload Props
    enableAttachmentUpload = false,
    allowedFileTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif',
    maxFileSize = 5242880, // 5MB in bytes
    uploadEndpoint = '',
    attachmentLabel = 'Attach File',
    getPConnect,
    ...otherProps
  } = props;

  // Get PConnect object
  const pConn = getPConnect?.();

  // State for attachment upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle'
  );
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for debugging
  const isDebugMode = process.env.NODE_ENV === 'development';

  // Log component initialization in debug mode
  if (isDebugMode) {
    // eslint-disable-next-line no-console
    console.log('LHC_Extensions_Pulse: constructor', {
      dataSource,
      messageProperty,
      authorProperty,
      timestampProperty,
      showTimestamp,
      maxMessages,
      enableRefresh,
      variant
    });
  }

  // Mock pulse data for demonstration
  const mockPulseData = [
    {
      id: '1',
      message: 'Customer case updated by John Smith',
      author: 'John Smith',
      timestamp: new Date().toISOString(),
      actions: ['View', 'Reply']
    },
    {
      id: '2', 
      message: 'New assignment available for review',
      author: 'System',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      actions: ['Accept', 'Decline']
    },
    {
      id: '3',
      message: 'Document uploaded to case folder',
      author: 'Jane Doe',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      actions: ['Download', 'View']
    }
  ];

  // Handle pulse message data
  const handlePulseData = () => {
    if (isDebugMode) {
      // eslint-disable-next-line no-console
      console.log('LHC_Extensions_Pulse: handlePulseData called');
    }

    try {
      // In a real implementation, this would fetch data from the dataSource
      // For now, return mock data limited by maxMessages
      const limitedData = mockPulseData.slice(0, maxMessages);
      
      if (pConn && dataSource && isDebugMode) {
        // TODO: Implement actual data fetching
        // const data = pConn.getValue(dataSource);
        // Process and return the actual data
        // eslint-disable-next-line no-console
        console.log('LHC_Extensions_Pulse: Would fetch from dataSource:', dataSource);
      }
      
      return limitedData;
    } catch (error) {
      if (isDebugMode) {
        // eslint-disable-next-line no-console
        console.error('LHC_Extensions_Pulse: Error fetching pulse data:', error);
      }
      return [];
    }
  };

  // Handle refresh functionality
  const handleRefresh = () => {
    if (isDebugMode) {
      // eslint-disable-next-line no-console
      console.log('LHC_Extensions_Pulse: handleRefresh called');
    }

    // TODO: Implement refresh logic
    handlePulseData();
  };

  // Helper functions for upload message styling
  const getUploadMessageBackgroundColor = (status: string): string => {
    if (status === 'error') return '#f8d7da';
    if (status === 'success') return '#d4edda';
    return '#fff3cd';
  };

  const getUploadMessageBorderColor = (status: string): string => {
    if (status === 'error') return '#f5c6cb';
    if (status === 'success') return '#c3e6cb';
    return '#ffeaa7';
  };

  // File validation helper
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds maximum allowed size of ${Math.round(maxFileSize / 1024 / 1024)}MB`;
    }

    // Check file type
    const allowedTypes = allowedFileTypes.split(',').map(type => type.trim().toLowerCase());
    const nameParts = file.name.split('.');
    const fileExtension =
      nameParts.length > 1 ? `.${nameParts[nameParts.length - 1]?.toLowerCase()}` : '';

    if (!allowedTypes.includes(fileExtension)) {
      return `File type not allowed. Allowed types: ${allowedFileTypes}`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const validationError = validateFile(file);

      if (validationError) {
        setUploadStatus('error');
        setUploadMessage(validationError);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setUploadStatus('idle');
      setUploadMessage('');

      if (isDebugMode) {
        // eslint-disable-next-line no-console
        console.log('LHC_Extensions_Pulse: File selected:', file.name);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setUploadMessage('Uploading...');

    try {
      if (uploadEndpoint) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('dataSource', dataSource || '');
        formData.append('messageProperty', messageProperty || '');

        // Simulate API call (replace with actual implementation)
        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          setUploadStatus('success');
          setUploadMessage('File uploaded successfully!');
          setSelectedFile(null);

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

          // Trigger refresh if enabled
          if (enableRefresh) {
            handleRefresh();
          }
        } else {
          throw new Error('Upload failed');
        }
      } else {
        // Mock successful upload for demo purposes
        setTimeout(() => {
          setUploadStatus('success');
          setUploadMessage('File uploaded successfully! (Demo mode - no actual upload)');
          setSelectedFile(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
      }

      if (isDebugMode) {
        // eslint-disable-next-line no-console
        console.log('LHC_Extensions_Pulse: File upload completed');
      }
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Upload failed. Please try again.');

      if (isDebugMode) {
        // eslint-disable-next-line no-console
        console.error('LHC_Extensions_Pulse: Upload error:', error);
      }
    }
  };

  // Clear upload status
  const clearUploadStatus = () => {
    setUploadStatus('idle');
    setUploadMessage('');
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render different variants
  const renderPulseContent = () => {
    const pulseData = handlePulseData();

    if (pulseData.length === 0) {
      return (
        <div 
          className='pulse-empty-state'
          style={{
            padding: '20px',
            textAlign: 'center',
            color: '#6c757d',
            fontStyle: 'italic'
          }}
        >
          <p>{emptyText}</p>
        </div>
      );
    }

    // Render pulse messages based on variant
    return (
      <div className={`pulse-messages pulse-variant-${variant}`}>
        {pulseData.map((message: any, index: number) => {
          return (
            <div
              key={message.id || index}
              className='pulse-message'
              style={{
                marginBottom: '12px',
                padding: variant === 'compact' ? '8px' : '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                borderLeft: variant === 'detailed' ? '4px solid #007bff' : undefined
              }}
            >
              {/* Message Content */}
              <div 
                className='pulse-message-content'
                style={{
                  fontSize: variant === 'compact' ? '13px' : '14px',
                  lineHeight: '1.4',
                  marginBottom: showAuthor || showTimestamp ? '6px' : '0'
                }}
              >
                {message.message || message[messageProperty] || 'No message content'}
              </div>

              {/* Author and Timestamp */}
              {(showAuthor || showTimestamp) && (
                <div 
                  className='pulse-message-meta'
                  style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: showActions ? '8px' : '0'
                  }}
                >
                  {showAuthor && (
                    <span className='pulse-author'>
                      By {message.author || message[authorProperty] || 'Unknown'}
                    </span>
                  )}
                  {showTimestamp && (
                    <span className='pulse-timestamp'>
                      {new Date(message.timestamp || message[timestampProperty] || Date.now()).toLocaleString()}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              {showActions && message.actions && (
                <div 
                  className='pulse-message-actions'
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap'
                  }}
                >
                  {message.actions.map((action: string, actionIndex: number) => (
                    <button
                      key={actionIndex}
                      type='button'
                      onClick={() => {
                        if (isDebugMode) {
                          // eslint-disable-next-line no-console
                          console.log(`Action clicked: ${action} on message ${message.id}`);
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#495057'
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Main render
  return (
    <div
      className={`pulse-component pulse-variant-${variant}`}
      {...otherProps}
      style={{
        width: 'fit-content',
        border: 'dotted 0.5px #DDDDDD',
        margin: '7px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}
    >
      {headerText && (
        <div className='pulse-header'>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
            {headerText}
          </h3>
          {enableRefresh && (
            <button
              type='button'
              onClick={handleRefresh}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          )}
        </div>
      )}

      {/* Attachment Upload Section */}
      {enableAttachmentUpload && (
        <div
          className='pulse-attachment-upload'
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <label
              htmlFor='pulse-file-input'
              style={{
                display: 'block',
                fontWeight: '500',
                marginBottom: '4px',
                fontSize: '14px'
              }}
            >
              {attachmentLabel}
            </label>
            <input
              id='pulse-file-input'
              ref={fileInputRef}
              type='file'
              accept={allowedFileTypes}
              onChange={handleFileSelect}
              style={{
                display: 'block',
                width: '100%',
                padding: '4px',
                fontSize: '12px',
                border: '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>

          {selectedFile && (
            <div
              style={{
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: '#e7f3ff',
                border: '1px solid #b3d7ff',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <strong>Selected:</strong> {selectedFile.name} ({Math.round(selectedFile.size / 1024)}
              KB)
            </div>
          )}

          {uploadMessage && (
            <div
              style={{
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: getUploadMessageBackgroundColor(uploadStatus),
                border: `1px solid ${getUploadMessageBorderColor(uploadStatus)}`,
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {uploadMessage}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type='button'
              onClick={handleFileUpload}
              disabled={!selectedFile || uploadStatus === 'uploading'}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor:
                  selectedFile && uploadStatus !== 'uploading' ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: selectedFile && uploadStatus !== 'uploading' ? 'pointer' : 'not-allowed'
              }}
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
            </button>

            {(selectedFile || uploadMessage) && (
              <button
                type='button'
                onClick={clearUploadStatus}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div
            style={{
              marginTop: '8px',
              fontSize: '11px',
              color: '#6c757d'
            }}
          >
            Max file size: {Math.round(maxFileSize / 1024 / 1024)}MB | Allowed types:{' '}
            {allowedFileTypes}
          </div>
        </div>
      )}

      <div className='pulse-content'>
        {isDebugMode && (
          <div
            style={{
              marginBottom: '12px',
              padding: '8px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <strong>Development Mode:</strong> LHC_Extensions_Pulse component
            <br />
            <strong>Data Source:</strong> {dataSource || 'Not configured'}
            <br />
            <strong>Message Property:</strong> {messageProperty || 'Not configured'}
            <br />
            <strong>Max Messages:</strong> {maxMessages}
            <br />
            <strong>Show Timestamp:</strong> {showTimestamp ? 'Yes' : 'No'}
            <br />
            <strong>Attachment Upload:</strong> {enableAttachmentUpload ? 'Enabled' : 'Disabled'}
            {enableAttachmentUpload && (
              <>
                <br />
                <strong>Upload Endpoint:</strong> {uploadEndpoint || 'Demo mode (no endpoint)'}
                <br />
                <strong>Max File Size:</strong> {Math.round(maxFileSize / 1024 / 1024)}MB
              </>
            )}
          </div>
        )}

        {renderPulseContent()}

        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          <strong>Status:</strong> Component structure ready - business logic needs implementation
          <br />
          <strong>Next Steps:</strong> Implement pulse message fetching, rendering, and real-time
          updates
        </div>
      </div>
    </div>
  );
}

// Create the connected component
const ConnectedPulse = withConfiguration(LhcExtensionsPulse);

// Export both named and default
export { ConnectedPulse as LHC_Extensions_Pulse };
export default ConnectedPulse;
