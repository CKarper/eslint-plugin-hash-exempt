import crypto from 'crypto';

const disableRegex = /^\s*eslint-disable(?:\s|$)(.*)/;

const hashRegex = /--([a-f0-9]+)--/;

const privStore = new WeakMap();

export default class HashUtil {
	constructor(code, ast) {
		const priv = {
			raw: code,
			ast
		};
		privStore.set(this, priv);

		[this.firstDisable] = this.getDisableDirectives();
		if (this.firstDisable && this.firstDisable.loc.start.line === 1) {
			this.hashBase = code.replace(`/*${this.firstDisable.value}*/`, '');
		} else {
			this.hashBase = `\n${code}`;
		}
	}

	static getHashFromDirective(directive) {
		const [full, args] = disableRegex.exec(directive);

		if (full && args) {
			const match = args.match(hashRegex);
			if (match && match.length) {
				return match[1];
			}
		}
		return undefined;
	}

	static getStringHash(text) {
		return crypto
			.createHash('sha1')
			.update(text, 'utf8')
			.digest('hex');
	}

	getComments() {
		return privStore.get(this).ast.comments;
	}

	getDisableDirectives() {
		return privStore
			.get(this)
			.ast.comments.filter(c => disableRegex.exec(c.value.trim()));
			// .map(c => c.value);
	}

	getContentHash() {
		return HashUtil.getStringHash(this.hashBase);
	}

	getDirectiveHash() {
		if (this.firstDisable && this.firstDisable.loc.start.line === 1) {
			return HashUtil.getHashFromDirective(this.firstDisable.value);
		}
		return undefined;
	}

	addHashDirective() {
		return `/* eslint-disable --${HashUtil.getStringHash(this.hashBase)}-- */${this.hashBase}`;
	}

	updateHashDirective() {
		const priv = privStore.get(this);
		// console.dir(this.firstDisable, { colors: true, depth: 5 });
		if (!this.firstDisable || this.firstDisable.loc.start.line !== 1) {
			return this.addHashDirective();
		}
		const directive = this.firstDisable.value;

		const codeHash = HashUtil.getStringHash(this.hashBase);
		const directiveHash = HashUtil.getHashFromDirective(directive);
		if (directiveHash) {
			if (directiveHash === codeHash) {
				return priv.raw;
			}
			const updatedDirective = directive.replace(`--${directiveHash}--`, `--${codeHash}--`);
			return priv.raw.replace(directive, updatedDirective);
		}

		const [, args] = disableRegex.exec(directive);
		if (args) {
			return priv.raw.replace(directive, ` eslint-disable ${args}, --${codeHash}-- `);
		}

		return priv.raw.replace(directive, ` eslint-disable --${codeHash}-- `);
	}
}
