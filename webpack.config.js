const webpack = require('webpack');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

var env = process.env.NODE_ENV || 'local';

var hrms = {
	production: 'https://intranet.litmus7.com/self-rating/site/signin',
	beta: 'http://52.37.195.29/hrms-review/site/signin',
	staging: 'http://52.37.195.29/hrms-review/site/signin'
};
var url = {
	production: '/api_ep/',
	beta: '/api_ep/',
	staging: 'https://192.168.12.201:8452/'
};
var ga = {
	local: ''
	, staging: 'UA-135631103-2'
	, beta: 'UA-135631103-3'
	, production: 'UA-135631103-4'
};
if (env === 'local') {
	var fs = require('fs');
	var file = 'local-properties.json';
	var localUrl = 'https://localhost:8452/'
	var localHrmsUrl = hrms['staging'];
	var localGa = ga['local'];
	if (fs.existsSync(file)) {
		try {
			var props = JSON.parse(fs.readFileSync(file, 'utf8'));
			localUrl = props.apiServer || props.BASE_URL || props.base_url || props.baseUrl;
			localHrmsUrl = localHrmsUrl || props.hrmsUrl || props.HRMS_URL;
			localGa = localGa || props.ga || props.GA;
		} catch (e) {
			console.log('Invalid json in ' + file, e);
		}
	}
	url['local'] = localUrl;
	hrms['local'] = localHrmsUrl;
	ga['local'] = localGa;
}

module.exports = (_, argv) => {
	const mode = argv.mode || 'development';

	const config = {
		entry: [
			'@babel/polyfill',
			SRC_DIR + '/app/index.js',
		],
		devtool: 'eval',
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [SRC_DIR],
					loader: 'babel-loader',
					options: {
						plugins: [
							'@babel/plugin-syntax-dynamic-import',
							[
								'@babel/plugin-proposal-class-properties',
								{ 'loose': true },
							]
						],
						presets: [
							[
								'@babel/preset-env',
								{
									modules: false
								},
							],
							'@babel/preset-react'
						]
					},
				},
				{
					test: /\.(scss|css)$/,
					use: [
						{ loader: 'style-loader' },
						{
							loader: 'css-loader',
							options: {
								sourceMap: true
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							},
						}
					]
				},
				// json is automatically loaded now
				{
					test: /\.(jpe?g|png|gif|svg)$/i,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[hash].[ext]',
								hashType: 'sha512',
								digestType: 'hex',
							},
						},
						{
							loader: 'image-webpack-loader',
							options: {
								disable: env != 'local', // disable only for dev builds
								optipng: {
									optimizationLevel: 7
								},
								gifsicle: {
									interlaced: false
								},
							},
						},
					]
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(env),
				__HRMS_URL: JSON.stringify(hrms[env]),
				__BASE_URL: JSON.stringify(url[env]),
				__GA: JSON.stringify(ga[env])
			}),
		],

		output: {
			path: DIST_DIR + '/app',
			filename: 'bundle.js',
			publicPath: '/app/',
		},

		mode: mode,

		optimization: {}
	};

	if (mode == 'production') {
		const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
		const CompressionPlugin = require('compression-webpack-plugin');

		// uglyfier options changed to optimization options
		config.optimization.minimizer = [
			new UglifyJsPlugin({
				exclude: /\.min\.js$/gi, // skip pre-minified libs
				parallel: true,
				uglifyOptions: {
					compress: {
						pure_getters: true,
						unsafe: true,
						unsafe_comps: true,
					},
					warnings: env != 'production', // Suppress uglification warnings
					ie8: false, // previously: `screw_ie8`
					extractComments: true,
					mangle: true,
					output: {
						comments: false,
					},
				},
				sourceMap: true,
			}),
		];
		config.plugins = [
			...config.plugins,
			new webpack.optimize.AggressiveMergingPlugin(),
			new webpack.IgnorePlugin({
				resourceRegExp: /^\.\/locale$/,
				contextRegExp: /moment$/
			}),
			new CompressionPlugin({
				test: /\.js$|\.css$|\.html$/,
				filename: '[path].gz[query]', // previously `asset`
				algorithm: 'gzip',
				threshold: 10240,
				minRatio: 0.3, // previously 3, now should be [0-1]
			}),
		]
	}
	return config;
}