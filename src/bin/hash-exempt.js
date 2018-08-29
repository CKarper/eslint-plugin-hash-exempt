#!/usr/bin/env node
/* eslint no-console: off */
import 'source-map-support/register';

import fs from 'fs';
import { promisify } from 'util';

import { CLIEngine, Linter } from 'eslint';

import HashUtil from '../lib/hash-util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function processFile(fileName) {
	const cli = new CLIEngine();
	const linter = new Linter();

	const raw = await readFile(fileName, 'utf-8');
	const config = cli.getConfigForFile(fileName);

	linter.verify(raw, config);
	const source = linter.getSourceCode();

	const hu = new HashUtil(raw, source.ast);
	const updated = hu.updateHashDirective();

	await writeFile(fileName, updated, 'utf-8');

};

// istanbul ignore next
export async function processFiles(fileNames) {
	return Promise.all(fileNames.map(processFile));
};

// istanbul ignore next
{
	if (process.argv[0].endsWith('/node')) {
		process.argv.shift();
	}
	const allFiles = process.argv.includes('--exempt-all');

	const cli = new CLIEngine();
	const report = cli.executeOnFiles(process.argv);
	const files = report.results.map(r => (allFiles || r.errorCount) && r.filePath).filter(r => r);

	if (!files.length) {
		if (allFiles) {
			console.error('No matching files were specified...');
		} else {
			console.error('No lint violations found, no exemptions created.');
		}
	}

	processFiles(files).catch(err => console.dir(err, { colors: true }));
}
