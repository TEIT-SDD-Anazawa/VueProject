# Vue 3 + Vuetify 3 Sample

準備とビルド手順:

1. プロジェクトルートに移動:

```powershell
cd c:\Users\tomohiro.anazawa\.git\VueProject
```

2. 依存関係をインストール:

```powershell
npm install
```

3. 開発サーバー起動:

```powershell
npm run dev
```

4. ビルド:

```powershell
npm run build
```

ビルド確認とプレビュー:

```powershell
# ビルド成果物を確認
Get-ChildItem -Recurse .\dist\ | Select-Object FullName, Length

# 簡易プレビュー (ローカルで確認する場合)
npx serve dist
```
