const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

 	mode: 'development',

  	entry: {
		index: './index.js',
		//print: './src/print.js',
 	},
 	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
        library: {
            type: 'module',
        },
        environment: {
            module: true,
        },
 	},

    experiments: {
        outputModule: true,
    },

    externalsType: 'module',
    externals: {
        three: 'three',
        'three/addons/controls/OrbitControls.js': 'three/addons/controls/OrbitControls.js',
        'three/addons/libs/stats.module.js': 'three/addons/libs/stats.module.js'
    },

 	plugins: [
		new HtmlWebpackPlugin({
		  	template: './index.html',
			favicon: './src/cloth.png',
		  	inject: true,
		  	chunks: ['index'],
			filename: 'index.html',
            scriptLoading: 'module',
		}),
 	],

    // Use es2020 to ensure module support is recognized
	target: ['web', 'es2020'],
  	devtool: 'inline-source-map',
  	devServer: {
		open: true,
		static: './dist',
		port: 8080,
  	},

  	module: {
		rules: [
	  		{
			test: /\.css$/i,
			use: ['style-loader', 'css-loader'],
	  		},
	  	{
			test: /\.(png|svg|jpg|jpeg|gif)$/i,
			type: 'asset/resource',
	  	},
		],
 	},
};