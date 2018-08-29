var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    devServer: {
        contentBase: './src'
    },
    entry: {
        'plugin': './src/index.ts'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './static/index.html'
        })
    ]
}
