import noHashMismatch from './rules/no-hash-mismatch';

module.exports = {
	rules: {
		'no-hash-mismatch': noHashMismatch
	},
	configs: {
		recommended: {
			env: {
				es6: true
			},
			parserOptions: {
				ecmaVersion: 2018,
				sourceType: 'module'
			},
			rules: {
				'hash-exempt/no-hash-mismatch': ['on', { hashRequired: false }]
			}
		}
	}
};
