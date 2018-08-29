const ENV = process.env.BABEL_ENV || process.env.NODE_ENV;

module.exports = {
	presets: [
  	[
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        targets: { node: 'current' }
      }
    ]
	],
	plugins: [
		[ '@babel/plugin-proposal-object-rest-spread' ]
	]
};


