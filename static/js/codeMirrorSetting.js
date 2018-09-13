/**
 Version v0.0.1
 User songshuzhong@bonc.com.cn
 Copyright (C) 1997-present BON Corporation All rights reserved.
 ------------------------------------------------------------
 Date         Author          Version            Description
 ------------------------------------------------------------
 2018年8月9日 songshuzhong    v0.0.1            修复组件通信
 2018年9月3日 songshuzhong    v0.0.2            重构代码结构、页面布局、代码提示
 */
var codeMirrorSetting = {
    codeMirrorConfig: {
        theme: "dracula",
        mode: "text/x-java",
        lineNumbers: true,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
          "'<'": completeAfter,
          "'/'": completeIfAfterLt,
          "' '": completeIfInTag,
          "'='": completeIfInTag,
          "Ctrl-Space": "autocomplete"
        }
    },
    codeJsConfig: {
        theme: "dracula",
        mode: "text/javascript",
        lineNumbers: true,
        lineWrapping: true,
        foldGutter: true,
        extraKeys: {
          "Ctrl-/": "autocomplete",
          "'.'": completeAfter
        },
    },
    codeCsConfig: {
        theme: "dracula",
        mode: "text/css",
        lineNumbers: true,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
          "'.'": completeAfter,
          "Ctrl-Space": "autocomplete"
        }
    }
};

var editorialHtmlHelper = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), codeMirrorSetting.codeMirrorConfig);
var editorialCsHelper = CodeMirror.fromTextArea(document.getElementById('csEditor'), codeMirrorSetting.codeCsConfig);
var editorialJsHelper = CodeMirror.fromTextArea(document.getElementById('jsEditor'), codeMirrorSetting.codeJsConfig);



function completeAfter(cm, pred) {
  let cur = cm.getCursor();
  if (!pred || pred()) setTimeout(function() {
    if (!cm.state.completionActive)
      cm.showHint({completeSingle: false});
  }, 100);
  return CodeMirror.Pass;
}

function completeIfAfterLt(cm) {
  return completeAfter(cm, function() {
    let cur = cm.getCursor();
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
  });
}

function completeIfInTag(cm) {
  return completeAfter(cm, function() {
    var tok = cm.getTokenAt(cm.getCursor());
    if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
    var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
}

editorialHtmlHelper.setSize('100%', '100%');
editorialCsHelper.setSize('100%', '100%');
editorialJsHelper.setSize('100%', '100%');