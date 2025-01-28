# Audible Overlay

[日本語](./README_JA.md) | English

A desktop application that displays audio input levels as an overlay on your desktop.

## Features

- Always-on-top overlay display on desktop
- Real-time monitoring of audio input device levels (e.g., microphone)
- Multiple input device selection support
- Semi-transparent overlay design that minimizes interference with desktop work

## Technology Stack

- [Tauri](https://tauri.app/) - Cross-platform desktop application framework
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Rust](https://www.rust-lang.org/) - Backend processing

## Development Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/)
- [pnpm](https://pnpm.io/)

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Running the Application

1. Install dependencies
```bash
pnpm install
```

2. Start in development mode
```bash
pnpm tauri dev
```

## Usage

1. When you launch the application, the input device selection screen will be displayed
2. Select the audio input device you want to use
3. An overlay window will appear on the screen, showing the audio level of the selected device in real-time
4. The overlay is click-through, so it won't interfere with your normal work

## License

Released under the [MIT License](LICENSE).
