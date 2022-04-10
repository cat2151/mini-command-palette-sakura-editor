// 簡易コマンドパレット

function getMacroDir() { // 上位層のコードをコードの左側だけパッと見ても読めること、という基準でwrapした。以降も同様。
  return Editor.ExpandParameter('$M').replace(/^(.+?)[^\\\/]+$/g,'$1');
}

function getFileSystem() {
  return new ActiveXObject("Scripting.FileSystemObject");
}

function existsFile(filename, fso) {
  return fso.FileExists(filename);
}

function execMacro(filename) {
  ExecExternalMacro(filename);
}

function deleteFile(filename, fso) {
  if (!fso.FileExists(filename)) return;
  execCmd("cmd /c del " + filename);
}

function selectMacro(macroDir, totalName, resultName, migemoDict) {
  var exeName = macroDir + "miniIncrementalSearchFilter\\miniIncrementalSearchFilter.exe";
  var cmd = exeName + " " + totalName + " " + resultName + " --encode cp932 --andsearch --migemo " + migemoDict
  execCmd(cmd);
}

function execCmd(cmd) {
  var shell = new ActiveXObject('Wscript.Shell');
  shell.Run(cmd, 1, true/*同期実行*/);
}

function main() {
  var macroDir   = getMacroDir();
  var totalName  = macroDir + "work\\list.js";
  var resultName = macroDir + "work\\result.js";
  var migemoDict = macroDir + "dict\\migemo-dict"; // なお日本語を含むディレクトリ名だとエラーなく「期待値と違う動作」になる。シンボリックリンクディレクトリの場合は実体側が日本語ディレクトリ名だとそうなる。なお秀丸やMeryでは日本語ディレクトリ名でも問題なかった。予想、おそらく秀丸やサクラエディタはcmd経由ではなく直接実行しているから。
  var reloadName = macroDir + "createList.js";
  var fso        = getFileSystem();

  if (!existsFile(totalName, fso)) {
    execMacro(reloadName);
  }
  deleteFile(resultName, fso); // キャンセル時に前回のファイルを実行しない用
  selectMacro(macroDir, totalName, resultName, migemoDict);
  if (existsFile(resultName, fso)) {
    execMacro(resultName);
  }
}


//
main();
