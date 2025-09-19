import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LhcExtensionsPulse from './index';
import type { PulseProps } from './index';

// Mock getPConnect function for testing
const mockGetPConnect = jest.fn(() => ({
  getValue: jest.fn((property: string) => `Mock value for ${property}`),
  setValue: jest.fn(),
  setProperty: jest.fn()
}));

describe('LhcExtensionsPulse', () => {
  const defaultProps: Partial<PulseProps> = {
    messageIDs: '.TestPulseMessages',
    getPConnect: mockGetPConnect
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<LhcExtensionsPulse {...defaultProps} />);

      // Check if component renders
      const component = screen.getByText(/Component structure ready/);
      expect(component).toBeInTheDocument();
    });

    it('displays default header text', () => {
      render(<LhcExtensionsPulse {...defaultProps} />);

      // Check default header
      const header = screen.getByText('Pulse Feed');
      expect(header).toBeInTheDocument();
    });

    it('displays custom header text', () => {
      const customHeaderText = 'Custom Activity Feed';
      render(<LhcExtensionsPulse {...defaultProps} headerText={customHeaderText} />);

      const header = screen.getByText(customHeaderText);
      expect(header).toBeInTheDocument();
    });

    it('hides header when headerText is empty', () => {
      render(<LhcExtensionsPulse {...defaultProps} headerText='' />);

      // Header section should not exist
      const header = screen.queryByRole('heading');
      expect(header).not.toBeInTheDocument();
    });
  });

  describe('Configuration Display', () => {
    it('displays message IDs in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<LhcExtensionsPulse {...defaultProps} messageIDs='.CustomMessages' />);

      expect(screen.getByText(/CustomMessages/)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('displays configuration values correctly', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<LhcExtensionsPulse {...defaultProps} maxMessages={15} showTimestamp={false} />);

      expect(screen.getByText(/Max Messages: 15/)).toBeInTheDocument();
      expect(screen.getByText(/Show Timestamp: No/)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Refresh Functionality', () => {
    it('shows refresh button when enableRefresh is true', () => {
      render(<LhcExtensionsPulse {...defaultProps} enableRefresh headerText='Test Feed' />);

      const refreshButton = screen.getByText('Refresh');
      expect(refreshButton).toBeInTheDocument();
    });

    it('hides refresh button when enableRefresh is false', () => {
      render(<LhcExtensionsPulse {...defaultProps} enableRefresh={false} headerText='Test Feed' />);

      const refreshButton = screen.queryByText('Refresh');
      expect(refreshButton).not.toBeInTheDocument();
    });

    it('calls refresh handler when refresh button is clicked', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<LhcExtensionsPulse {...defaultProps} enableRefresh headerText='Test Feed' />);

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      expect(consoleSpy).toHaveBeenCalledWith('LhcExtensionsPulse: handleRefresh called');

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Display Variants', () => {
    it('renders default variant correctly', () => {
      render(<LhcExtensionsPulse {...defaultProps} variant='default' />);

      const component = screen.getByText(/Default pulse view/);
      expect(component).toBeInTheDocument();
    });

    it('renders compact variant correctly', () => {
      render(<LhcExtensionsPulse {...defaultProps} variant='compact' />);

      const component = screen.getByText(/Compact pulse view/);
      expect(component).toBeInTheDocument();
    });

    it('renders detailed variant correctly', () => {
      render(<LhcExtensionsPulse {...defaultProps} variant='detailed' />);

      const component = screen.getByText(/Detailed pulse view/);
      expect(component).toBeInTheDocument();
    });

    it('applies correct CSS classes for variants', () => {
      const { container } = render(<LhcExtensionsPulse {...defaultProps} variant='compact' />);

      const pulseComponent = container.querySelector('.pulse-component');
      expect(pulseComponent).toHaveClass('pulse-variant-compact');
    });
  });

  describe('Empty State', () => {
    it('displays default empty text', () => {
      render(<LhcExtensionsPulse {...defaultProps} />);

      const emptyText = screen.getByText('No pulse messages available');
      expect(emptyText).toBeInTheDocument();
    });

    it('displays custom empty text', () => {
      const customEmptyText = 'Custom empty message';
      render(<LhcExtensionsPulse {...defaultProps} emptyText={customEmptyText} />);

      const emptyText = screen.getByText(customEmptyText);
      expect(emptyText).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('handles missing optional props gracefully', () => {
      render(<LhcExtensionsPulse getPConnect={mockGetPConnect} />);

      // Component should render without errors
      const component = screen.getByText(/Component structure ready/);
      expect(component).toBeInTheDocument();
    });

    it('uses default values for unspecified props', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<LhcExtensionsPulse getPConnect={mockGetPConnect} />);

      // Check default values are used
      expect(screen.getByText(/Max Messages: 10/)).toBeInTheDocument();
      expect(screen.getByText(/Show Timestamp: Yes/)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Console Logging', () => {
    it('logs initialization in development mode', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<LhcExtensionsPulse {...defaultProps} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        'LhcExtensionsPulse: constructor',
        expect.any(Object)
      );

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });

    it('does not log in production mode', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(<LhcExtensionsPulse {...defaultProps} />);

      expect(consoleSpy).not.toHaveBeenCalledWith(
        'LhcExtensionsPulse: constructor',
        expect.any(Object)
      );

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Component Structure', () => {
    it('has correct CSS classes', () => {
      const { container } = render(<LhcExtensionsPulse {...defaultProps} />);

      const pulseComponent = container.querySelector('.pulse-component');
      expect(pulseComponent).toBeInTheDocument();
      expect(pulseComponent).toHaveClass('pulse-variant-default');
    });

    it('applies custom styles correctly', () => {
      const { container } = render(<LhcExtensionsPulse {...defaultProps} />);

      const pulseComponent = container.querySelector('.pulse-component');
      expect(pulseComponent).toHaveStyle({
        'background-color': '#f8f9fa',
        'border-radius': '4px',
        padding: '16px'
      });
    });
  });
});
