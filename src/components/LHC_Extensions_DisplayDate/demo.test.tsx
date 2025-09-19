import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, USFormat, WithTime12Hour, EmptyValue } = composeStories(DemoStories);

test('renders Display Date component with European format', async () => {
  render(<Default />);
  const dateEl = screen.getByText('19/09/2025');
  expect(dateEl).not.toBeNull();
});

test('renders Display Date component with US format', async () => {
  render(<USFormat />);
  const dateEl = screen.getByText('09/19/2025');
  expect(dateEl).not.toBeNull();
});

test('renders Display Date component with time', async () => {
  render(<WithTime12Hour />);
  // Should show date with time
  const dateTimeEl = screen.getByText(/19\/09\/2025.*[0-9]+:[0-9]+/);
  expect(dateTimeEl).not.toBeNull();
});

test('renders empty value display when no date provided', async () => {
  render(<EmptyValue />);
  const emptyEl = screen.getByText('No date provided');
  expect(emptyEl).not.toBeNull();
});
