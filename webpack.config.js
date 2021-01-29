/*
    生产环境配置:webpack
*/

/**
 * 缓存：开启缓存每次构建只会重新构建修改的模块
 *  Babel缓存：
 *      cacheDirectory: true
 *  文件资源缓存：
 *      hash：每次webpack构建时会生成一个唯一的hash值(css和js共用一个hash,一个模块修改，所有缓存都失效)
 *      chunkhash: 根据chunk生成hash，如果打包来来源同一chunk，那么hash值就一样
 *      contenthash：根据文件的内容生成hash值，不同文件的hash值一定不一样
 *      
 */

 /**
  * tree shaking：去除无用代码，减少代码体积
  * 前提：1.使用es6模块 2.开启production环境
  * 
  * 因版本原因，可能会造成资源被丢弃
  * 解决：package.json里面添加："sideEFFects": ["*.css", "*.less"]
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
    // 单入口
    entry: './src/index.js',
    // 多入口
    // entry: {
    //     main: './src/index.js',
    //     server: './src/server.js'
    // },
    output: {
        filename: 'js/[name].[contenthash:10].js',
        path: resolve(__dirname, 'build'),
        publicPath: './'
    },
    module: {
        rules: [
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
                // 以下loader只会匹配一个，注意：不能有两个配置处理同一种类型文件
                oneOf: [
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
                            ],
                            // 开启babel缓存，第二次构建的时候会读取之前的缓存
                            cacheDirectory: true
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
            filename: 'css/build.[contenthash:10].css'
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    // 可以将node_modules里面的代码单独打包成一个chunk输出
    // 自动分析有没有公共的代码，只会打包一次
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    mode: 'production',
}
