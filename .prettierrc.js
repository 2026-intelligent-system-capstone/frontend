/** @type {import("prettier").Config} */
module.exports = {
	printWidth: 120,
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: true,
	trailingComma: 'all',
	bracketSpacing: true,
	arrowParens: 'always',
	endOfLine: 'auto',
	plugins: [
		require.resolve('@trivago/prettier-plugin-sort-imports'),
		require.resolve('prettier-plugin-tailwindcss'),
		require.resolve('prettier-plugin-classnames'),
		require.resolve('prettier-plugin-merge'),
	],
	tailwindFunctions: ['clsx', 'cn', 'twmerge', 'cva'],
	importOrder: [
		'^react$',
		'^react/(.*)$',
		'^react-dom$',

		'^next$',
		'^next/(.*)$',

		'^@tanstack/(.*)$',
		'^@suspensive/(.*)$',

		'<THIRD_PARTY_MODULES>',

		'^next-intl(.*)$',
		'^@/i18n(.*)$',

		'^zod$',
		'^zod/(.*)$',

		'^@/apis(.*)$',
		'^@/types(.*)$',
		'^@/hooks(.*)$',

		'^@/lib(.*)$',
		'^@/forms(.*)$',
		'^@/utils(.*)$',
		'^@/constants(.*)$',

		'^@/components(.*)$',
		'^@/public(.*)$',

		'^[./]',
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
};
