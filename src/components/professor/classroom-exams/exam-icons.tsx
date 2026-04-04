import type { SVGProps } from 'react';

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M12 5.75v12.5M5.75 12h12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
	</svg>
);

export const SparklesIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path
			d="M12 3.75l1.64 4.61L18.25 10l-4.61 1.64L12 16.25l-1.64-4.61L5.75 10l4.61-1.64L12 3.75Z"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M18.5 4.75v2.5M19.75 6h-2.5M5.5 16.75v3M7 18.25H4"
			stroke="currentColor"
			strokeLinecap="round"
			strokeWidth="1.5"
		/>
	</svg>
);

export const PencilIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path
			d="M4.75 19.25 8 18.5l8.97-8.97a1.77 1.77 0 0 0 0-2.5l-.99-.99a1.77 1.77 0 0 0-2.5 0L4.5 15.03l-.75 3.22Z"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="m12.75 6.75 4.5 4.5"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

export const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path
			d="M5.75 7.25h12.5M9.25 7.25V5.5h5.5v1.75M8.5 10.25v6M12 10.25v6M15.5 10.25v6"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M7.25 7.25h9.5v10a2 2 0 0 1-2 2h-5.5a2 2 0 0 1-2-2v-10Z"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

export const DocumentIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path
			d="M7 3.75h7.5L19.25 8.5V19A2.25 2.25 0 0 1 17 21.25H7A2.25 2.25 0 0 1 4.75 19V6A2.25 2.25 0 0 1 7 3.75Z"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M14.5 3.75V8.5h4.75"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path d="M8.5 13h7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M8.5 16.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

export const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
		<path
			d="M12 7.75v4.5l3 1.75"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

export const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<rect x="4.75" y="5.75" width="14.5" height="13.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
		<path d="M8 3.75v4M16 3.75v4M4.75 9.25h14.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);
