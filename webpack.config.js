module.exports = {
    mode: 'development',
    
    entry: './frontend/frontendIndex.ts', //ファイルをまとめる際のエントリーポイント
    output: {
      //  path: __dirname,      
      path: __dirname + '/public/javascripts', 
      filename: 'bundle.js' //まとめた結果出力されるファイル名
    },
    resolve: {
      extensions: ['.ts', '.js'] //拡張子がtsだったらTypescirptでコンパイルする
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader' //ts-loader使用
        }
      ]
    },
    devtool:'inline-source-map' //ソースマップの設定　これがないとbundle.jsのままだからデバッグできない  https://qiita.com/morrr/items/0f35adc38b59f5a67141
  }