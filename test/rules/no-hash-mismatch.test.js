import { RuleTester } from 'eslint';
import { describe, it } from 'mocha';

import rule from '../../src/rules/no-hash-mismatch';

const ruleTester = new RuleTester();
ruleTester.describe = describe;
ruleTester.it = it;

function testCase(code, hashRequired, errorMessage) {
	return {
		code,
		filename: 'test.js',
		options: [{ hashRequired }],
		errors: errorMessage && [
			{
				ruleId: 'no-hash-mismatch',
				message: errorMessage
			}
		]
	};
}

ruleTester.run('no-hash-mismatch', rule, {
	valid: [
		testCase(
			`/* eslint-disable */
			// Generate a hash
		`,
			false
		),
		testCase(
			`/* eslint-disable --0df6f52b038d0b991af210a6259184bd15e878f7-- */
			// Generate a hash
		`,
			false
		),
		testCase(
			`/* eslint-disable no-var,--0df6f52b038d0b991af210a6259184bd15e878f7-- */
			// Generate a hash
		`,
			false
		),
		testCase(
			`/* eslint-disable no-var, --0df6f52b038d0b991af210a6259184bd15e878f7--, no-unused-vars */
			// Generate a hash
		`,
			false
		),
		testCase(
			`/* eslint-disable --0df6f52b038d0b991af210a6259184bd15e878f7-- */
			// Generate a hash
		`,
			true
		),
		testCase(
			`/* eslint-disable no-var, no-unused-vars */
			// Generate a hash
		`,
			false
		)
	],
	invalid: [
		testCase(
			`/* eslint-disable */
			// Generate a hash
		`,
			true,
			'Hash not specified, expected 0df6f52b038d0b991af210a6259184bd15e878f7'
		),
		testCase(
			`/* eslint-disable --96b8e1bc91f88f04ccef7cc333c2d722808b0a55-- */
			// Generate a hash
		`,
			true,
			"Hash doesn't match file contents, expected 0df6f52b038d0b991af210a6259184bd15e878f7"
		),
		testCase(
			`/* eslint-disable --96b8e1bc91f88f04ccef7cc333c2d722808b0a55-- */
			// Generate a hash
		`,
			false,
			"Hash doesn't match file contents, expected 0df6f52b038d0b991af210a6259184bd15e878f7"
		),
		testCase(
			`/* eslint-disable no-var,--96b8e1bc91f88f04ccef7cc333c2d722808b0a55-- */
			// Generate a hash
		`,
			false,
			"Hash doesn't match file contents, expected 0df6f52b038d0b991af210a6259184bd15e878f7"
		),
		testCase(
			`/* eslint-disable no-var, no-unused-vars, --96b8e1bc91f88f04ccef7cc333c2d722808b0a55-- */
			// Generate a hash
		`,
			false,
			"Hash doesn't match file contents, expected 0df6f52b038d0b991af210a6259184bd15e878f7"
		),
		testCase(
			`/* eslint-disable no-var, no-unused-vars */
			// Generate a hash
		`,
			true,
			'Hash not specified, expected 0df6f52b038d0b991af210a6259184bd15e878f7'
		)
	]
});
