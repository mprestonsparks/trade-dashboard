'use client';

import { useEffect, useState } from 'react';

interface TimeDisplayProps {
  timestamp: string
}

export function TimeDisplay({ timestamp }: TimeDisplayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const date = new Date(timestamp);
  const localTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const utcTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{localTime}</span>
      <span className="text-xs text-muted-foreground/60">({utcTime} UTC)</span>
    </div>
  );
}
