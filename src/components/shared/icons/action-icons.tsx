import type { SVGProps } from 'react';

export const DownloadIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M12 4.75v9.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path
			d="m8.25 10.75 3.75 3.75 3.75-3.75"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path d="M5.75 18.25h12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

export const RefreshIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path
			d="M19.25 11.25A7.25 7.25 0 1 1 17 5.97"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M19.25 4.75v4.5h-4.5"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

export const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<path d="M9.25 4.75h5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M5.75 7.75h12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path
			d="M8.25 7.75v10a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5v-10"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path d="M10.25 10.5v5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
		<path d="M13.75 10.5v5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);
