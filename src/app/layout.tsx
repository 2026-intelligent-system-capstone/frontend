import type { Metadata } from 'next';

import localFont from 'next/font/local';

import { Providers } from '@/shared/ui/providers';
import { Agentation } from 'agentation';

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
				<a
					href="#main-content"
					className="bg-surface text-neutral-text shadow-card fixed top-4 left-4 z-50 -translate-y-24
						rounded-full px-4 py-2 text-sm font-semibold transition-transform focus:translate-y-0
						focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus)]"
				>
					본문으로 건너뛰기
				</a>
				<Providers>{children}</Providers>
				{process.env.NODE_ENV === 'development' && <Agentation endpoint="http://localhost:4747" />}
			</body>
		</html>
	);
}
