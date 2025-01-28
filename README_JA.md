# Audible Overlay

[English](./README.md) | 日本語

オーディオ入力レベルをデスクトップ上にオーバーレイ表示するアプリケーションです。

## 機能概要

- デスクトップ上に常に最前面でオーバーレイ表示
- マイクなどの音声入力デバイスのレベルをリアルタイムモニタリング
- 複数の入力デバイスから選択可能
- 透過的なオーバーレイでデスクトップ作業の邪魔になりにくい設計

## 技術スタック

- [Tauri](https://tauri.app/) - クロスプラットフォームデスクトップアプリケーションフレームワーク
- [React](https://react.dev/) - UIフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な JavaScript
- [Rust](https://www.rust-lang.org/) - バックエンド処理

## 開発環境のセットアップ

### 必要な環境

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/)
- [pnpm](https://pnpm.io/)

### 推奨IDE設定

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## アプリケーションの起動方法

1. 依存関係のインストール
```bash
pnpm install
```

2. 開発モードでの起動
```bash
pnpm tauri dev
```

## 使用方法

1. アプリケーション起動時に入力デバイス選択画面が表示されます
2. 使用したい音声入力デバイスを選択します
3. オーバーレイウィンドウが画面上に表示され、選択したデバイスの音声レベルをリアルタイムで表示します
4. オーバーレイはマウス操作を透過するため、通常の作業の妨げになりません

## ライセンス

[MITライセンス](LICENSE)の下で公開されています。 