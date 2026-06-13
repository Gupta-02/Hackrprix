import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 1000) {
	const [value, setValue] = useState<number>(Math.round(target));
	const rafRef = useRef<number | null>(null);
	const startRef = useRef<number | null>(null);
	const fromRef = useRef<number>(0);

	useEffect(() => {
		// start from current value so repeated calls animate smoothly
		fromRef.current = typeof value === 'number' ? value : 0;
		const start = performance.now();
		startRef.current = start;

		const step = (time: number) => {
			if (!startRef.current) startRef.current = time;
			const elapsed = time - startRef.current;
			const t = Math.min(1, elapsed / duration);
			const eased = 1 - Math.pow(1 - t, 3);
			const next = Math.round(fromRef.current + (target - fromRef.current) * eased);
			setValue(next);
			if (t < 1) {
				rafRef.current = requestAnimationFrame(step);
			}
		};

		rafRef.current = requestAnimationFrame(step);

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
			startRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [target, duration]);

	return value;
}

export function useCountdown(startIso: string | number | Date, durationHours: number) {
	const toMs = (v: string | number | Date) => new Date(v).getTime();
	const start = toMs(startIso);
	const end = start + durationHours * 60 * 60 * 1000;

	const getState = () => {
		const now = Date.now();
		const remaining = Math.max(0, end - now);
		const total = Math.max(1, end - start);
		const elapsedPct = (1 - remaining / total) * 100;
		const secs = Math.floor(remaining / 1000);
		const h = Math.floor(secs / 3600);
		const m = Math.floor((secs % 3600) / 60);
		const s = secs % 60;
		const pad = (n: number) => String(n).padStart(2, '0');
		return {
			h: pad(h),
			m: pad(m),
			s: pad(s),
			isExpired: now >= end,
			elapsedPct: Math.min(100, Math.max(0, elapsedPct)),
		};
	};

	const [state, setState] = useState(getState);

	useEffect(() => {
		const id = setInterval(() => setState(getState()), 1000);
		return () => clearInterval(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startIso, durationHours]);

	return state;
}
