# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

返答・コードのコメント・UI のテキスト・コミットメッセージは日本語で書くこと。

## プロジェクト概要

- プロジェクト名: task_form
- 概要: タスクの追加・完了切り替え・期限日設定・削除ができるタスクボード
- 技術スタック: React 19 + Vite（JavaScript）、テストは Vitest
- データ保存: ブラウザの localStorage（キー `task-board/tasks`）。サーバーはない。以前の版のキー `task-app.tasks` のデータは初回読み込み時に引き継ぐ
- GitHub リポジトリ: https://github.com/insight-navi/task-app

## ディレクトリ構成

- `src/App.jsx` — 画面とタスク操作（追加・完了切り替え・期限変更・削除）
- `src/App.css` — スタイル。期限間近は `.due-soon`（赤太字）、完了済みは `.completed`（グレー）
- `src/utils/date.js` — 期限日の計算。期限間近の判定は `isDueSoon`（期限まで3日以内、期限切れを含む、完了済みは対象外）
- `src/utils/storage.js` — localStorage への保存・読み込み（壊れたデータや保存不可の環境では空で始める）
- `src/utils/*.test.js` — 各ユーティリティのテスト

## 開発コマンド

```bash
npm install      # 依存パッケージのインストール
npm run dev      # 開発サーバー起動（http://localhost:5173）
npm test         # テスト実行
npm run build    # 本番ビルド（dist/ に出力）
```

## 公開（GitHub Pages）

- `main` ブランチにプッシュすると、`.github/workflows/deploy.yml` がテスト → ビルド → GitHub Pages への公開を自動で行う
- テストが失敗すると公開されない。プッシュ前に `npm test` と `npm run build` を通しておく
- `vite.config.js` の `base: './'` は Pages のサブパス配信用。消すと公開先で画面が真っ白になる
- 公開URL: https://insight-navi.github.io/task-app/

## コーディング規約

- 既存コードのスタイル（命名、インデント、コメントの量）に合わせる
- コメントやドキュメントは日本語で書く
- 1つの変更で関係のない修正を混ぜない

## Git 運用ルール

### 基本方針

- **コードを変更するたびに、コミットして GitHub にプッシュすること。**
  - 変更をローカルに溜め込まない。1つの作業単位が終わったら、すぐにコミット・プッシュする
  - プッシュ前に、テストやビルドがあれば実行し、通ることを確認する
  - プッシュに失敗した場合（認証エラー、リモートとの競合など）は、強制プッシュせずにユーザーに報告する

### 手順

```bash
git status                 # 変更内容を確認
git add <変更したファイル>   # 関係するファイルだけをステージする
git commit -m "<メッセージ>"
git push
```

### コミットメッセージ

- 日本語で、何をなぜ変えたかを簡潔に書く
- 1行目は50文字程度の要約、必要なら空行の後に詳細を書く
- 例: `フォームに期限日の入力欄を追加`

### 禁止事項

- `git push --force` は、ユーザーの明示的な指示がない限り使わない
- `.env` や認証情報、APIキーを含むファイルはコミットしない（`.gitignore` に追加する）
- `--no-verify` でフックを飛ばさない
