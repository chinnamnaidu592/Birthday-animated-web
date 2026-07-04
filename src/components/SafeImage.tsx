/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface SafeImageProps {
  customSrc: string;
  fallbackSrc: string;
  assetKey?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SafeImage({ customSrc, fallbackSrc, assetKey, className, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(customSrc || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  // If customSrc changes, reset states
  useEffect(() => {
    setImgSrc(customSrc || fallbackSrc);
    setHasError(false);
  }, [customSrc, fallbackSrc]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
      referrerPolicy="no-referrer"
    />
  );
}
