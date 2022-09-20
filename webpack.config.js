import { resolve as _resolve } from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const config = {
  entry: "./src/index.js",
  output: {
    path: _resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?js$/,
        type: "javascript/auto",
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: ({ htmlWebpackPlugin }) =>
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' +
        htmlWebpackPlugin.options.title +
        '</title></head><body><div id="app"></div></body></html>',
      filename: "index.html",
      title: "Battleships",
    }),
  ],
}

export default config
