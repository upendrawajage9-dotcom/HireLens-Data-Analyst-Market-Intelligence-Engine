'use client';

import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import type { ReactNode } from 'react';

// NOTE: ReactLenis handles its own mount/SSR lifecycle internally.
// Do NOT wrap in hasMounted — that creates a server/client tree mismatch
// because the server renders <>{children}</> while the client renders
// <ReactLenis>{children}</ReactLenis>, which hydrates to a different DOM shape.
export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}
