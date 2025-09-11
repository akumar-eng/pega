import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, Tiles, Table, TableGroupedByCategory, TableGroupedByDate } = composeStories(DemoStories);

test('renders DisplayAttachments component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Display attachments')).toBeVisible();
  expect(await screen.findByText('6')).toBeVisible();
  expect(await screen.findByText('pega.com')).toBeVisible();
  
  // Check for total count display
  expect(await screen.findByText(/Total: 6 attachments/)).toBeVisible();
  
  const BtnEl = await screen.findByText('View all');
  expect(BtnEl).toBeVisible();
  fireEvent.click(BtnEl);
  expect(await screen.findByRole('dialog')).toBeVisible();
  const CloseEl = await screen.findByLabelText('Close modal');
  expect(CloseEl).toBeVisible();
  fireEvent.click(CloseEl);
});

test('renders DisplayAttachments component with tiles args', async () => {
  render(<Tiles />);
  expect(await screen.findByText('Display attachments')).toBeVisible();
  expect(await screen.findByText('pega.com')).toBeVisible();
  expect(await screen.findByText('DemoFile')).toBeVisible();
  expect(await screen.findByText('SampleWord')).toBeVisible();
  expect(await screen.findByText('demoPDF')).toBeVisible();
  
  // Check for total count display in tiles format
  expect(await screen.findByText(/Total: 6 attachments/)).toBeVisible();
  
  const BtnEl = await screen.findByLabelText('Download all');
  expect(BtnEl).toBeVisible();
  fireEvent.click(BtnEl);
});

test('renders DisplayAttachments component with table format', async () => {
  render(<Table />);
  expect(await screen.findByText('Display attachments')).toBeVisible();

  // Check table headers
  expect(await screen.findByText('File Name')).toBeVisible();
  expect(await screen.findByText('Category')).toBeVisible();
  expect(await screen.findByText('Uploaded By')).toBeVisible();
  expect(await screen.findByText('Date Time')).toBeVisible();
  expect(await screen.findByText('Options')).toBeVisible();

  // Check for grouping selector
  expect(await screen.findByText('Group by:')).toBeVisible();
  const groupSelector = await screen.findByDisplayValue('No Grouping');
  expect(groupSelector).toBeVisible();

  // Check for total count display in table format
  expect(await screen.findByText(/Total: 6 attachments/)).toBeVisible();

  // Check for download all button
  const downloadAllBtn = await screen.findByLabelText('Download all');
  expect(downloadAllBtn).toBeVisible();

  // Check for delete icons (there should be multiple)
  const deleteButtons = screen.getAllByLabelText('Delete');
  expect(deleteButtons.length).toBeGreaterThan(0);
});

test('renders DisplayAttachments component with category grouping', async () => {
  render(<TableGroupedByCategory />);
  expect(await screen.findByText('Display attachments - Grouped by Category')).toBeVisible();

  // Check for grouping selector set to Category
  const groupSelector = await screen.findByDisplayValue('Category');
  expect(groupSelector).toBeVisible();

  // Should see group headers for different categories
  expect(await screen.findByText(/URL/)).toBeVisible();
  expect(await screen.findByText(/File/)).toBeVisible();
});

test('renders DisplayAttachments component with date grouping', async () => {
  render(<TableGroupedByDate />);
  expect(await screen.findByText('Display attachments - Grouped by Date')).toBeVisible();

  // Check for grouping selector set to Date
  const groupSelector = await screen.findByDisplayValue('Date');
  expect(groupSelector).toBeVisible();

  // Should see date-based group headers
  const dateGroups = screen.getAllByText(/2024/);
  expect(dateGroups.length).toBeGreaterThan(0);
});
