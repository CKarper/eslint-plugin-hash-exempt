// import { hasDisable, getDirectiveHash, getTextHash } from '../lib/hashes';
import HashUtil from '../lib/hash-util';

const getDocsUrl = () => undefined;

const getReport = (message, fix) => ({ loc: { line: 0, column: 0 }, message, fix });

const create = context => ({
	Program: node => {
		const hu = new HashUtil(context.getSourceCode().text, node);
		const directiveHash = hu.getDirectiveHash();
		const contentHash = hu.getContentHash();
		if (directiveHash) {
			if (directiveHash !== contentHash) {
				context.report(
					getReport(
						`Hash doesn't match file contents, expected ${contentHash}`
					)
				);
			}
		} else {
			const [{ hashRequired = false }] = context.options;
			if (hashRequired) {
				context.report(
					getReport(
						`Hash not specified, expected ${contentHash}`
					)
				);
			}
		}
	}
});

const schema = [
	{
		type: 'object',
		properties: {
			requireHash: {
				type: 'boolean'
			}
		}
	}
];

module.exports = {
	create,
	meta: {
		schema,
		docs: {
			url: getDocsUrl(__filename)
		},
		fixable: 'code'
	}
};
