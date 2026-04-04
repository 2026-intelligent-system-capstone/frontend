import type { SVGProps } from 'react';

export const UserIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
		<path d="M6.75 18.25a5.25 5.25 0 0 1 10.5 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
	</svg>
);

export const MailIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
		<rect x="4.75" y="6.25" width="14.5" height="11.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
		<path
			d="m5.75 7.25 6.25 5 6.25-5"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);
