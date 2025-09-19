import React from 'react';

export const pulseContainerStyles: React.CSSProperties = {
  width: 'fit-content',
  border: 'dotted 0.5px #DDDDDD',
  margin: '7px',
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '4px',
  fontFamily: 'var(--pega-font-family, "Open Sans", Arial, sans-serif)'
};

export const pulseHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
};

export const pulseHeaderTitleStyles: React.CSSProperties = {
  margin: '0',
  fontSize: '16px',
  fontWeight: '600',
  color: 'var(--pega-color-text-primary, #333)'
};

export const pulseRefreshButtonStyles: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: '12px',
  backgroundColor: 'var(--pega-color-primary, #007bff)',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export const pulseEmptyStateStyles: React.CSSProperties = {
  padding: '20px',
  textAlign: 'center',
  color: '#6c757d',
  fontStyle: 'italic',
  fontSize: '14px'
};

export const pulseMessageStyles: React.CSSProperties = {
  marginBottom: '12px',
  backgroundColor: '#ffffff',
  border: '1px solid #e9ecef',
  borderRadius: '6px'
};

export const pulseMessageContentStyles: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: 'var(--pega-color-text-primary, #333)',
  wordWrap: 'break-word'
};

export const pulseMessageMetaStyles: React.CSSProperties = {
  fontSize: '12px',
  color: '#6c757d',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '6px'
};

export const pulseMessageActionsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
  marginTop: '8px'
};

export const pulseActionButtonStyles: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: '11px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#495057'
};

export const pulseAttachmentUploadStyles: React.CSSProperties = {
  marginBottom: '16px',
  padding: '12px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: '4px'
};

export const pulseFileInputStyles: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '4px',
  fontSize: '12px',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  backgroundColor: '#fff'
};

export const pulseSelectedFileStyles: React.CSSProperties = {
  marginBottom: '8px',
  padding: '8px',
  backgroundColor: '#e7f3ff',
  border: '1px solid #b3d7ff',
  borderRadius: '4px',
  fontSize: '12px'
};

export const pulseUploadButtonStyles: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export const pulseDebugInfoStyles: React.CSSProperties = {
  marginBottom: '12px',
  padding: '8px',
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '4px',
  fontSize: '12px',
  fontFamily: 'monospace'
};

export const pulseStatusInfoStyles: React.CSSProperties = {
  marginTop: '12px',
  padding: '8px',
  backgroundColor: '#e9ecef',
  borderRadius: '4px',
  fontSize: '12px'
};

// Utility function to get upload message styles based on status
export const getUploadMessageStyles = (status: 'idle' | 'uploading' | 'success' | 'error'): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    marginBottom: '8px',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px',
    border: '1px solid'
  };

  switch (status) {
    case 'error':
      return {
        ...baseStyles,
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        color: '#721c24'
      };
    case 'success':
      return {
        ...baseStyles,
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
        color: '#155724'
      };
    case 'uploading':
      return {
        ...baseStyles,
        backgroundColor: '#d1ecf1',
        borderColor: '#bee5eb',
        color: '#0c5460'
      };
    default:
      return {
        ...baseStyles,
        backgroundColor: '#fff3cd',
        borderColor: '#ffeaa7',
        color: '#856404'
      };
  }
};