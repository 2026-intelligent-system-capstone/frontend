import queryPlugin from '@tanstack/eslint-plugin-query';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTypescript,
	prettier,
	{
		plugins: {
			'@tanstack/query': queryPlugin,
		},
		rules: {
			...queryPlugin.configs.recommended.rules,
			'@tanstack/query/exhaustive-deps': 'error',
		},
	},
	{
		plugins: {
			'no-relative-import-paths': noRelativeImportPaths,
		},
		rules: {
			'no-relative-import-paths/no-relative-import-paths': [
				'warn',
				{ allowSameFolder: true, rootDir: 'src', prefix: '@' },
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'react/no-unknown-property': 'off',
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
		},
	},
	globalIgnores(['.next/', '.yarn/', 'node_modules/', 'public/', 'out/', 'eslint.config.mjs']),
]);

export default eslintConfig;
