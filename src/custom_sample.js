/*コマンドパレットをリロード*/ var macroWorkDir = Editor.ExpandParameter('$M').replace(/^(.+?)[^\\\/]+$/g,'$1'); ExecExternalMacro(macroWorkDir + "..\\createList.js"); ExecExternalMacro(macroWorkDir + "..\\miniCommandPalette.js");
/*コマンドパレットをカスタマイズ*/ var macroWorkDir = Editor.ExpandParameter('$M').replace(/^(.+?)[^\\\/]+$/g,'$1'); FileOpen(macroWorkDir + "..\\custom.js");
/*編集中ファイルを絞り込み*/ var macroWorkDir = Editor.ExpandParameter('$M').replace(/^(.+?)[^\\\/]+$/g,'$1'); ExecExternalMacro(macroWorkDir + "..\\filterEditing.js");

使用法：
  文字をタイプして絞り込み、上下で選んでENTERで決定、ESCでキャンセル
  （migemoなので、例えばsiyouとタイプするだけで「使用」を入力したのと同じ効果があります）

↓ここから下にはサクラエディタマクロの一覧が生成されます
