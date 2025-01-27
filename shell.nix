{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Rust関連
    rustc
    cargo
    
    # システム依存ライブラリ
    pkg-config
    openssl
    glib
    gtk3
    # macOSの場合はwebkit2gtkは不要（代わりにdarwin.apple_sdk.frameworks.WebKitを使用）
    libsoup_2_4
    
    # その他の開発ツール
    nodejs
    yarn
    direnv
    nix-direnv
    # macOS固有の依存関係
    darwin.apple_sdk.frameworks.CoreServices
    darwin.apple_sdk.frameworks.WebKit
    darwin.apple_sdk.frameworks.Cocoa
    darwin.apple_sdk.frameworks.Security
    darwin.libobjc
  ];

  shellHook = ''
    export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath [
      pkgs.gtk3
    ]}"
    export RUST_BACKTRACE=1
    export RUSTFLAGS="-C target-cpu=native"
    
    if [ -d "/Applications/Cursor.app" ]; then
      alias cursor="open -a Cursor"
      echo "Cursor is available via 'cursor' command"
    else
      echo "Please install Cursor from https://cursor.sh"
    fi
  '';

  # フレームワーク検索パス設定
  NIX_LDFLAGS = pkgs.lib.optionalString pkgs.stdenv.isDarwin
    "-F${pkgs.darwin.apple_sdk.frameworks.CoreServices}/Library/Frameworks";
  
  PKG_CONFIG_PATH = "${pkgs.openssl.dev}/lib/pkgconfig";
} 