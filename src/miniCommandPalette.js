// �ȈՃR�}���h�p���b�g

function getMacroDir() { // ��ʑw�̃R�[�h���R�[�h�̍��������p�b�ƌ��Ă��ǂ߂邱�ƁA�Ƃ������wrap�����B�ȍ~�����l�B
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
  shell.Run(cmd, 1, true/*�������s*/);
}

function main() {
  var macroDir   = getMacroDir();
  var totalName  = macroDir + "work\\list.js";
  var resultName = macroDir + "work\\result.js";
  var migemoDict = macroDir + "dict\\migemo-dict"; // �Ȃ����{����܂ރf�B���N�g�������ƃG���[�Ȃ��u���Ғl�ƈႤ����v�ɂȂ�B�V���{���b�N�����N�f�B���N�g���̏ꍇ�͎��̑������{��f�B���N�g�������Ƃ����Ȃ�B�Ȃ��G�ۂ�Mery�ł͓��{��f�B���N�g�����ł����Ȃ������B�\�z�A�����炭�G�ۂ�T�N���G�f�B�^��cmd�o�R�ł͂Ȃ����ڎ��s���Ă��邩��B
  var reloadName = macroDir + "createList.js";
  var fso        = getFileSystem();

  if (!existsFile(totalName, fso)) {
    execMacro(reloadName);
  }
  deleteFile(resultName, fso); // �L�����Z�����ɑO��̃t�@�C�������s���Ȃ��p
  selectMacro(macroDir, totalName, resultName, migemoDict);
  if (existsFile(resultName, fso)) {
    execMacro(resultName);
  }
}


//
main();
