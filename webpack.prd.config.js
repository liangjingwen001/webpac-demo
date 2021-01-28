/*
    生产环境配置:webpack
*/

// resolve是nodejs里面拼接绝对路径的方法
const {resolve} = require('path')
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置nodeJS环境变量
process.env.NODE_ENV = 'production';

// 复用cssLoader
let commonCssLoader = [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            ident: 'postcss',
            options: {
                postcssOptions: {
                    plugins: () => [require('postcss-preset-env')()]
                }
            }
        }
    ]

// webpack配置文件
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'js/build.js',
        path: resolve(__dirname, 'build'),
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [...commonCssLoader]
            },
            {
                test: /\.less$/,
                use: [...commonCssLoader, 'less-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // 这个loader优先执行
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs: {
                                    version: 3
                                },
                                targets: {
                                    chrome: '60',
                                    firefox: '90',
                                    ie: '9',
                                    safari: '10',
                                    edge: '17'
                                }
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 30 * 1024,
                    esModule: false,
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs',
                    publicPath: '../imgs'
                }
            },
            {
                test: /\.(html)$/,
                loader: 'html-loader'
            },
            {
                // 前面所有的类型都需要排除
                exclude: /\.(css|js|html|jpg|png|gif|jpeg|less|json)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            }
        ]
    },
    // 插件配置
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/build.css'
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    mode: 'production',
}
