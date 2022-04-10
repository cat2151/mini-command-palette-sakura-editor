// コマンドパレット用リスト作成

function getMacroDir() {
  return Editor.ExpandParameter('$M').replace(/^(.+?)[^\\\/]+$/g,'$1');
}

function getFileSystem() {
  return new ActiveXObject("Scripting.FileSystemObject");
}

function existsFile(filename, fso) {
  return fso.FileExists(filename);
}

function createCustom(customSample, customName) {
  var cmd = "cmd /c copy " + customSample + " " + customName;
  execCmd(cmd);
}

function createMacroList(macroDir, macroListName) {
  var cmd = "cmd /c dir /s /b " + macroDir + "..\\*.js > " + macroListName;
  execCmd(cmd);
}

function execCmd(cmd) {
  var shell = new ActiveXObject('Wscript.Shell');
  shell.Run(cmd, 1, true/*同期実行*/);
}

function editMacroList(macroListName, fso) {
  /*
  備忘
    FileOpen して ReplaceAll は、できない
      なぜ？
        「macro実行開始した編集中ファイル」以外のファイルを、macro対象にできないので。
      どう対処した？
        FileSystemObjectのOpenTextFileしてReadAllし、replaceして、Writeした
  */
  // read
  mac = fso.OpenTextFile(macroListName, 1).ReadAll();
  // edit
  mac = mac.replace(/(.\:\\.*\\)(.*)(\r\n)/g, '\/\*$2\*\/ExecExternalMacro\(\"$1$2\"\)$3');
  mac = mac.replace(/(\\)/g, '$1$1');
  // write
  f = fso.OpenTextFile(macroListName, 2);
  f.Write(mac);
  f.Close();
}

function mixFile(input1, input2, output, fso) {
  // read
  str1 = fso.OpenTextFile(input1, 1).ReadAll();
  str2 = fso.OpenTextFile(input2, 1).ReadAll();
  // write
  f = fso.OpenTextFile(output, 2);
  f.Write(str1 + str2);
  f.Close();
}

function main() {
  var macroDir     = getMacroDir();
  var totalName    = macroDir + "work\\list.js";
  var customSample = macroDir + "custom_sample.js";
  var customName   = macroDir + "custom.js";
  var fso          = getFileSystem();

  if (!existsFile(customName, fso)) {
    createCustom(customSample, customName);
  }
  createMacroList(macroDir, totalName);
  editMacroList(totalName, fso);
  mixFile(customName, totalName, totalName, fso);
}


//
main();
