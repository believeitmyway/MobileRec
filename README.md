# Android スマートフォン用 姿勢検出デモアプリ

スマートフォンのカメラを使ってリアルタイムで体の姿勢を検出し、ワイヤーフレームを表示するデモアプリです。

## 特徴

- 📱 **スマートフォン対応**: Android/iOSのブラウザで動作
- 🎥 **リアルタイム処理**: 端末上で高速に動作
- 🎯 **姿勢検出**: TensorFlow.js MoveNetを使用して体の17個のキーポイントを検出
- 🖼️ **ワイヤーフレーム表示**: 検出した姿勢をリアルタイムで可視化
- 🔄 **カメラ切替**: フロント/バックカメラの切り替えが可能
- ⚡ **軽量**: HTML1ファイルで完結するシンプルな構成

## 使い方

### 1. ファイルの配置

`index.html` をWebサーバーに配置するか、ローカルで開きます。

### 2. スマートフォンでアクセス

#### 方法A: 簡単な方法（Pythonを使用）
```bash
# プロジェクトフォルダで以下のコマンドを実行
python3 -m http.server 8000
```

その後、スマートフォンのブラウザから以下にアクセス：
- 同じWi-Fiネットワーク上のPCのIPアドレス:8000
- 例: `http://192.168.1.100:8000`

#### 方法B: GitHub Pagesを使用
1. このリポジトリをGitHubにプッシュ
2. Settings → Pages → Sourceで "main" ブランチを選択
3. 生成されたURLにスマートフォンでアクセス

### 3. アプリの使用

1. ブラウザで `index.html` を開く
2. 「カメラを起動」ボタンをタップ
3. カメラへのアクセスを許可
4. 画面に体が映ると自動的に姿勢が検出され、ワイヤーフレームが表示されます
5. 「カメラ切替」ボタンでフロント/バックカメラを切り替え可能

## 技術仕様

### 使用技術
- **TensorFlow.js 4.11.0**: 機械学習ライブラリ
- **Pose Detection 2.1.0**: 姿勢検出モデル
- **MoveNet Lightning**: 軽量・高速な姿勢検出モデル

### 検出されるキーポイント（17箇所）
- 鼻、左目、右目、左耳、右耳
- 左肩、右肩、左肘、右肘、左手首、右手首
- 左腰、右腰、左膝、右膝、左足首、右足首

### ブラウザ要件
- カメラアクセスをサポートするモダンブラウザ
  - Chrome for Android
  - Safari (iOS 14+)
  - Firefox for Android
- **注意**: HTTPSまたはlocalhostからのアクセスが必要（カメラアクセスのため）

## パフォーマンス

- **FPS**: 通常15-30 FPS（端末の性能による）
- **レイテンシ**: 低遅延（端末上で処理）
- **モデル**: MoveNet Lightning（最軽量版）を使用

## トラブルシューティング

### カメラが起動しない
- ブラウザのカメラ権限を確認してください
- HTTPSまたはlocalhostからアクセスしているか確認してください
- 他のアプリがカメラを使用していないか確認してください

### 動作が遅い
- ブラウザを再起動してみてください
- 他のタブやアプリを閉じてください
- 端末のパフォーマンスモードを有効にしてください

### 姿勢が正しく検出されない
- 明るい場所で使用してください
- カメラから1-3メートルの距離で全身が映るようにしてください
- 体全体がフレームに収まるようにしてください

## カスタマイズ

### 検出精度の調整
`index.html` の以下の行を編集：
```javascript
const minConfidence = 0.3; // 0.0-1.0の範囲で調整
```

### ワイヤーフレームの色変更
```javascript
ctx.strokeStyle = '#00ff00'; // お好みの色に変更
ctx.fillStyle = '#00ff00';
```

### モデルの変更
より高精度なモデルが必要な場合：
```javascript
detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER // より高精度
    }
);
```

## ライセンス

このデモアプリは教育・デモンストレーション目的で作成されています。

## 参考リンク

- [TensorFlow.js](https://www.tensorflow.org/js)
- [Pose Detection Model](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection)
- [MoveNet](https://blog.tensorflow.org/2021/05/next-generation-pose-detection-with-movenet-and-tensorflowjs.html)
