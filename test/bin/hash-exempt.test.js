import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { describe, it } from 'mocha';

import { processFile } from '../../src/bin/hash-exempt';

const copyFile = promisify(fs.copyFile);
const readFile = promisify(fs.readFile);
// const unlink = promisify(fs.unlink);

function isDirectory(source) {
	return fs.lstatSync(source).isDirectory(); // eslint-disable-line no-sync
}

describe('Plugin configuration', () => {
	const fixtureDir = path.join(__dirname, '../__fixtures');
	const fixtures = fs.readdirSync(fixtureDir)  // eslint-disable-line no-sync
		.map(name => path.join(fixtureDir, name))
		.filter(isDirectory);

	fixtures.forEach(fixture => {
		it(`Should process ${fixture}`, async () => {
			const before = path.join(fixture, 'test.js');
			const after = path.join(fixture, 'work.js');
			const expect = path.join(fixture, 'expect.js');

			await copyFile(before, after);

			try {
				await processFile(after);

				const [processed, expected] = await Promise.all([readFile(after), readFile(expect)]);

				assert.ok(processed.equals(expected), 'File buffers are not equal!');
			}
			finally {
				// console.dir({ before, after, ret }, { colors: true }); // eslint-disable-line
				// await unlink(after);
			}
		});
	});
});
