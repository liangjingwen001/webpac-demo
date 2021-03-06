/*
    开发环境配置:npx webpack-dev-server
    HMR: hot module replacement 模块热替换
    作用：一个模块发生变化，只会重新打包这个模块
    css文件：可以使用HMR，style-loader内部实现了
    js文件：默认不能使用HMR
    html文件：默认不能使用HMR，同时导致热更新功能不能使用，解决方法，修改entry字段
*/

// resolve是nodejs里面拼接绝对路径的方法
const {resolve} = require('path')

// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 设置nodeJS环境变量
process.env.NODE_ENV = 'development';

// webpack配置文件
module.exports = {
    // 解决webpack5在package.json中加了browserslist后热更新功能失效的问题
    target: "web",
    entry: ['./src/index.js', './src/index.html'],
    output: {
        filename: 'js/build.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif|jpeg)$/,
                loader: 'url-loader',
                options: {
                    limit: 30 * 1024,
                    esModule: false,
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs'
                }
            },
            {
                test: /\.(html)$/,
                loader: 'html-loader'
            },
            {
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
            template: './src/index.html'
        })
    ],
    mode: 'development',

    // 开发服务器devServer: 用来自动化（自动编辑，自动打开浏览器，自动刷新浏览器）
    // 只会在内存中打包，不会有任何输出，会监听src下面的代码
    // 启动指令：npx webpack-dev-server
    // 会有兼容问题："webpack-dev-server": "^3.11.0"和"webpack-cli": "^3.3.12"相互兼容
    devServer: {
        // 项目构建后的路径
        contentBase: resolve(__dirname, 'build'),
        // 开启gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true,
        // 模块热更新
        hot: true
    },
    devtool: 'eval-source-map'
}

/**
 * source-map：一种提供原代码和构建后代码映射关系的技术
 * 
 * [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
 * 
 * source-map：外联（提示错误代码在原代码里面的正确位置）
 * inline-source-map：内联（只生成一个source-map，提示错误代码在原代码里面的正确位置）
 * hidden-source-map：外联（只能提示错误代码在构建后代码里面的位置）
 * eval-source-map：内联（每一个文件都生成对应的source-map）
 * nosources-source-map：外联   
 * cheap-source-map：外联
 * cheap-module-source-map：外联（module会将loader的source map假如）
 * 
 * 内联和外联的区别：1.外联外部生成了文件，内联内有；2.内联构建速度快
 * 开发环境：eval-source-map（最优）
 * 生产环境：
 * 
 */
