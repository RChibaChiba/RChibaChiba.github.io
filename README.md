# ee calculator

温度・ee・ΔΔG の関係を計算する、依存関係のない GitHub Pages 向け静的サイトです。

## GitHub Pages で公開する

GitHub リポジトリの **Settings** → **Pages** を開き、**Build and deployment** の Source に **Deploy from a branch**、Branch に `main` と `/ (root)` を選んで保存します。数分後、Pages に表示される URL で公開されます。

## 計算の前提

主生成物が有利な場合に ΔΔG を正として、`ΔΔG = RT ln[(1+ee)/(1-ee)]` を使っています。温度範囲で ΔΔG が一定であり、選択性が熱力学的に支配されるという近似です。
