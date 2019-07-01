const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBar = require("webpackbar");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const Critters = require("critters-webpack-plugin");

const env = process.env.NODE_ENV || "production";
const paths = {
  src: path.join(__dirname, "src")
};
const plugins = [
  new CleanWebpackPlugin(),
  new WebpackBar(),
  new HtmlWebpackPlugin({
    template: "src/index.html"
  }),
  new MiniCssExtractPlugin({
    filename: "[name].css"
  })
];

if (env === "production") {
  plugins.push(
    new PurgecssPlugin({
      paths: glob.sync(`${paths.src}/**/*`, { nodir: true })
    })
  );
  plugins.push(new Critters());
}

module.exports = {
  mode: env,
  entry: {
    app: path.join(paths.src, "app.js")
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        loader: "file-loader",
        query: {
          outputPath: "./img/",
          name: "[name].[ext]?[hash]"
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        query: {
          outputPath: "./fonts/",
          name: "[name].[ext]?[hash]"
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
