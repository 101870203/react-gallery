const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//判断当前运行环境是开发模式还是生产模式
const nodeEnv = process.env.NODE_ENV || 'development';
const isPro = nodeEnv === 'production';
console.log("当前运行环境：", isPro
	? 'production'
	: 'development');


module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: {
		app: [
			'webpack-hot-middleware/client?path=http://localhost:3011/__webpack_hmr&reload=true&noInfo=false&quiet=false', './index.js'
		],
		// 将 第三方依赖 单独打包
		vendor: [
			'zepto-webpack'
		]
	},
	output: {
		filename: 'js/[name].bundle.js',
		path: resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	resolve: {
		extensions: [
			'.js', '.jsx'
		]
	},
	context: resolve(__dirname, 'src'),
	devServer: {
		hot: true,
		contentBase: resolve(__dirname, 'dist'),
		publicPath: '/'
	},

	module: {
		//module.noParse 配置哪些文件可以脱离webpack的解析
		noParse: /node_modules\/(jquey|moment|zepto-webpack|chart\.js)/,
		rules: [
			//html
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader'
					}
				]
			}, {
				test: /\.jsx?$/,
				use: ['babel-loader'],
				exclude: /node_modules/,
				include: /src/
			}, {
				test: /\.less$/,
				use: [
					"css-loader?modules", "postcss-loader", "less-loader"
				],
				exclude: /node_modules/,
				include: /src/
			}, {
				test: /\.css$/,
				use: [
					'style-loader?modules', 'css-loader', 'postcss-loader'
				],
				exclude: /node_modules/,
				include: /src/
			}, {
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: "url-loader",
						query: {
							name: 'images/[name]-[hash:5].[ext]',
							limit: 20000
						}
					}, {
						loader: 'image-webpack-loader',
						options: {
							query: {
								mozjpeg: {
									progressive: true,
									quality: 65
								},
								pngquant: {
									quality: "10-20",
									speed: 4
								},
								svgo: {
									plugins: [
										{
											removeViewBox: false
										}, {
											removeEmptyAttrs: false
										}
									]
								},
								gifsicle: {
									optimizationLevel: 7,
									interlaced: false
								},
								optipng: {
									optimizationLevel: 7,
									interlaced: false
								}
							}
						}
					}

				]
			}, {
				test: /\.(mp3|mp4|ogg)$/,
				use: [
					{
						loader: "file-loader?name=media/[name].[ext]"
					}
				]
			},{
				test: /\.json$/,
				use: [
					{
						loader: "json-loader"
					}
				]
			}
		]
	},
	plugins: [
		//热更新
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		//html模板
		new HtmlWebpackPlugin({filename: 'index.html', template: 'index.html', inject: 'body'}),
		//zepto
		new webpack.ProvidePlugin({"$": "zepto-webpack"}),
		// 提供公共代码
		new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'js/[name].js'}),
		// css 后缀
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: function() {
					return [require('autoprefixer')];
				}
			}
		})
	]
}
