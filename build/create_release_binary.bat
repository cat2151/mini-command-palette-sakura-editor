@powershell -NoProfile -ExecutionPolicy Unrestricted "$s=[scriptblock]::create((gc \"%~f0\"|?{$_.readcount -gt 1})-join\"`n\");&$s" %*&goto:eof

function copy_files() {
    mkdir miniCommandPalette\work
    "dummy" > miniCommandPalette\work\dummy.txt # zipに work/ を入れる用
    copy ..\README.md                 miniCommandPalette
    copy ..\src\miniCommandPalette.js miniCommandPalette
    copy ..\src\createList.js         miniCommandPalette
    copy ..\src\custom_sample.js      miniCommandPalette
    copy ..\src\filterEditing.js      miniCommandPalette
}

function compress() {
    Compress-Archive -Path miniCommandPalette -DestinationPath miniCommandPalette.zip
}

function main() {
    copy_files
    compress
    Remove-Item miniCommandPalette -Recurse
}


###
main
