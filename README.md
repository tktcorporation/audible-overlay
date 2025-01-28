# Audible Overlay

A desktop application that displays audio input levels as an overlay on your desktop.

デスクトップ上にオーディオ入力レベルをオーバーレイ表示するアプリケーションです。

## Features / 機能概要

- Always-on-top overlay display on desktop
- Real-time monitoring of audio input device levels (e.g., microphone)
- Multiple input device selection support
- Semi-transparent overlay design that minimizes interference with desktop work

- デスクトップ上に常に最前面でオーバーレイ表示
- マイクなどの音声入力デバイスのレベルをリアルタイムモニタリング
- 複数の入力デバイスから選択可能
- 透過的なオーバーレイでデスクトップ作業の邪魔になりにくい設計

## Technology Stack / 技術スタック

- [Tauri](https://tauri.app/) - Cross-platform desktop application framework / クロスプラットフォームデスクトップアプリケーションフレームワーク
- [React](https://react.dev/) - UI framework / UIフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript / 型安全な JavaScript
- [Rust](https://www.rust-lang.org/) - Backend processing / バックエンド処理

## Development Environment Setup / 開発環境のセットアップ

### Prerequisites / 必要な環境

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/)
- [pnpm](https://pnpm.io/)

### Recommended IDE Setup / 推奨IDE設定

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Running the Application / アプリケーションの起動方法

1. Install dependencies / 依存関係のインストール
```bash
pnpm install
```

2. Start in development mode / 開発モードでの起動
```bash
pnpm tauri dev
```
