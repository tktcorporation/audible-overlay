install:
	# Rustupの更新とインストール
	rustup update
	rustup install nightly
	# 必要なコンポーネントの追加
	rustup component add clippy rustfmt rust-analysis rust-src rls
	rustup component add clippy --toolchain nightly-$(shell rustup show active-toolchain | awk '{print $$1}' | cut -d '-' -f2-)
	# cargo-binstallのインストール
	cargo install cargo-binstall
	# sccacheのインストールと環境変数の設定
	cargo binstall sccache --locked && export RUSTC_WRAPPER=$$(which sccache)
	# その他ツールのインストール
	cargo binstall cargo-watch cargo-edit cargo-hack
	cargo binstall cargo-audit
	# tauri
	cargo binstall create-tauri-app
