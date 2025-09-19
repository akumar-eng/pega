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
  // Configuration Props
  messageIDs?: string;
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
    messageIDs = '',
    showTimestamp = true,
    maxMessages = 10,
    enableRefresh = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refreshInterval = 30000,
    emptyText = 'No pulse messages available',
    headerText = 'Pulse Feed',
    variant = 'default',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showAuthor = true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      messageIDs,
      showTimestamp,
      maxMessages,
      enableRefresh,
      variant
    });
  }

  // Handle pulse message data
  const handlePulseData = () => {
    if (isDebugMode) {
      // eslint-disable-next-line no-console
      console.log('LHC_Extensions_Pulse: handlePulseData called');
    }

    // TODO: Implement actual pulse data fetching logic
    // This would typically involve:
    // 1. Fetching data using messageIDs property
    // 2. Processing pulse messages
    // 3. Handling refresh logic if enabled

    return [];
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
        formData.append('messageID', messageIDs || '');

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
        <div className='pulse-empty-state'>
          <p>{emptyText}</p>
        </div>
      );
    }

    // TODO: Implement actual pulse message rendering based on variant
    switch (variant) {
      case 'compact':
        return <div className='pulse-compact'>Compact pulse view (to be implemented)</div>;
      case 'detailed':
        return <div className='pulse-detailed'>Detailed pulse view (to be implemented)</div>;
      default:
        return <div className='pulse-default'>Default pulse view (to be implemented)</div>;
    }
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
            <strong>Message IDs:</strong> {messageIDs || 'Not configured'}
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
