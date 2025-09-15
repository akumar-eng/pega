import { useState, useRef, useCallback, useEffect } from 'react';
import {
  withConfiguration,
  registerIcon,
  Button,
  Icon,
  CardHeader,
  CardContent,
  Modal,
  Flex,
  Text,
  EmptyState,
  useModalManager,
  SummaryList,
  SummaryItem,
  Lightbox,
  Grid,
  getMimeTypeFromFile,
  useTheme,
  FieldGroup,
  FileVisual,
  getKindFromMimeType,
  type SummaryListItem,
  type ModalMethods,
  type ModalProps,
  type LightboxItem,
  type LightboxProps
} from '@pega/cosmos-react-core';
import { downloadBlob, addAttachment, downloadFile } from './utils';
import StyledCardContent, { StyledTable } from './styles';
import '../create-nonce';

import * as polarisIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/polaris.icon';
import * as informationIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/information.icon';
import * as clipboardIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/clipboard.icon';

import * as downloadIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/download.icon';
import * as uploadIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/upload.icon';
import * as timesIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/times.icon';
import * as trashIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/trash.icon';

import * as videoIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/play-solid.icon';
import * as audioIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/speaker-on-solid.icon';
import * as documentIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/filetype-text.icon';
import * as messageIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/mail-solid.icon';
import * as spreadsheetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/grid-solid.icon';
import * as presentationIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/slideshow-solid.icon';
import * as archiveIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/archive-solid.icon';
import * as pictureIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/picture-solid.icon';
import * as openIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/open.icon';
import * as paperClipIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/paper-clip.icon';
import * as arrowUpIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/arrow-up.icon';
import * as arrowDownIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/arrow-down.icon';

/* To register more icon, you need to import them as shown above */
registerIcon(
  polarisIcon,
  informationIcon,
  clipboardIcon,
  downloadIcon,
  uploadIcon,
  timesIcon,
  trashIcon,
  videoIcon,
  audioIcon,
  documentIcon,
  messageIcon,
  spreadsheetIcon,
  presentationIcon,
  archiveIcon,
  pictureIcon,
  openIcon,
  paperClipIcon,
  arrowUpIcon,
  arrowDownIcon
);

/**
 * LHC Display Attachments Component with Comprehensive MIME Type Support
 *
 * This component now includes extensive MIME type support based on Pega Core libraries:
 *
 * Supported File Categories:
 * - Document: PDF, Word (.doc/.docx/.docm/.dotx/.dotm), RTF, OpenDocument Text (.odt/.odg/.odf)
 * - Spreadsheet: Excel (.xls/.xlsx/.xlsm/.xlsb/.xltx/.xltm/.xlam), CSV, TSV, OpenDocument Spreadsheet (.ods)
 * - Presentation: PowerPoint (.ppt/.pptx/.pptm/.potx/.potm/.ppsx/.ppsm), OpenDocument Presentation (.odp)
 * - Email: Outlook Messages (.msg), Email Files (.eml), MBOX Archives (.mbox)
 * - Contact: vCard Files (.vcf), Outlook Contacts
 * - Calendar: iCalendar Files (.ics), Outlook Appointments (.vcs)
 * - Image: JPEG, PNG, GIF, BMP, WebP, SVG, TIFF, ICO
 * - Audio: MP3, WAV, OGG, AAC, M4A, WebM Audio
 * - Video: MP4, AVI, MOV, WebM Video, OGG Video
 * - Archive: ZIP, RAR, 7-Zip, GZIP, TAR
 * - Text: Plain Text (.txt), HTML, CSS, JavaScript, XML, Markdown (.md), YAML (.yml/.yaml), INI, Log files, README
 * - Data: JSON, XML, YAML configurations
 * - Application: Binary files, Executables, Java Archives
 *
 * Microsoft Office Complete Support:
 * - Word: .doc, .docx, .docm (macro-enabled), .dotx (template), .dotm (macro template)
 * - Excel: .xls, .xlsx, .xlsm (macro-enabled), .xlsb (binary), .xltx (template), .xltm (macro template), .xlam (add-in)
 * - PowerPoint: .ppt, .pptx, .pptm (macro-enabled), .potx (template), .potm (macro template), .ppsx (slideshow), .ppsm (macro slideshow)
 * - Outlook: .msg (messages), .eml (email), .mbox (archives), .vcf (contacts), .ics/.vcs (calendar)
 *
 * Text File Complete Support:
 * - Documents: .txt, .md, .readme, .log
 * - Data: .csv, .tsv, .json, .xml, .yaml, .yml, .ini
 * - Web: .html, .css, .js
 *
 * Features:
 * - Auto-categorization based on file MIME types
 * - Dynamic file accept filters based on configured categories
 * - Enhanced upload table with file type information
 * - Intelligent category assignment during file selection
 * - Support for all MIME types recognized by Pega Cosmos React Core
 * - Enterprise-grade Microsoft Office file support
 */

// Comprehensive MIME type definitions based on Pega Core libraries
const PEGA_SUPPORTED_MIME_TYPES = {
  // Document Types
  document: {
    // PDF Files
    'application/pdf': { extension: 'pdf', category: 'Document', description: 'PDF Document' },

    // Microsoft Word Files
    'application/msword': {
      extension: 'doc',
      category: 'Document',
      description: 'Microsoft Word Document (Legacy)'
    },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      extension: 'docx',
      category: 'Document',
      description: 'Microsoft Word Document (OpenXML)'
    },
    'application/vnd.ms-word.document.macroEnabled.12': {
      extension: 'docm',
      category: 'Document',
      description: 'Microsoft Word Macro-Enabled Document'
    },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template': {
      extension: 'dotx',
      category: 'Document',
      description: 'Microsoft Word Template'
    },
    'application/vnd.ms-word.template.macroEnabled.12': {
      extension: 'dotm',
      category: 'Document',
      description: 'Microsoft Word Macro-Enabled Template'
    },

    // Microsoft Excel Files
    'application/vnd.ms-excel': {
      extension: 'xls',
      category: 'Spreadsheet',
      description: 'Microsoft Excel Spreadsheet (Legacy)'
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      extension: 'xlsx',
      category: 'Spreadsheet',
      description: 'Microsoft Excel Spreadsheet (OpenXML)'
    },
    'application/vnd.ms-excel.sheet.macroEnabled.12': {
      extension: 'xlsm',
      category: 'Spreadsheet',
      description: 'Microsoft Excel Macro-Enabled Workbook'
    },
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12': {
      extension: 'xlsb',
      category: 'Spreadsheet',
      description: 'Microsoft Excel Binary Workbook'
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template': {
      extension: 'xltx',
      category: 'Spreadsheet',
      description: 'Microsoft Excel Template'
    },
    'application/vnd.ms-excel.template.macroEnabled.12': {
      extension: 'xltm',
      category: 'Spreadsheet',
      description: 'Microsoft Excel Macro-Enabled Template'
    },
    'application/vnd.ms-excel.addin.macroEnabled.12': {
      extension: 'xlam',
      category: 'Spreadsheet',
      description: 'Microsoft Excel Add-In'
    },

    // Microsoft PowerPoint Files
    'application/vnd.ms-powerpoint': {
      extension: 'ppt',
      category: 'Presentation',
      description: 'Microsoft PowerPoint Presentation (Legacy)'
    },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
      extension: 'pptx',
      category: 'Presentation',
      description: 'Microsoft PowerPoint Presentation (OpenXML)'
    },
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12': {
      extension: 'pptm',
      category: 'Presentation',
      description: 'Microsoft PowerPoint Macro-Enabled Presentation'
    },
    'application/vnd.openxmlformats-officedocument.presentationml.template': {
      extension: 'potx',
      category: 'Presentation',
      description: 'Microsoft PowerPoint Template'
    },
    'application/vnd.ms-powerpoint.template.macroEnabled.12': {
      extension: 'potm',
      category: 'Presentation',
      description: 'Microsoft PowerPoint Macro-Enabled Template'
    },
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow': {
      extension: 'ppsx',
      category: 'Presentation',
      description: 'Microsoft PowerPoint Slideshow'
    },
    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12': {
      extension: 'ppsm',
      category: 'Presentation',
      description: 'Microsoft PowerPoint Macro-Enabled Slideshow'
    },

    // Microsoft Outlook and Email Files
    'application/vnd.ms-outlook': {
      extension: 'msg',
      category: 'Email',
      description: 'Microsoft Outlook Message'
    },
    'message/rfc822': {
      extension: 'eml',
      category: 'Email',
      description: 'Email Message (RFC 822)'
    },
    'application/vnd.ms-outlook.item': {
      extension: 'msg',
      category: 'Email',
      description: 'Microsoft Outlook Item'
    },
    'application/mbox': {
      extension: 'mbox',
      category: 'Email',
      description: 'MBOX Email Archive'
    },
    'application/vnd.ms-outlook.contact': {
      extension: 'vcf',
      category: 'Contact',
      description: 'Outlook Contact (vCard)'
    },
    'text/vcard': {
      extension: 'vcf',
      category: 'Contact',
      description: 'vCard Contact File'
    },
    'application/vnd.ms-outlook.appointment': {
      extension: 'vcs',
      category: 'Calendar',
      description: 'Outlook Appointment'
    },
    'text/calendar': {
      extension: 'ics',
      category: 'Calendar',
      description: 'iCalendar File'
    },
    'application/vnd.ms-outlook.task': {
      extension: 'vcs',
      category: 'Calendar',
      description: 'Outlook Task'
    },

    // Other Document Formats
    'application/rtf': { extension: 'rtf', category: 'Document', description: 'Rich Text Format' },
    'application/vnd.oasis.opendocument.text': {
      extension: 'odt',
      category: 'Document',
      description: 'OpenDocument Text Document'
    },
    'application/vnd.oasis.opendocument.spreadsheet': {
      extension: 'ods',
      category: 'Spreadsheet',
      description: 'OpenDocument Spreadsheet'
    },
    'application/vnd.oasis.opendocument.presentation': {
      extension: 'odp',
      category: 'Presentation',
      description: 'OpenDocument Presentation'
    },
    'application/vnd.oasis.opendocument.graphics': {
      extension: 'odg',
      category: 'Document',
      description: 'OpenDocument Graphics'
    },
    'application/vnd.oasis.opendocument.formula': {
      extension: 'odf',
      category: 'Document',
      description: 'OpenDocument Formula'
    }
  },
  // Enhanced Text Types
  text: {
    // Plain Text Files
    'text/plain': { extension: 'txt', category: 'Text', description: 'Plain Text File' },
    'text/tab-separated-values': {
      extension: 'tsv',
      category: 'Text',
      description: 'Tab-Separated Values'
    },
    'text/csv': {
      extension: 'csv',
      category: 'Spreadsheet',
      description: 'Comma-Separated Values'
    },

    // Markup and Web Files
    'text/html': { extension: 'html', category: 'Text', description: 'HTML Document' },
    'text/css': { extension: 'css', category: 'Text', description: 'CSS Stylesheet' },
    'text/javascript': { extension: 'js', category: 'Text', description: 'JavaScript File' },
    'application/javascript': {
      extension: 'js',
      category: 'Text',
      description: 'JavaScript Application'
    },
    'text/xml': { extension: 'xml', category: 'Text', description: 'XML Document' },
    'application/xml': { extension: 'xml', category: 'Text', description: 'XML Application' },

    // Documentation Files
    'text/markdown': { extension: 'md', category: 'Text', description: 'Markdown Document' },
    'text/x-readme': { extension: 'readme', category: 'Text', description: 'README File' },

    // Configuration Files
    'application/json': { extension: 'json', category: 'Data', description: 'JSON Data File' },
    'text/yaml': { extension: 'yaml', category: 'Text', description: 'YAML Configuration' },
    'text/x-yaml': { extension: 'yml', category: 'Text', description: 'YAML Configuration' },
    'application/x-ini': {
      extension: 'ini',
      category: 'Text',
      description: 'INI Configuration File'
    },

    // Log Files
    'text/x-log': { extension: 'log', category: 'Text', description: 'Log File' }
  },
  // Image Types
  image: {
    'image/jpeg': { extension: 'jpg', category: 'Image', description: 'JPEG Image' },
    'image/png': { extension: 'png', category: 'Image', description: 'PNG Image' },
    'image/gif': { extension: 'gif', category: 'Image', description: 'GIF Image' },
    'image/bmp': { extension: 'bmp', category: 'Image', description: 'BMP Image' },
    'image/webp': { extension: 'webp', category: 'Image', description: 'WebP Image' },
    'image/svg+xml': { extension: 'svg', category: 'Image', description: 'SVG Vector Image' },
    'image/tiff': { extension: 'tiff', category: 'Image', description: 'TIFF Image' },
    'image/x-icon': { extension: 'ico', category: 'Image', description: 'Icon File' }
  },
  // Audio Types
  audio: {
    'audio/mpeg': { extension: 'mp3', category: 'Audio', description: 'MP3 Audio' },
    'audio/wav': { extension: 'wav', category: 'Audio', description: 'WAV Audio' },
    'audio/ogg': { extension: 'ogg', category: 'Audio', description: 'OGG Audio' },
    'audio/mp4': { extension: 'm4a', category: 'Audio', description: 'MP4 Audio' },
    'audio/webm': { extension: 'webm', category: 'Audio', description: 'WebM Audio' },
    'audio/aac': { extension: 'aac', category: 'Audio', description: 'AAC Audio' }
  },
  // Video Types
  video: {
    'video/mp4': { extension: 'mp4', category: 'Video', description: 'MP4 Video' },
    'video/avi': { extension: 'avi', category: 'Video', description: 'AVI Video' },
    'video/quicktime': { extension: 'mov', category: 'Video', description: 'QuickTime Video' },
    'video/x-msvideo': { extension: 'avi', category: 'Video', description: 'AVI Video' },
    'video/webm': { extension: 'webm', category: 'Video', description: 'WebM Video' },
    'video/ogg': { extension: 'ogv', category: 'Video', description: 'OGG Video' }
  },
  // Archive Types
  archive: {
    'application/zip': { extension: 'zip', category: 'Archive', description: 'ZIP Archive' },
    'application/x-rar-compressed': {
      extension: 'rar',
      category: 'Archive',
      description: 'RAR Archive'
    },
    'application/x-7z-compressed': {
      extension: '7z',
      category: 'Archive',
      description: '7-Zip Archive'
    },
    'application/gzip': { extension: 'gz', category: 'Archive', description: 'GZIP Archive' },
    'application/x-tar': { extension: 'tar', category: 'Archive', description: 'TAR Archive' }
  },
  // Application Types
  application: {
    'application/json': { extension: 'json', category: 'Data', description: 'JSON Data' },
    'application/xml': { extension: 'xml', category: 'Data', description: 'XML Data' },
    'application/octet-stream': { extension: 'bin', category: 'File', description: 'Binary File' },
    'application/x-executable': {
      extension: 'exe',
      category: 'Executable',
      description: 'Executable File'
    },
    'application/java-archive': {
      extension: 'jar',
      category: 'Archive',
      description: 'Java Archive'
    }
  }
};

// Helper function to get MIME type information
const getMimeTypeInfo = (mimeType: string) => {
  for (const category of Object.values(PEGA_SUPPORTED_MIME_TYPES)) {
    const mimeTypeRecord = category as Record<
      string,
      { extension: string; category: string; description: string }
    >;
    if (mimeTypeRecord[mimeType]) {
      return mimeTypeRecord[mimeType];
    }
  }
  return { extension: 'unknown', category: 'File', description: 'Unknown File Type' };
};

// Helper function to get accept attribute for file input based on categories
const getAcceptAttribute = (categories: string) => {
  if (!categories || categories.trim() === '') {
    return '*/*'; // Accept all files if no categories specified
  }

  const categoryList = categories.split(',').map(cat => cat.trim().toLowerCase());
  const acceptTypes: string[] = [];

  categoryList.forEach(category => {
    switch (category.toLowerCase()) {
      case 'document':
        acceptTypes.push(
          '.pdf',
          '.doc',
          '.docx',
          '.docm',
          '.dotx',
          '.dotm',
          '.rtf',
          '.odt',
          '.odg',
          '.odf'
        );
        break;
      case 'spreadsheet':
        acceptTypes.push(
          '.xls',
          '.xlsx',
          '.xlsm',
          '.xlsb',
          '.xltx',
          '.xltm',
          '.xlam',
          '.csv',
          '.tsv',
          '.ods'
        );
        break;
      case 'presentation':
        acceptTypes.push('.ppt', '.pptx', '.pptm', '.potx', '.potm', '.ppsx', '.ppsm', '.odp');
        break;
      case 'image':
        acceptTypes.push('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico');
        break;
      case 'audio':
        acceptTypes.push('.mp3', '.wav', '.ogg', '.m4a', '.aac');
        break;
      case 'video':
        acceptTypes.push('.mp4', '.avi', '.mov', '.webm', '.ogv');
        break;
      case 'text':
        acceptTypes.push(
          '.txt',
          '.html',
          '.css',
          '.js',
          '.xml',
          '.md',
          '.yaml',
          '.yml',
          '.ini',
          '.log',
          '.readme',
          '.tsv'
        );
        break;
      case 'archive':
        acceptTypes.push('.zip', '.rar', '.7z', '.gz', '.tar');
        break;
      case 'email':
        acceptTypes.push('.msg', '.eml', '.mbox');
        break;
      case 'contact':
        acceptTypes.push('.vcf');
        break;
      case 'calendar':
        acceptTypes.push('.ics', '.vcs');
        break;
      case 'data':
        acceptTypes.push('.json', '.xml', '.yaml', '.yml');
        break;
      default:
        // For custom categories or 'file', accept common file types
        acceptTypes.push(
          '.pdf',
          '.doc',
          '.docx',
          '.xlsx',
          '.pptx',
          '.txt',
          '.jpg',
          '.png',
          '.msg',
          '.eml'
        );
    }
  });

  return acceptTypes.length > 0 ? acceptTypes.join(',') : '*/*';
};

// Helper function to auto-categorize file based on MIME type
const getFileCategoryFromMimeType = (mimeType: string, availableCategories: string[]): string => {
  const mimeInfo = getMimeTypeInfo(mimeType);
  const suggestedCategory = mimeInfo.category;

  // Check if the suggested category is available in the component's categories
  const availableCategoriesLower = availableCategories.map(cat => cat.toLowerCase());
  if (availableCategoriesLower.includes(suggestedCategory.toLowerCase())) {
    return suggestedCategory;
  }

  // Return the first available category as fallback
  return availableCategories[0] || 'File';
};

// Helper function to get file type icon for attachment
const getFileTypeIcon = (attachment: any) => {
  const mimeType = attachment.mimeType || attachment.pyTopic || 'application/octet-stream';
  const fileName = attachment.fileName || attachment.name || '';
  
  // Try to get MIME type from file extension if not available
  const finalMimeType = mimeType === 'application/octet-stream' && fileName 
    ? getMimeTypeFromFile(fileName) || mimeType 
    : mimeType;
    
  const fileKind = getKindFromMimeType(finalMimeType);
  
  return <FileVisual type={fileKind} style={{ width: '24px', height: '24px' }} />;
};

// Helper function to get file type description
const getFileTypeDescription = (attachment: any) => {
  const mimeType = attachment.mimeType || attachment.pyTopic || 'application/octet-stream';
  const fileName = attachment.fileName || attachment.name || '';
  
  // Try to get MIME type from file extension if not available
  const finalMimeType = mimeType === 'application/octet-stream' && fileName 
    ? getMimeTypeFromFile(fileName) || mimeType 
    : mimeType;
    
  const mimeInfo = getMimeTypeInfo(finalMimeType);
  return mimeInfo.description;
};

export type UtilityListProps = {
  heading: string;
  useAttachmentEndpoint: boolean;
  categories?: string;
  dataPage: string;
  iconName?: 'information' | 'polaris' | 'clipboard';
  displayFormat?: 'list' | 'tiles' | 'table';
  useLightBox?: boolean;
  enableDownloadAll?: boolean;
  enableUpload?: boolean;
  groupBy?: 'none' | 'category' | 'date';
  getPConnect?: any;
};

const ViewAllModal = ({
  heading,
  attachments,
  loading
}: {
  heading: ModalProps['heading'];
  attachments: SummaryListItem[];
  loading: ModalProps['progress'];
}) => {
  return (
    <Modal heading={heading} count={attachments.length} progress={loading}>
      <SummaryList items={attachments} />
    </Modal>
  );
};

// Upload Modal Component
const UploadModal = ({
  categories,
  onUploadSuccess,
  getPConnect
}: {
  categories: string;
  onUploadSuccess: () => void;
  getPConnect: any;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{
      file: File;
      title: string;
      category: string;
      detectedMimeType?: string;
      mimeTypeInfo?: {
        extension: string;
        category: string;
        description: string;
      };
    }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const categoryOptions = categories
    ? categories.split(',').map(cat => ({
        key: cat.trim(),
        text: cat.trim(),
        value: cat.trim()
      }))
    : [{ key: 'File', text: 'File', value: 'File' }];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const availableCategories = categoryOptions.map(opt => opt.value);
    const newFiles = Array.from(files).map(file => {
      const mimeType = getMimeTypeFromFile(file.name) || file.type;
      const autoCategory = getFileCategoryFromMimeType(mimeType, availableCategories);

      return {
        file,
        title: file.name,
        category: autoCategory,
        detectedMimeType: mimeType,
        mimeTypeInfo: getMimeTypeInfo(mimeType)
      };
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    setSelectedFiles(prev =>
      prev.map((item, i) => (i === index ? { ...item, title: newTitle } : item))
    );
  };

  const handleCategoryChange = (index: number, newCategory: string) => {
    setSelectedFiles(prev =>
      prev.map((item, i) => (i === index ? { ...item, category: newCategory } : item))
    );
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const attachmentUtils = (window as any).PCore.getAttachmentUtils();
    const caseID = getPConnect().getValue(
      (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
    );

    try {
      const uploadPromises = selectedFiles.map(async ({ file, title, category }) => {
        const fileId = `upload_${Date.now()}_${Math.random()}`;
        const fileWithMetadata = file as any;
        fileWithMetadata.ID = fileId;
        fileWithMetadata.category = category;
        fileWithMetadata.title = title;

        const onUploadProgress = () => {
          // Progress tracking can be implemented here if needed
        };

        const errorHandler = (isCanceled: (error: any) => boolean) => {
          return (error: any) => {
            if (!isCanceled(error)) {
              // Handle error silently for now
            }
          };
        };

        // Upload the file
        const uploadResult = await attachmentUtils.uploadAttachment(
          fileWithMetadata,
          onUploadProgress,
          errorHandler,
          getPConnect().getContextName()
        );

        // Link the uploaded file to the case
        await attachmentUtils.linkAttachmentsToCase(
          caseID,
          [uploadResult],
          category,
          getPConnect().getContextName()
        );

        return uploadResult;
      });

      await Promise.all(uploadPromises);

      // Reset form after successful upload
      setIsUploading(false);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();
    } catch (error) {
      setIsUploading(false);
      // Handle error silently for now
    }
  };

  return (
    <Modal
      heading='Upload Attachments'
      size='large'
      style={{
        width: '80vw',
        maxWidth: '1200px',
        minHeight: '400px',
        maxHeight: '80vh'
      }}
    >
      <Flex container={{ direction: 'column', gap: 2, pad: 2 }}>
        <FieldGroup name='upload-form'>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept={getAcceptAttribute(categories)}
            onChange={handleFileSelect}
            style={{ marginTop: '16px' }}
          />
          <Text variant='secondary' style={{ fontSize: '12px', marginTop: '8px' }}>
            Supported file types:{' '}
            {getAcceptAttribute(categories) === '*/*'
              ? 'All file types'
              : getAcceptAttribute(categories)}
          </Text>
        </FieldGroup>

        {selectedFiles.length > 0 && (
          <StyledTable theme={theme} style={{ maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>File Name</th>
                <th style={{ width: '15%' }}>Type</th>
                <th style={{ width: '30%' }}>Title</th>
                <th style={{ width: '25%' }}>Category</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedFiles.map((file, index) => (
                <tr key={file.file.name + index}>
                  <td>
                    <div style={{ fontSize: '14px' }}>{file.file.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {(file.file.size / 1024).toFixed(1)} KB
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      {file.mimeTypeInfo?.description || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#888' }}>{file.detectedMimeType}</div>
                  </td>
                  <td>
                    <label htmlFor={`title-${index}`} className='sr-only'>
                      Title for {file.file.name}
                    </label>
                    <input
                      id={`title-${index}`}
                      type='text'
                      value={file.title}
                      onChange={e => handleTitleChange(index, e.target.value)}
                      style={{ width: '100%', padding: '4px' }}
                    />
                  </td>
                  <td>
                    <label htmlFor={`category-${index}`} className='sr-only'>
                      Category for {file.file.name}
                    </label>
                    <select
                      id={`category-${index}`}
                      value={file.category}
                      onChange={e => handleCategoryChange(index, e.target.value)}
                      style={{ width: '100%', padding: '4px' }}
                    >
                      {categoryOptions.map(option => (
                        <option key={option.key} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Button
                      variant='simple'
                      icon
                      compact
                      onClick={() => handleRemoveFile(index)}
                      label={`Remove ${file.file.name}`}
                    >
                      <Icon name='trash' />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        )}

        <Flex container={{ justify: 'end', gap: 1 }}>
          <Button
            variant='secondary'
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              setSelectedFiles([]);
              setIsUploading(false);
              onUploadSuccess(); // This will close the modal
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            variant='primary'
            disabled={isUploading || selectedFiles.length === 0}
            loading={isUploading}
            onClick={handleFileUpload}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export const LHCExtensionsDisplayAttachments = (props: UtilityListProps) => {
  const {
    heading = 'List of objects',
    useAttachmentEndpoint = true,
    dataPage = '',
    categories = '',
    displayFormat = 'summaryList',
    iconName = 'clipboard',
    useLightBox = false,
    enableDownloadAll = false,
    enableUpload = false,
    groupBy: initialGroupBy = 'none',
    getPConnect
  } = props;
  const { create } = useModalManager();
  const [attachments, setAttachments] = useState<Array<SummaryListItem>>([]);
  const [files, setFiles] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [elemRef, setElemRef] = useState<HTMLElement>();
  const [images, setImages] = useState<LightboxProps['items'] | null>(null);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [groupBy, setGroupBy] = useState<'none' | 'category' | 'date'>(initialGroupBy);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const caseID = getPConnect().getValue(
    (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
  );
  const viewAllModalRef = useRef<ModalMethods<any>>();
  const uploadModalRef = useRef<ModalMethods<any>>();
  const theme = useTheme();

  const downloadAll = () => {
    const attachmentsToDownload =
      selectedFiles.size > 0 ? files.filter(attachment => selectedFiles.has(attachment.ID)) : files;

    attachmentsToDownload?.forEach((fileItem: any) => {
      downloadFile(fileItem, getPConnect, undefined, true);
    });
  };

  const handleFileSelection = (fileId: string, checked: boolean) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(fileId);
      } else {
        newSet.delete(fileId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(new Set(files.map(file => file.ID)));
    } else {
      setSelectedFiles(new Set());
    }
  };

  const isAllSelected = files.length > 0 && selectedFiles.size === files.length;
  const isIndeterminate = selectedFiles.size > 0 && selectedFiles.size < files.length;

  const openUploadModal = () => {
    const modalRef = create(UploadModal, {
      categories,
      onUploadSuccess: () => {
        modalRef.dismiss();
        // Refresh will be handled by the effect that watches for attachment changes
      },
      getPConnect
    });
    uploadModalRef.current = modalRef;
  };

  const onLightboxItemClose = () => {
    setImages(null);
    elemRef?.focus();
  };

  const onLightboxItemDownload = async (id: LightboxItem['id']) => {
    images?.forEach((image: any) => {
      if (image.id === id) {
        downloadBlob(image.blob, image.name, image.mimeType);
      }
    });
  };

  const publishAttachmentsUpdated = useCallback(
    (count: any) => {
      (window as any).PCore.getPubSubUtils().publish('WidgetUpdated', {
        widget: 'LHC_EXTENSIONS_DISPLAYATTACHMENTS',
        count,
        caseID
      });
    },
    [caseID]
  );

  const loadAttachments = useCallback(
    (response: Array<any> = []) => {
      const listOfAttachments: Array<any> = [];
      const listOfFiles: Array<any> = [];
      const listOfCategories = categories.split(',');
      response.forEach((attachment: any) => {
        const currentCategory = attachment.category?.trim() || attachment.pyCategory?.trim();
        if (useAttachmentEndpoint) {
          /* Filter the attachment categories */
          if (categories && listOfCategories.length > 0) {
            let isValidCategory = false;
            listOfCategories.forEach((categoryVal: string) => {
              if (currentCategory.toLocaleLowerCase() === categoryVal.trim().toLocaleLowerCase()) {
                isValidCategory = true;
              }
            });
            if (!isValidCategory) return;
          }
        } else {
          attachment = {
            ...attachment,
            category: attachment.pyCategory,
            name: attachment.pyMemo,
            ID: attachment.pzInsKey,
            type: attachment.pyFileCategory,
            fileName: attachment.pyFileName,
            mimeType: attachment.pyTopic,
            categoryName: attachment.pyLabel,
            createTime: attachment.pxCreateDateTime,
            createdByName: attachment.pxCreateOpName
          };
        }
        attachment.mimeType = getMimeTypeFromFile(
          attachment.fileName || attachment.nameWithExt || ''
        );
        if (!attachment.mimeType) {
          if (attachment.category === 'Correspondence') {
            attachment.mimeType = 'text/html';
            attachment.extension = 'html';
          } else {
            attachment.mimeType = 'text/plain';
          }
        }
        listOfFiles.push(attachment);
        addAttachment({
          currentCategory,
          attachment,
          listOfAttachments,
          getPConnect,
          setImages,
          useLightBox,
          setElemRef
        });
      });
      setFiles(listOfFiles);
      setAttachments(listOfAttachments);
      publishAttachmentsUpdated(listOfAttachments?.length ?? 0);
      setLoading(false);
    },
    [categories, getPConnect, useAttachmentEndpoint, useLightBox, publishAttachmentsUpdated]
  );

  const initialLoad = useCallback(() => {
    const pConn = getPConnect();
    if (useAttachmentEndpoint) {
      const attachmentUtils = (window as any).PCore.getAttachmentUtils();
      attachmentUtils
        .getCaseAttachments(caseID, pConn.getContextName())
        .then((resp: any) => loadAttachments(resp))
        .catch(() => {
          setLoading(false);
        });
    } else {
      const CaseInstanceKey = pConn.getValue(
        (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
      );
      const payload = {
        dataViewParameters: [{ LinkRefFrom: CaseInstanceKey }]
      };
      (window as any).PCore.getDataApiUtils()
        .getData(dataPage, payload, pConn.getContextName())
        .then((response: any) => {
          if (response.data.data !== null) {
            loadAttachments(response.data.data);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [dataPage, getPConnect, loadAttachments, useAttachmentEndpoint, caseID]);

  /* Subscribe to changes to the assignment case */
  useEffect(() => {
    const filter = {
      matcher: 'ATTACHMENTS',
      criteria: {
        ID: caseID
      }
    };
    const attachSubId = (window as any).PCore.getMessagingServiceManager().subscribe(
      filter,
      () => {
        /* If an attachment is added- force a reload of the events */
        initialLoad();
      },
      getPConnect().getContextName()
    );
    return () => {
      (window as any).PCore.getMessagingServiceManager().unsubscribe(attachSubId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, useLightBox, useAttachmentEndpoint, enableDownloadAll, getPConnect, initialLoad]);

  useEffect(() => {
    initialLoad();
  }, [categories, useLightBox, useAttachmentEndpoint, enableDownloadAll, initialLoad]);

  // Clear selections when files change
  useEffect(() => {
    setSelectedFiles(new Set());
  }, [files.length]);

  const deleteAttachment = useCallback(
    (attachment: any) => {
      const attachmentUtils = (window as any).PCore.getAttachmentUtils();
      attachmentUtils
        .deleteAttachment(attachment.ID, getPConnect().getContextName())
        .then(() => {
          // Refresh the attachments list after successful deletion
          initialLoad();
        })
        .catch(() => {
          // Handle error silently - could show a toast or error message in production
          // Error handling would be implemented based on the application's error handling strategy
        });
    },
    [getPConnect, initialLoad]
  );

  const groupFiles = useCallback(
    (fileList: Array<any>, groupByField: 'none' | 'category' | 'date') => {
      if (groupByField === 'none') {
        return [{ groupName: '', items: fileList }];
      }

      const groups: { [key: string]: Array<any> } = {};

      fileList.forEach(file => {
        let groupKey = '';

        if (groupByField === 'category') {
          groupKey = file.category || file.categoryName || 'Uncategorized';
        } else if (groupByField === 'date') {
          if (file.createTime) {
            const date = new Date(file.createTime);
            groupKey = date.toDateString(); // Format: "Mon Jan 28 2024"
          } else {
            groupKey = 'No Date';
          }
        }

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(file);
      });

      // Convert to array and sort group names
      return Object.keys(groups)
        .sort()
        .map(groupName => ({
          groupName,
          items: groups[groupName]
        }));
    },
    []
  );

  const getHeaderActions = () => {
    const actions = [];

    if (enableDownloadAll) {
      const downloadLabel =
        selectedFiles.size > 0 ? `Download selected (${selectedFiles.size})` : 'Download all';

      actions.push(
        <Button
          key='download-all'
          variant='simple'
          label={getPConnect().getLocalizedValue(downloadLabel)}
          icon
          compact
          onClick={downloadAll}
          disabled={selectedFiles.size === 0 && files.length === 0}
        >
          <Icon name='download' />
        </Button>
      );
    }

    if (enableUpload) {
      actions.push(
        <Button
          key='upload'
          variant='simple'
          label={getPConnect().getLocalizedValue('Upload Files')}
          icon
          compact
          onClick={openUploadModal}
        >
          <Icon name='upload' />
        </Button>
      );
    }

    return actions.length > 0 ? <Flex container={{ gap: 1 }}>{actions}</Flex> : undefined;
  };

  const renderContent = () => {
    if (displayFormat === 'list') {
      const listActions = [];

      if (enableDownloadAll) {
        listActions.push({
          text: 'Download all',
          id: 'Download all',
          icon: 'download',
          onClick: () => {
            downloadAll();
          }
        });
      }

      if (enableUpload) {
        listActions.push({
          text: 'Upload Files',
          id: 'Upload Files',
          icon: 'upload',
          onClick: openUploadModal
        });
      }

      return (
        <Flex container={{ direction: 'column' }}>
          <SummaryList
            name={heading}
            headingTag='h3'
            icon={iconName}
            count={loading ? undefined : attachments.length}
            items={attachments?.slice(0, 3)}
            loading={loading}
            onViewAll={() => {
              viewAllModalRef.current = create(ViewAllModal, { heading, attachments, loading });
            }}
            actions={listActions.length > 0 ? listActions : undefined}
          />
          {!loading && (
            <Flex container={{ direction: 'column', gap: 1, pad: 1 }}>
              <Text variant='secondary' style={{ marginTop: '8px', fontSize: '0.875rem' }}>
                Total: {files.length} {files.length === 1 ? 'attachment' : 'attachments'}
              </Text>
              {enableDownloadAll && files.length > 0 && (
                <Flex container={{ direction: 'column', gap: 1 }}>
                  <Flex container={{ alignItems: 'center', gap: 1 }}>
                    <input
                      id='list-select-all'
                      type='checkbox'
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={e => handleSelectAll(e.target.checked)}
                      style={{ marginRight: '8px' }}
                      aria-label='Select all attachments'
                    />
                    <label htmlFor='list-select-all'>
                      <Text variant='secondary' style={{ fontSize: '0.875rem' }}>
                        {selectedFiles.size > 0 ? `${selectedFiles.size} selected` : 'Select all'}
                      </Text>
                    </label>
                  </Flex>
                  {files.slice(0, 3).map((file: any) => (
                    <Flex key={file.ID} container={{ alignItems: 'center', gap: 1 }}>
                      <input
                        id={`list-select-${file.ID}`}
                        type='checkbox'
                        checked={selectedFiles.has(file.ID)}
                        onChange={e => handleFileSelection(file.ID, e.target.checked)}
                        style={{ marginRight: '8px' }}
                        aria-label={`Select ${file.fileName || file.name || 'unnamed file'}`}
                      />
                      <label htmlFor={`list-select-${file.ID}`}>
                        <Text variant='secondary' style={{ fontSize: '0.875rem' }}>
                          {file.fileName || file.name || 'Unnamed file'}
                        </Text>
                      </label>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      );
    }

    if (displayFormat === 'table') {
      const sortedFiles = [...files].sort((a, b) => {
        if (!sortField) {
          return 0;
        }

        const getValue = (item: any, field: string): string => {
          switch (field) {
            case 'fileName':
              return item.fileName || item.name || '';
            case 'title':
              return item.title || item.pyMemo || item.fileName || '';
            case 'category':
              return item.category || item.categoryName || '';
            case 'createdBy':
              return item.createdByName || item.createdBy || '';
            case 'createTime':
              return item.createTime || '';
            default:
              return '';
          }
        };

        const aValue = getValue(a, sortField);
        const bValue = getValue(b, sortField);

        return sortDirection === 'asc'
          ? aValue.toString().localeCompare(bValue.toString())
          : bValue.toString().localeCompare(aValue.toString());
      });

      const groupedFiles = groupFiles(sortedFiles, groupBy);

      return (
        <Flex container={{ direction: 'column' }}>
          <CardHeader actions={getHeaderActions()}>
            <Text variant='h2'>{heading}</Text>
          </CardHeader>
          <CardContent>
            <Flex
              container={{ justify: 'between', alignItems: 'center', gap: 2 }}
              style={{ marginBottom: '16px' }}
            >
              <Flex container={{ gap: 2, alignItems: 'center' }}>
                <Text variant='secondary'>Group by:</Text>
                <select
                  value={groupBy}
                  onChange={e => setGroupBy(e.target.value as 'none' | 'category' | 'date')}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    minWidth: '150px'
                  }}
                >
                  <option value='none'>No Grouping</option>
                  <option value='category'>Category</option>
                  <option value='date'>Date</option>
                </select>
              </Flex>
              <Flex container={{ gap: 2, alignItems: 'center' }}>
                {selectedFiles.size > 0 && (
                  <Text variant='secondary' style={{ fontWeight: '500' }}>
                    {selectedFiles.size} selected
                  </Text>
                )}
                <Text variant='secondary' style={{ fontWeight: '500' }}>
                  Total: {files.length} {files.length === 1 ? 'attachment' : 'attachments'}
                </Text>
              </Flex>
            </Flex>
            {attachments?.length > 0 ? (
              <div>
                {groupedFiles.map(group => (
                  <div
                    key={group.groupName || 'default'}
                    style={{ marginBottom: groupBy !== 'none' ? '24px' : '0' }}
                  >
                    {groupBy !== 'none' && (
                      <Text
                        variant='h4'
                        style={{
                          marginBottom: '12px',
                          paddingBottom: '8px',
                          borderBottom: '2px solid #e0e0e0',
                          color: '#333'
                        }}
                      >
                        {group.groupName} ({group.items.length}{' '}
                        {group.items.length === 1 ? 'item' : 'items'})
                      </Text>
                    )}
                    <StyledTable theme={theme}>
                      <thead>
                        <tr>
                          {enableDownloadAll && (
                            <th style={{ width: '50px' }}>
                              <input
                                id='select-all-checkbox'
                                type='checkbox'
                                checked={isAllSelected}
                                ref={input => {
                                  if (input) input.indeterminate = isIndeterminate;
                                }}
                                onChange={e => handleSelectAll(e.target.checked)}
                                style={{ margin: '0' }}
                                aria-label='Select all attachments'
                              />
                            </th>
                          )}
                          <th style={{ width: '60px' }}>Type</th>
                          <th
                            onClick={() => {
                              const newField = 'fileName';
                              const newDirection =
                                sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                              setSortField(newField);
                              setSortDirection(newDirection);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            File Name{' '}
                            {sortField === 'fileName' && (
                              <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />
                            )}
                          </th>
                          <th
                            onClick={() => {
                              const newField = 'title';
                              const newDirection =
                                sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                              setSortField(newField);
                              setSortDirection(newDirection);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            Title{' '}
                            {sortField === 'title' && (
                              <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />
                            )}
                          </th>
                          <th
                            onClick={() => {
                              const newField = 'category';
                              const newDirection =
                                sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                              setSortField(newField);
                              setSortDirection(newDirection);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            Category{' '}
                            {sortField === 'category' && (
                              <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />
                            )}
                          </th>
                          <th
                            onClick={() => {
                              const newField = 'createdBy';
                              const newDirection =
                                sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                              setSortField(newField);
                              setSortDirection(newDirection);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            Uploaded By{' '}
                            {sortField === 'createdBy' && (
                              <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />
                            )}
                          </th>
                          <th
                            onClick={() => {
                              const newField = 'createTime';
                              const newDirection =
                                sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                              setSortField(newField);
                              setSortDirection(newDirection);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            Date Time{' '}
                            {sortField === 'createTime' && (
                              <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />
                            )}
                          </th>
                          <th>Download</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((attachment: any) => (
                          <tr key={attachment.ID}>
                            {enableDownloadAll && (
                              <td>
                                <input
                                  id={`select-${attachment.ID}`}
                                  type='checkbox'
                                  checked={selectedFiles.has(attachment.ID)}
                                  onChange={e =>
                                    handleFileSelection(attachment.ID, e.target.checked)
                                  }
                                  style={{ margin: '0' }}
                                  aria-label={`Select ${attachment.fileName || attachment.name || 'attachment'}`}
                                />
                              </td>
                            )}
                            <td style={{ textAlign: 'center', padding: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {getFileTypeIcon(attachment)}
                              </div>
                            </td>
                            <td>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => downloadFile(attachment, getPConnect, undefined, false)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#0066cc',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    padding: '0',
                                    font: 'inherit',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.color = '#004499';
                                    e.currentTarget.style.textDecoration = 'none';
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.color = '#0066cc';
                                    e.currentTarget.style.textDecoration = 'underline';
                                  }}
                                  title={`Download ${attachment.fileName || attachment.name || 'attachment'}`}
                                >
                                  {attachment.fileName || attachment.name || '-'}
                                </button>
                              </div>
                            </td>
                            <td>
                              {attachment.title || attachment.pyMemo || attachment.fileName || '-'}
                            </td>
                            <td>{attachment.category || attachment.categoryName || '-'}</td>
                            <td>{attachment.createdByName || attachment.createdBy || '-'}</td>
                            <td>
                              {attachment.createTime
                                ? new Date(attachment.createTime).toLocaleDateString()
                                : '-'}
                            </td>
                            <td>
                              <Button
                                variant='simple'
                                label={getPConnect().getLocalizedValue('Download')}
                                icon
                                compact
                                onClick={() =>
                                  downloadFile(attachment, getPConnect, undefined, false)
                                }
                              >
                                <Icon name='download' />
                              </Button>
                            </td>
                            <td>
                              <Button
                                variant='simple'
                                label={getPConnect().getLocalizedValue('Delete')}
                                icon
                                compact
                                onClick={() => deleteAttachment(attachment)}
                              >
                                <Icon name='trash' />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </StyledTable>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Flex>
      );
    }

    // Default to tiles format
    return (
      <Flex container={{ direction: 'column' }}>
        <CardHeader actions={getHeaderActions()}>
          <Flex container={{ justify: 'between', alignItems: 'center', gap: 2 }}>
            <Text variant='h2'>{heading}</Text>
            <Flex container={{ gap: 2, alignItems: 'center' }}>
              {selectedFiles.size > 0 && (
                <Text variant='secondary' style={{ fontWeight: '500' }}>
                  {selectedFiles.size} selected
                </Text>
              )}
              <Text variant='secondary' style={{ fontWeight: '500' }}>
                Total: {files.length} {files.length === 1 ? 'attachment' : 'attachments'}
              </Text>
            </Flex>
          </Flex>
        </CardHeader>
        <CardContent>
          {enableDownloadAll && files.length > 0 && (
            <Flex
              container={{ alignItems: 'center', gap: 1, pad: 1 }}
              style={{ marginBottom: '16px' }}
            >
              <input
                id='tiles-select-all'
                type='checkbox'
                checked={isAllSelected}
                ref={input => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={e => handleSelectAll(e.target.checked)}
                style={{ marginRight: '8px' }}
                aria-label='Select all attachments'
              />
              <label htmlFor='tiles-select-all'>
                <Text variant='secondary' style={{ fontSize: '0.875rem' }}>
                  {selectedFiles.size > 0 ? `${selectedFiles.size} selected` : 'Select all'}
                </Text>
              </label>
            </Flex>
          )}
          {attachments?.length > 0 ? (
            <Grid
              container={{ pad: 0, gap: 1 }}
              xl={{ container: { cols: 'repeat(6, 1fr)', rows: 'repeat(1, 1fr)' } }}
              lg={{ container: { cols: 'repeat(4, 1fr)', rows: 'repeat(1, 1fr)' } }}
              md={{ container: { cols: 'repeat(3, 1fr)', rows: 'repeat(1, 1fr)' } }}
              sm={{ container: { cols: 'repeat(2, 1fr)', rows: 'repeat(1, 1fr)' } }}
              xs={{ container: { cols: 'repeat(1, 1fr)', rows: 'repeat(1, 1fr)' } }}
            >
              {attachments.map((attachment: any, index: number) => (
                <div key={attachment.ID} style={{ position: 'relative' }}>
                  {enableDownloadAll && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
                      <input
                        id={`tile-select-${files[index]?.ID}`}
                        type='checkbox'
                        checked={selectedFiles.has(files[index]?.ID)}
                        onChange={e => handleFileSelection(files[index]?.ID, e.target.checked)}
                        style={{ margin: '0' }}
                        aria-label={`Select ${files[index]?.fileName || files[index]?.name || 'attachment'}`}
                      />
                    </div>
                  )}
                  <StyledCardContent theme={theme}>
                    <SummaryItem {...attachment} />
                  </StyledCardContent>
                </div>
              ))}
            </Grid>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Flex>
    );
  };

  return (
    <>
      {renderContent()}
      {images && (
        <Lightbox
          items={images}
          onAfterClose={onLightboxItemClose}
          onItemDownload={onLightboxItemDownload}
        />
      )}
    </>
  );
};

export default withConfiguration(LHCExtensionsDisplayAttachments);
