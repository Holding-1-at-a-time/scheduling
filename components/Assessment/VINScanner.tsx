// File: components/assessment/VINScanner.tsx

import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import { useToast } from "@/components/ui/use-toast";

interface VINScannerProps {
  onScan: (vin: string) => void;
}

/**
 * A functional component that renders a VIN scanner, allowing users to scan a VIN barcode.
 * It initializes the Quagga library, sets up event listeners for detected codes, and handles errors.
 * If the scanner fails to initialize, it displays an error message.
 *
 * @param {function} onScan - a callback function to handle the scanned VIN
 * @return {JSX.Element} the VIN scanner component
 */
export const VINScanner: React.FC<VINScannerProps> = ({ onScan }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: ['code_128_reader']
        },
        locate: true
      }, (err) => {
        if (err) {
          console.error("VINScanner initialization error:", err);
          setHasError(true);
          toast({
            title: "Scanner Error",
            description: "Failed to initialize the VIN scanner. Please try again or enter the VIN manually.",
            variant: "destructive",
          });
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          const vin = result.codeResult.code.toUpperCase();
          if (validateVIN(vin)) {
            onScan(vin);
            Quagga.stop();
          } else {
            toast({
              title: "Invalid VIN",
              description: "The scanned code is not a valid VIN. Please try again.",
              variant: "warning",
            });
          }
        }
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [onScan, toast]);

  const validateVIN = (vin: string): boolean => {
    // Basic VIN validation (17 alphanumeric characters, excluding I, O, Q)
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vin);
  };

  if (hasError) {
    return <div>Scanner failed to initialize. Please try again or enter VIN manually.</div>;
  }

  return (
    <div>
      <div ref={scannerRef} style={{ width: '100%', height: '300px' }} aria-live="polite" aria-label="VIN Scanner" />
      <p>Position the VIN barcode within the scanner area.</p>
    </div>
  );
};