eval "$(direnv hook zsh)"

# nix-direnvの設定
if [ -e ~/.nix-profile/share/nix-direnv/direnvrc ]; then
  source ~/.nix-profile/share/nix-direnv/direnvrc
fi 