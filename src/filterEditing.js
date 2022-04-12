// 編集中ファイルを絞り込みし、選んだ行へジャンプする（重複行の場合はその1つめにジャンプする）

function getEncode() {
  if (GetCharCode() == 0/*SJIS */) return "cp932";
  if (GetCharCode() == 4/*UTF-8*/) return "utf_8";
  MessageBox("ERROR : encode [" + GetCharCode() + "]");
  exit();
}

function getEncode_for_ADODB() {
  if (GetCharCode() == 0/*SJIS */) return "shift_jis";
  if (GetCharCode() == 4/*UTF-8*/) return "utf-8";
  MessageBox("ERROR : encode [" + GetCharCode() + "]");
  exit();
}

function getMacroDir() { // 上位層のコードをコードの左側だけパッと見ても読めること、という基準でwrapした。以降も同様。
  return Editor.ExpandParameter('$M').replace(/^(.+?)[^\\\/]+$/g,'$1');
}

function getFileSystem() {
  return new ActiveXObject("Scripting.FileSystemObject");
}

function existsFile(filename, fso) {
  return fso.FileExists(filename);
}

function deleteFile(filename, fso) {
  if (!fso.FileExists(filename)) return;
  execCmd("cmd /c del " + filename);
}

function filterEditing(macroDir, nowEditName, resultName, migemoDict, encode) {
  var exeName = macroDir + "miniIncrementalSearchFilter\\miniIncrementalSearchFilter.exe";
  var cmd = exeName + " " + nowEditName + " " + resultName + " --encode " + encode + " --andsearch --migemo " + migemoDict
  execCmd(cmd);
}

function execCmd(cmd) {
  var shell = new ActiveXObject('Wscript.Shell');
  shell.Run(cmd, 1, true/*同期実行*/);
}

function jump(resultName, fso) {
  /*
  備忘
    FileOpen して GetLineStr は、できない
      なぜ？
        「macro実行開始した編集中ファイル」以外のファイルを、macro対象にできないので。
      どう対処した？
        ActiveXObject("ADODB.Stream") を使った
    FileSystemObjectのOpenTextFileしてReadAllは、編集中ファイルがUTF-8のとき文字化けする
      なぜ？
        OpenTextFile がUTF-8に対応していないため読み込んだデータが文字化けする
      どう対処した？
        ActiveXObject("ADODB.Stream") を使った
  */
  // read
  var adodbobj = new ActiveXObject("ADODB.Stream");
  adodbobj.Type = 2/*file type : text*/;
  adodbobj.charset = getEncode_for_ADODB();
  adodbobj.Open();
  adodbobj.LoadFromFile(resultName);
  var searchString = adodbobj.ReadText(-1/*ファイル全体をread*/);
  adodbobj.Close();
  // jump
  MoveCursor(1, 1, 0);
  SearchNext(searchString);
  // 選択範囲を解除
  Editor.CancelMode();
}

function main() {
  var macroDir    = getMacroDir();
  var nowEditName = GetFilename();
  var resultName  = macroDir + "work\\result.js";
  var migemoDict  = macroDir + "miniIncrementalSearchFilter\\dict\\migemo-dict"; // なお日本語を含むディレクトリ名だとエラーなく「期待値と違う動作」になる。シンボリックリンクディレクトリの場合は実体側が日本語ディレクトリ名だとそうなる。なお秀丸やMeryでは日本語ディレクトリ名でも問題なかった。予想、おそらく秀丸やサクラエディタはcmd経由ではなく直接実行しているから。
  var fso         = getFileSystem();

  deleteFile(resultName, fso); // キャンセル時に前回のファイルを実行しない用
  filterEditing(macroDir, nowEditName, resultName, migemoDict, getEncode());
  if (existsFile(resultName, fso)) {
    jump(resultName, fso);
  }
}


//
main();
