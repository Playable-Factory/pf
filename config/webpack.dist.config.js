"use strict";

const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = [
	{
		name: "gx-umd",
		mode: "production",
		entry: "./src/2d/index.js",

		output: {
			path: `${__dirname}/../dist/`,
			filename: "[name].js",
			globalObject: "this",
			library: {
				name: "gx",
				type: "umd",
				umdNamedDefine: true,
			},
		},

		performance: { hints: false },

		plugins: [new CleanWebpackPlugin()],

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
	{
        experiments: {
            outputModule: true,
        },
		name: "gx-esm",
		mode: "production",
		entry: "./src/2d/index.js",

		output: {
			path: `${__dirname}/../dist/`,
			filename: "[name].js",
			library: {
				type: "module",
			},
		},

		performance: { hints: false },

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
