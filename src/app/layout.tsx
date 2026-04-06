import type { Metadata } from 'next';

import localFont from 'next/font/local';

import { Providers } from '@/shared/ui/providers';

import './globals.css';

const pretendardVariable = localFont({
	src: '../../public/fonts/PretendardVariable.woff2',
	variable: '--font-pretendard',
	display: 'swap',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'Dialearn',
	description: 'AI 기반 학습 역량 평가 플랫폼',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={`${pretendardVariable.className} bg-background text-foreground antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
