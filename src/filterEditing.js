// �ҏW���t�@�C�����i�荞�݂��A�I�񂾍s�փW�����v����i�d���s�̏ꍇ�͂���1�߂ɃW�����v����j

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

function getMacroDir() { // ��ʑw�̃R�[�h���R�[�h�̍��������p�b�ƌ��Ă��ǂ߂邱�ƁA�Ƃ������wrap�����B�ȍ~�����l�B
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
  shell.Run(cmd, 1, true/*�������s*/);
}

function jump(resultName, fso) {
  /*
  ���Y
    FileOpen ���� GetLineStr �́A�ł��Ȃ�
      �Ȃ��H
        �umacro���s�J�n�����ҏW���t�@�C���v�ȊO�̃t�@�C�����Amacro�Ώۂɂł��Ȃ��̂ŁB
      �ǂ��Ώ������H
        ActiveXObject("ADODB.Stream") ���g����
    FileSystemObject��OpenTextFile����ReadAll�́A�ҏW���t�@�C����UTF-8�̂Ƃ�������������
      �Ȃ��H
        OpenTextFile ��UTF-8�ɑΉ����Ă��Ȃ����ߓǂݍ��񂾃f�[�^��������������
      �ǂ��Ώ������H
        ActiveXObject("ADODB.Stream") ���g����
  */
  // read
  var adodbobj = new ActiveXObject("ADODB.Stream");
  adodbobj.Type = 2/*file type : text*/;
  adodbobj.charset = getEncode_for_ADODB();
  adodbobj.Open();
  adodbobj.LoadFromFile(resultName);
  var searchString = adodbobj.ReadText(-1/*�t�@�C���S�̂�read*/);
  adodbobj.Close();
  // jump
  MoveCursor(1, 1, 0);
  SearchNext(searchString);
  // �I��͈͂�����
  Editor.CancelMode();
}

function main() {
  var macroDir    = getMacroDir();
  var nowEditName = GetFilename();
  var resultName  = macroDir + "work\\result.js";
  var migemoDict  = macroDir + "miniIncrementalSearchFilter\\dict\\migemo-dict"; // �Ȃ����{����܂ރf�B���N�g�������ƃG���[�Ȃ��u���Ғl�ƈႤ����v�ɂȂ�B�V���{���b�N�����N�f�B���N�g���̏ꍇ�͎��̑������{��f�B���N�g�������Ƃ����Ȃ�B�Ȃ��G�ۂ�Mery�ł͓��{��f�B���N�g�����ł����Ȃ������B�\�z�A�����炭�G�ۂ�T�N���G�f�B�^��cmd�o�R�ł͂Ȃ����ڎ��s���Ă��邩��B
  var fso         = getFileSystem();

  deleteFile(resultName, fso); // �L�����Z�����ɑO��̃t�@�C�������s���Ȃ��p
  filterEditing(macroDir, nowEditName, resultName, migemoDict, getEncode());
  if (existsFile(resultName, fso)) {
    jump(resultName, fso);
  }
}


//
main();
