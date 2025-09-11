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

    const newFiles = Array.from(files).map(file => ({
      file,
      title: file.name,
      category: categoryOptions[0].value
    }));

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
            accept='*/*'
            onChange={handleFileSelect}
            style={{ marginTop: '16px' }}
          />
        </FieldGroup>

        {selectedFiles.length > 0 && (
          <StyledTable theme={theme} style={{ maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>File Name</th>
                <th style={{ width: '35%' }}>Title</th>
                <th style={{ width: '30%' }}>Category</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedFiles.map((file, index) => (
                <tr key={file.file.name + index}>
                  <td>{file.file.name}</td>
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
  const caseID = getPConnect().getValue(
    (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
  );
  const viewAllModalRef = useRef<ModalMethods<any>>();
  const uploadModalRef = useRef<ModalMethods<any>>();
  const theme = useTheme();

  const downloadAll = () => {
    files?.forEach((attachment: any) => {
      downloadFile(attachment, getPConnect, undefined, true);
    });
  };

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

  const groupFiles = useCallback((files: Array<any>, groupByField: 'none' | 'category' | 'date') => {
    if (groupByField === 'none') {
      return [{ groupName: '', items: files }];
    }

    const groups: { [key: string]: Array<any> } = {};

    files.forEach((file) => {
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
  }, []);

  const getHeaderActions = () => {
    const actions = [];

    if (enableDownloadAll) {
      actions.push(
        <Button
          key='download-all'
          variant='simple'
          label={getPConnect().getLocalizedValue('Download all')}
          icon
          compact
          onClick={downloadAll}
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
            <Text variant='secondary' style={{ marginTop: '8px', fontSize: '0.875rem' }}>
              Total: {files.length} {files.length === 1 ? 'attachment' : 'attachments'}
            </Text>
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
          switch(field) {
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
            <Flex container={{ justify: 'between', align: 'center', gap: 2 }} style={{ marginBottom: '16px' }}>
              <Flex container={{ gap: 2, align: 'center' }}>
                <Text variant='secondary'>Group by:</Text>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as 'none' | 'category' | 'date')}
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
              <Text variant='secondary' style={{ fontWeight: '500' }}>
                Total: {files.length} {files.length === 1 ? 'attachment' : 'attachments'}
              </Text>
            </Flex>
            {attachments?.length > 0 ? (
              <div>
                {groupedFiles.map((group, groupIndex) => (
                  <div key={group.groupName || 'default'} style={{ marginBottom: groupBy !== 'none' ? '24px' : '0' }}>
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
                        {group.groupName} ({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
                      </Text>
                    )}
                    <StyledTable theme={theme}>
                      <thead>
                        <tr>
                          <th onClick={() => {
                            const newField = 'fileName';
                            const newDirection = sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                            setSortField(newField);
                            setSortDirection(newDirection);
                          }} style={{ cursor: 'pointer' }}>
                            File Name {sortField === 'fileName' && <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />}
                          </th>
                          <th onClick={() => {
                            const newField = 'title';
                            const newDirection = sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                            setSortField(newField);
                            setSortDirection(newDirection);
                          }} style={{ cursor: 'pointer' }}>
                            Title {sortField === 'title' && <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />}
                          </th>
                          <th onClick={() => {
                            const newField = 'category';
                            const newDirection = sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                            setSortField(newField);
                            setSortDirection(newDirection);
                          }} style={{ cursor: 'pointer' }}>
                            Category {sortField === 'category' && <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />}
                          </th>
                          <th onClick={() => {
                            const newField = 'createdBy';
                            const newDirection = sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                            setSortField(newField);
                            setSortDirection(newDirection);
                          }} style={{ cursor: 'pointer' }}>
                            Uploaded By {sortField === 'createdBy' && <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />}
                          </th>
                          <th onClick={() => {
                            const newField = 'createTime';
                            const newDirection = sortField === newField && sortDirection === 'asc' ? 'desc' : 'asc';
                            setSortField(newField);
                            setSortDirection(newDirection);
                          }} style={{ cursor: 'pointer' }}>
                            Date Time {sortField === 'createTime' && <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />}
                          </th>
                          <th>Download</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((attachment: any) => (
                          <tr key={attachment.ID}>
                            <td>{attachment.fileName || attachment.name || '-'}</td>
                            <td>{attachment.title || attachment.pyMemo || attachment.fileName || '-'}</td>
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
                                onClick={() => downloadFile(attachment, getPConnect, undefined, false)}
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
          <Flex container={{ justify: 'between', align: 'center', gap: 2 }}>
            <Text variant='h2'>{heading}</Text>
            <Text variant='secondary' style={{ fontWeight: '500' }}>
              Total: {files.length} {files.length === 1 ? 'attachment' : 'attachments'}
            </Text>
          </Flex>
        </CardHeader>
        <CardContent>
          {attachments?.length > 0 ? (
            <Grid
              container={{ pad: 0, gap: 1 }}
              xl={{ container: { cols: 'repeat(6, 1fr)', rows: 'repeat(1, 1fr)' } }}
              lg={{ container: { cols: 'repeat(4, 1fr)', rows: 'repeat(1, 1fr)' } }}
              md={{ container: { cols: 'repeat(3, 1fr)', rows: 'repeat(1, 1fr)' } }}
              sm={{ container: { cols: 'repeat(2, 1fr)', rows: 'repeat(1, 1fr)' } }}
              xs={{ container: { cols: 'repeat(1, 1fr)', rows: 'repeat(1, 1fr)' } }}
            >
              {attachments.map((attachment: any) => (
                <StyledCardContent key={attachment.ID} theme={theme}>
                  <SummaryItem {...attachment} />
                </StyledCardContent>
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
