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
	entry: {
		app: ['./index.js'],
		vendor: ['zepto-webpack','react','react-dom','react-redux']
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
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader?modules", "postcss-loader", "less-loader"]
				})
			}, {
				test: /\.css$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader"]
				})
			}, {
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: "url-loader",
						query: {
							name: 'images/[name].[ext]',
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
			},{
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
		//生产环境
		new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
		//html模板
		new HtmlWebpackPlugin({filename: 'index.html', template: 'index.html', inject: 'body'}),
		//zepto
		new webpack.ProvidePlugin({"$": "zepto-webpack"}),
		// 提供公共代码
		new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'js/[name].js'}),
		// 分离CSS和JS文件
		new ExtractTextPlugin('css/[name].css'),
		// css 后缀
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: function() {
					return [require('autoprefixer')];
				}
			}
		}),
		//压缩js
		new webpack.optimize.UglifyJsPlugin({
			// 最紧凑的输出
			beautify: false,
			// 删除所有的注释
			comments: false,
			compress: {
				// 在UglifyJs删除没有用到的代码时不输出警告
				warnings: false,
				// 删除所有的 `console` 语句
				drop_console: true,
				// 内嵌定义了但是只用到一次的变量
				collapse_vars: true,
				// 提取出出现多次但是没有定义成变量去引用的静态值
				reduce_vars: true
			}
		})
	]
}
