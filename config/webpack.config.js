"use strict";

const webpack = require("webpack");
const exec = require("child_process").exec;
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
	{
		mode: "production",
		entry: "./src/2d/index.js",

		devtool: "source-map",

		output: {
			path: `${__dirname}/../build/`,
			globalObject: "this",
			sourceMapFilename: "[file].map",
			devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
			devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
			filename: "[name].js",
			library: {
				name: "gx",
				type: "umd",
				umdNamedDefine: true,
			},
		},

		performance: { hints: false },

		plugins: [new webpack.DefinePlugin({})],

		devtool: "source-map",

		optimization: {
			minimizer: [
				new TerserPlugin({
					include: /\.min\.js$/,
					parallel: true,
					extractComments: false,
					terserOptions: {
						format: {
							comments: false,
						},
						compress: true,
						ie8: false,
						ecma: 6,
						warnings: false,
					},
				}),
			],
		},
	},
];
