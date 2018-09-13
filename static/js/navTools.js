/**
 Version v0.0.4
 User songshuzhong@bonc.com.cn
 ------------------------------------------------------------
 Date         Author          Version            Description
 ------------------------------------------------------------
 2018年9月9日 songshuzhong    v0.0.4            采用sequelize持久化解决方案
 */
window.editorNodeIds = [];
window. editorNodeRes = [];

function initLayout( pageModel ) {
  if ( pageModel ) {
    let pageText = pageModel.pageText;
    let pageJs = pageModel.pageJs;
    let pageStyle = pageModel.pageStyle;

    $( '#v-main-container' ).html( pageText );
    $( '#v-pureHtmlTemplate' ).contents().find( '#v-main-container' ).html( pageText );
    $( 'head' ).append( $( pageStyle.trim() ) );
    $( 'body' ).append( $( pageJs.trim() ) );
  }
}

function saveLayout( target ) {
  if ( target ) {
    let jss = "";
    let css = "";
    $( 'head link').each( function( index, cs ) { if ( cs.getAttribute( 'id' ) ) { css += cs.outerHTML; } } );
    $( 'head style').each( function( index, cs ) { if ( cs.getAttribute( 'id' ) ) { css += cs.outerHTML; } } );
    $( 'body script' ).each( function( index, js ) { if( js.getAttribute( 'id' ) ){ jss += js.outerHTML; } } );
  }
}

function cleanLayout( e ) {
  if ( e ) {
    let tag = findParentDragHelper( e );
    collectNodesRes( e );
    $( '#v-pureHtmlTemplate' ).contents().find( '#' + tag.id  ).remove();
    $( '#' + tag.id ).remove();
    $( '#' + tag.id + 'cs' ).remove();
    $( '#' + tag.id + 'js' ).remove();
    try {
      window.editorNodeRes.forEach( function( item ) {
        let t = $( '#' + item );
        let count = parseInt( t.attr( 'data-count' ) );

        count? t.attr( 'data-count', --count ): t.remove();
      } );
      window.editorNodeIds.forEach( function( item ) {
        $( '#' + item + 'js' ).remove();
        $( '#' + item + 'cs' ).remove();
      } );
    } catch( e ) {
      alert( e.toString() );
    } finally {
      window.editorNodeRes = []; window.editorNodeIds = [];
    }
  } else {
    let jss = $( 'script' );
    let css = $( 'style' );

    for ( let i = 0, length = jss.length; i < length; i++ ) {
      if ( $( jss[ i ] ).attr( 'id' ) && $( jss[ i ] ).attr( 'id' ) ) {
        $( jss[ i ] ).remove();
      }
    }
    for ( let i = 0, length = css.length; i < length; i++ ) {
      if ( $( css[ i ] ).attr( 'id' ) && $( css[ i ] ).attr( 'id' ) ) {
        $( css[ i ] ).remove();
      }
    }

    css = $( 'link' );
    for ( let i = 0, length = css.length; i < length; i++ ) {
      if ( $( css[ i ] ).attr( 'id' ) && $( css[ i ] ).attr( 'id' ) ) {
        $( css[ i ] ).remove();
      }
    }

    $( '#v-main-container' ).empty();
    $( '#v-pureHtmlTemplate' ).contents().find( '#v-main-container' ).empty();
  }

  saveLayout( e  );
}

function purifyLayout() {
  let t = $( '#v-pureHtmlTemplate' ).contents().find( '#v-main-container' ).clone();

  t.find( '#view-editor' ).each( function() { cleanSelf( this ) } );

  delUUID( t[ 0 ] );

  return t.html();
}

function collectHtml( e ) {
  let target = null;

  if ( e ) {
    target = findParentDragHelper( e ).id;
    target = $( '#v-pureHtmlTemplate' ).contents().find( '#' + target ).prop( 'outerHTML' );
  } else {
    target = $( '#v-pureHtmlTemplate' ).contents().find( '#v-main-container' ).html();
  }

  try {
    return target.trim();
  } catch( e ) {
    alert( '获取元素失败，请重新打开编辑页面！' );
  }
}

function collectStylesheet() {
  let stylesheets = $( "style" );
  let purifyStylesheet = "";
  let purifyStyleHref = "";
  let ids = "";
  for( let i = 0, length = stylesheets.length; i < length; i++ ) {
    if ( stylesheets[ i ].getAttribute( 'id' ) && !ids.includes( stylesheets[ i ].getAttribute( 'id' ) ) ) {
      ids += stylesheets[ i ].getAttribute( 'id' );
      purifyStylesheet += stylesheets[ i ].outerHTML + '\r\n';
    }
  }
  stylesheets = $( 'link' );
  for ( let i = 0, length = stylesheets.length; i < length; i++ ) {
    if ( stylesheets[ i ].getAttribute( 'id' ) && !ids.includes( stylesheets[ i ].getAttribute( 'id' ) ) ) {
      ids += stylesheets[ i ].getAttribute( 'id' );
      purifyStyleHref += '<link rel="stylesheet" id="' + stylesheets[ i ].getAttribute( 'id' ) + '" href="' + stylesheets[ i ].getAttribute( 'href' ) + '">';
    }
  }

  return purifyStylesheet + purifyStyleHref;
}

function collectJavascript() {
  let javascripts = $( "script" );
  let purifyJavascript = "";
  let purifyScriptSrc = "";
  let ids = "";
  for ( let i = 0, length = javascripts.length; i < length; i++ ) {
    if ( javascripts[ i ].getAttribute( 'id' ) && !ids.includes( javascripts[ i ].getAttribute( 'id' ) ) ) {
      if ( !javascripts[ i ].getAttribute( 'src' )) {
        ids += javascripts[ i ].getAttribute( 'id' );
        purifyJavascript += javascripts[ i ].outerHTML + '\r\n';
      } else {
        purifyScriptSrc += '<script type="text/javascript" id="' + javascripts[ i ].getAttribute( 'id' ) + '" async src="' + javascripts[ i ].getAttribute( 'src' ) + '"><\/script>';
      }
    }
  }
  return purifyScriptSrc + purifyJavascript;
}

function collectNodesRes( e ) {
  function getChildNode( node ) {
    if ( node && node.nodeType === 1 ) {
      if ( /^[a-zA-Z0-9]{10}$/.test( node.id ) ) {
        window.editorNodeIds.push( node.id );
        let nodeRes = node.getAttribute( 'data-moduleres' );
        if ( nodeRes ) {
          nodeRes = nodeRes.split( ',' ).map( res => { return res.split( ':' )[ 1 ] } );
          for ( let i = 0, length = nodeRes.length; i < length; i++ ) {
            if ( !window.editorNodeRes.includes( nodeRes[ i ] ) ) {
              window.editorNodeRes.push( nodeRes[ i ] );
            }
          }
        }
      }
    }

    let childNodes = node? node.childNodes: [];
    for ( let i = 0, length = childNodes.length; i < length; i++ ) {
      getChildNode( childNodes[ i ] );
    }
  }

  let node = findParentDragHelper( e );
  getChildNode( node )
}

function mergeNodeBeforeEdit( e ) {
  let node = $( collectHtml( e ) );
  let editorNodeRes = window.editorNodeRes;
  let res = null;
  try{ res = JSON.parse( node.attr( 'data-moduleres' ) ); }catch( e ){ res = [] };

  for ( let i = 0, length = res.length; i < length; i++ )
    if (JSON.stringify(editorNodeRes).indexOf(JSON.stringify(res[i])) === -1) {
      editorNodeRes.push(res[i]);
    }

  node.attr( 'data-moduleres', JSON.stringify( editorNodeRes ) );
  node.find( '#view-editor' ).each( function( index ) { index > 0? cleanSelf( this ): null } );
  return node.prop( 'outerHTML' );
}

function initEditorial( e ) {
  collectNodesRes( e );
  let editorNodeIds = window.editorNodeIds;
  let eText = mergeNodeBeforeEdit( e );
  let eCs = '', eJs = '';
  try {
    for ( let i = 0, length = editorNodeIds.length; i < length; i++ ) {
      let tempCsNode, tempJsNode;
      tempCsNode = $( '#' + editorNodeIds[ i ] + 'cs' );
      tempJsNode = $( '#' + editorNodeIds[ i ] + 'js' );
      tempCsNode.prop( 'innerHTML' )? eCs += tempCsNode.prop( 'innerHTML' ).trim() + '\r\n': null;
      tempJsNode.prop( 'innerHTML' )? eJs += tempJsNode.prop( 'innerHTML' ).trim() + '\r\n': null;
      tempCsNode.remove();
      tempJsNode.remove();
    }
  } catch( e ) {
    e.preventDefault();
    alert( '错误！' );
    return null;
  }
  editorialJsHelper.setValue( eJs.trim() );
  editorialCsHelper.setValue( eCs.trim() );
  editorialHtmlHelper.setValue( eText );
}

function onLayoutEdit( e ) {
  initEditorial( e );
  $( '#v-editorModal' ).modal( 'show' );

  CodeMirror.commands["selectAll"]( editorialHtmlHelper );
  CodeMirror.commands["selectAll"]( editorialJsHelper );
  CodeMirror.commands["selectAll"]( editorialCsHelper );

  editorialHtmlHelper.autoFormatRange( editorialHtmlHelper.getCursor( true ), editorialHtmlHelper.getCursor( false ) );
  editorialJsHelper.autoFormatRange( editorialJsHelper.getCursor( true ), editorialJsHelper.getCursor( false ) );
  editorialCsHelper.autoFormatRange( editorialCsHelper.getCursor( true ), editorialCsHelper.getCursor( false ) );
}

function saveEditorial() {
  let editorNodeIds = window.editorNodeIds;
  let mainCs = $( '#' + editorNodeIds[ 0 ] + 'cs' );
  let mainJs = $( '#' + editorNodeIds[ 0 ] + 'js' );
  let eCs = editorialCsHelper.getValue();
  let eJs = editorialJsHelper.getValue();
  let eText = editorialHtmlHelper.getValue();

  $( '#v-pureHtmlTemplate' ).contents().find( '#' + editorNodeIds[ 0 ] ).replaceWith( eText );
  $( '#v-main-container #' + editorNodeIds[ 0 ] ).html( eText );
  mainJs.remove();
  mainCs.remove();

  try {
    $( 'body' ).append( $( "<script id='" + editorNodeIds[ 0 ] + "js' defer>" + eJs + "<\/script>" ) );
    $( 'head' ).append( $( "<style id='" + editorNodeIds[ 0 ] + "cs'>" + eCs + "<\/style>" ) );
  } catch( e ) {
    mainJs.remove();
    mainCs.remove();
    let shareModal = $( '#v-shareModal' );
    shareModal.find( '.modal-header' ).html( '保存错误，请按照提示修正代码！' );
    shareModal.find( '.modal-body' ).html( '提示：' + e.message );
    shareModal.modal( 'show' );
    return null;
  }

  $( '#previewHtml' ).html( '' );
  $( '#previewJs' ).html( '' );
  $( '#previewCss' ).html( '' );
  $( '#v-editorModal' ).modal( 'hide' );
  window.editorNodeIds = [];
  window.editorNodeRes = [];
  bindDroppable();
}

function previewEditorial() {
  let eText = editorialHtmlHelper.getValue();
  let eCs = editorialCsHelper.getValue();
  let eJs = editorialJsHelper.getValue();
  document.getElementById("v-pageTemplate").contentWindow.previewEditorial( resCachedList, eText, eCs, eJs );
}
