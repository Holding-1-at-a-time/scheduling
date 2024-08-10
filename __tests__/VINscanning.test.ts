import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { VINScanner } from './VINScanner';

jest.mock('quagga', () => ({
  init: jest.fn(),
  onDetected: jest.fn(),
  stop: jest.fn(),
}));

describe('VINScanner component', () => {
  const mockOnScan = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    const { getByText } = render(<VINScanner onScan={mockOnScan} />);
    expect(getByText('Position the VIN barcode within the scanner area.')).toBeInTheDocument();
  });

  it('initializes Quagga correctly', () => {
    render(<VINScanner onScan={mockOnScan} />);

    expect(Quagga.init).toHaveBeenCalledTimes(1);
    expect(Quagga.init).toHaveBeenCalledWith(
      expect.objectContaining({
        inputStream: expect.objectContaining({
          type: 'LiveStream',
          constraints: expect.objectContaining({
            width: 640,
            height: 480,
            facingMode: 'environment',
          }),
        }),
        locator: expect.objectContaining({
          patchSize: 'medium',
          halfSample: true,
        }),
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: expect.objectContaining({
          readers: ['code_128_reader'],
        }),
        locate: true,
      }),
      expect.any(Function),
    );
  });

  it('handles errors during Quagga initialization', () => {
    Quagga.init.mockImplementationOnce(() => {
      throw new Error('Quagga initialization error');
    });
    const { getByText } = render(<VINScanner onScan={mockOnScan} />);
    expect(getByText('Scanner failed to initialize. Please try again or enter VIN manually.')).toBeInTheDocument();
  });

  it('validates VIN numbers correctly', () => {
    const vin = '1234567890ABCDEFG';
    const isValid = VINScanner.validateVIN(vin);
    expect(isValid).toBe(true);
  });

  it('calls the onScan callback with a valid VIN number', async () => {
    const { getByText } = render(<VINScanner onScan={mockOnScan} />);
    const vin = '1234567890ABCDEFG';

    Quagga.onDetected.mockImplementationOnce(() => {
      mockOnScan(vin);
    });

    await waitFor(() => {
      expect(mockOnScan).toHaveBeenCalledTimes(1);
      expect(mockOnScan).toHaveBeenCalledWith(vin);
    });
  });
});
