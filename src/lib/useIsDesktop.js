'use client';

import { useEffect, useState } from 'react';

// Mirrors Tailwind's `xl` breakpoint (1280px), which is what the rest of
// the dashboard layout switches on. Centralizing the check here — instead
// of duplicating `hidden xl:block` / `xl:hidden` pairs in multiple
// components — means there's exactly one source of truth for "are we on
// the desktop layout", so the notes panel can never end up rendered in
// both places at once.
export default function useIsDesktop(breakpoint = 1280) {
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth >= breakpoint;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
        const handleChange = (event) => setIsDesktop(event.matches);

        handleChange(mediaQuery);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        // Safari < 14 fallback
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, [breakpoint]);

    return isDesktop;
}
