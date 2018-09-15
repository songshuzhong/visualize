/**
 Version v0.0.5
 User songshuzhong@bonc.com.cn
 ------------------------------------------------------------
 Date         Author          Version            Description
 ------------------------------------------------------------
 2018年9月14日 songshuzhong   v0.0.5            重构代码结构、采用html5原生拖放api
 */
$(function () {
  window.resCachedList = { js: [], cs: [] };
  $( document ).on( 'click', '.v-sidebar-menu li a span', function( e ) {
    let li = $( e.target ).parent().parent();
    let ul = $( e.target ).parent().next();
    if ( !ul.children().length ) {
      fetchDataById( li.attr( 'id' ), ul );
    }
    if ( li.hasClass( 'active' ) ) {
      li.removeClass( 'active' );
    } else {
      li.parents( 'ul' ).first().find( 'li.active' ).removeClass( 'active' );
      li.addClass( 'active' );
    }
  } );
  $( document ).on( 'click', '.navbar-nav .glyphicon-align-justify', function( e ) {
    let v_main_sidebar = $( '.v-main-sidebar' );
    let v_main_container = $( '.container.drop-helper-container' );
    if ( v_main_sidebar.css( 'width' ) === '0px' ) {
      v_main_sidebar.css( 'width', '230px' );
      v_main_container.css( 'padding-left', '235px' );
    } else {
      v_main_sidebar.css( 'width', 0 );
      v_main_container.css( 'padding-left', '10px' );
    }
  } );
  $( document ).on( 'click', '#view-editor .glyphicon-trash', function( e ){ cleanLayout( e ) } );
  $( document ).on( 'click', '#view-editor .glyphicon-edit', function( e ){ onLayoutEdit( e ) } );
  $( '#v-module-search' ).click( function () {
    let keyword = $( 'input[name=moduleName]' ).val();
    let container = $( '#v-side-bar-menu' );

    if ( keyword ) {
      fetchDataByKeyword( '%' + keyword + '%', container )
    } else {
      fetchDataById( 'root', container );
    }
    container.empty();
    return false;
  } );
  $( '#v-cleanLayout' ).click( function(){ cleanLayout() } );
  $( '#v-savePageModel' ).click( function( e ){ savePageModel( e ) } );
  $( '#v-saveEditorial' ).click( function( e ){ saveEditorial( e ) } );
  $( '#v-pureHtmlTemplate' ).contents().find( 'body' ).html( '<div id="v-main-container" data-uuid="container" />' );
  $( '#v-previewComponentBtn' ).click( function(){ $( '#previewTabs a:last' ).tab( 'show' ); previewEditorial() } );
  fetchDataById( 'root', document.getElementById( 'v-side-bar-menu' ) );
  initLayout( pageModel );
} );

function fetchDataByKeyword( keyword, container ) {
  $.ajax( {
    type: 'POST',
    url: path + version + '/api/pageModule/module/search/detail',
    data: { moduleName: keyword },
    success: function ( data ) {
      renderMenuList( data, container );
    },
    error: function ( e ) { alert( '服务器出错，返回内容：' + e.responseText ) }
  } );
}

function fetchDataById( moduleTypeId, container ) {
  $.ajax( {
    url: path + version + '/api/pageModule/module/detail/' + moduleTypeId,
    type: 'GET',
    success: function ( data ) {
      renderMenuList( data, container );
    },
    error: function ( e ) { alert( '服务器出错，返回内容：' + e.responseText ) }
  } );
}

function savePageModel() {
  let shareModal = $( '#v-shareModal' );
  let model = {
    pageId: pageModel.pageId,
    pageTypeId: pageModel.pageTypeId,
    pageName: pageModel.pageName,
    pageSortId: pageModel.pageSortId,
    pageText: collectHtml(),
    pagePureText: purifyLayout(),
    pageJs: collectJavascript( pageModel.pageId ),
    pageStyle: collectStylesheet( pageModel.pageId )
  };

  $.ajax( {
    url: path + version + '/api/pageModel/' + pageModel.pageId,
    type: 'put',
    dataType: 'json',
    data: model,
    success: function( data ) {
      if ( data.code == 204 ) {
        $( '.modal-body' ).html( '保存成功！' );
        shareModal.find( '.modal-header' ).html( '提示' );
        shareModal.find( '.modal-body' ).html( '保存成功！' );
        shareModal.modal( 'show' );
      } else {
        shareModal.find( '.modal-header' ).html( '提示' );
        shareModal.find( '.modal-body' ).html( '保存失败！' );
        shareModal.modal( 'show' );
      }
    },
    error: function() {
      shareModal.find( '.modal-header' ).html( '提示' );
      shareModal.find( '.modal-body' ).html( '保存失败！' );
      shareModal.modal( 'show' );
    },
  } );
}

function renderMenuList( data, container ) {
  let nodes = data.nodes;
  let pageModuleList = data.pageModuleList;

  nodes.forEach( ( node ) => { let li = createStaticLi( node ); $( li ).appendTo( container ); } );

  pageModuleList.forEach( ( pageModule ) => { let li = createMovableLi( pageModule ); $( li ).appendTo( container ); } );
}

function createMovableLi( pageModule ) {
  let li = $(
    '<li id="' + pageModule.moduleId + '" class="v-treeview">'+
    '  <div class="drag">' +
    '    <a id="' + pageModule.moduleTypeId + '" data-container="drag-helper" data-toggle="tooltip" data-placement="right" title="' + pageModule.moduleTip + '">' +
    '      <i class="glyphicon glyphicon-object-align-horizontal v-angle"></i>' +
    '      <span>' + pageModule.moduleName + '</span>' +
    '      <i class="drag-helper glyphicon glyphicon-move v-angle-right" draggable="true" ondragstart="bindDrag(event)"></i>' +
    '    </a>' +
    '    <div class="view">' +
    '      <span id="view-editor">' +
    '        <a><i class="glyphicon glyphicon-edit" /></a>' +
    '        <a><i class="glyphicon glyphicon-trash" /></a>' +
    '      </span>' + pageModule.moduleText +
    '    </div>' +
    '  </div>' +
    '</li>');

  $( li ).children( '.drag' )
    .attr( 'data-moduletext', pageModule.moduleText )
    .attr( 'data-modulecs', pageModule.moduleStyle )
    .attr( 'data-modulejs', pageModule.moduleJs )
    .attr( 'data-moduleres', pageModule.pageResIds );

  if ( pageModule.moduleText.trim().includes( 'force drop' ) )
    $( li ).children( '.drag' ).removeClass( 'drag' ).addClass( 'force drag' );
  else if ( pageModule.moduleText.trim().includes( 'normal drop' ) )
    $( li ).children( '.drag' ).removeClass( 'drag' ).addClass( 'normal drag' );
  else
    $( li ).children( '.drag' ).removeClass( 'drag' ).addClass( 'weak drag' );
  return li;
}

function createStaticLi( node ) {
  let li = $( '<li id="' + node.moduleTypeId + '" class="v-treeview"></li>');
  $(li).append('<a><i class="glyphicon glyphicon-gift v-angle"></i><span>' + node.moduleTypeName + '</span><i class="glyphicon glyphicon-menu-right v-angle-right"></i></a>');
  $( '<ul class="v-treeview-menu"></ul>' ).appendTo( li );
  return li;
}

function allowDrop( e ) {
  e.preventDefault();
}

function bindDrag( e ) {
  e.dataTransfer.setData( 'Text', e.target.parentNode.parentNode.parentNode.id );
}

function bindDrop( e ) {
  e.preventDefault();

  let dragTarget = e.dataTransfer.getData( 'Text' );
  let dropContainer = e.target;
  let flag = false;

  if ( $( '#' + dragTarget ).children( '.drag' ).attr( 'data-moduleText' ) ) {
    dragTarget = document.getElementById( dragTarget ).lastChild.cloneNode( true );
  } else {
    dragTarget = document.getElementById( dragTarget );
  }

  if ( dragTarget.className.includes( 'force drag' ) && dropContainer.id == 'v-main-container' ) {
    flag = true;
  } else if ( dragTarget.className.includes( 'normal drag' ) && dropContainer.className.includes( 'force drop' ) ) {
    flag = true;
  } else if ( dragTarget.className.includes( 'weak drag' ) && dropContainer.className.includes( 'force drop' ) || dropContainer.className.includes( 'normal drop' ) ) {
    flag = true;
  } else {
    flag = false;
  }

  if ( flag ) {
    dropContainer.appendChild( dragTarget );
    convertTagsId( dragTarget );
    addResScript( dragTarget );
    updateTemplateFrame( dragTarget );
    addScriptAndStyle( dragTarget );
  } else {
    $( document.body ).append(
      '<div class="alert alert-warning" style="position: absolute;bottom: 0;z-index: 999999;width: 100%;margin-bottom: 0;">' +
      '  <a href="#" class="close" data-dismiss="alert">&times;</a>' +
      '  <strong>警告！</strong>本次拖放违反组件嵌套规则。请选择正确的父级容器。' +
      '</div>'
    );
  }
}

function convertTagsId( dragTarget ) {
  dragTarget = $( dragTarget );

  let cs = dragTarget.attr( 'data-modulecs' );
  let js = dragTarget.attr( 'data-modulejs' );
  let text = dragTarget.attr( 'data-moduletext' );

  for ( let i = 0; ; i++ ) {
    if ( text.includes( 'TEMPLATE_ID_' + i ) ) {
      let id = getUUID();
      text = text.replace( new RegExp( 'TEMPLATE_ID_' + i, 'gm' ), id );
      if ( js.includes( 'TEMPLATE_ID_' + i ) )
        js = js.replace( new RegExp( 'TEMPLATE_ID_' + i, 'gm' ), id );
      if ( cs.includes( 'TEMPLATE_ID_' + i ) )
        cs = cs.replace( new RegExp( 'TEMPLATE_ID_' + i, 'gm' ), id );
      if ( dragTarget.find( '#TEMPLATE_ID_' + i ) )
        dragTarget.find( '#TEMPLATE_ID_' + i ).attr( 'id', id );
      if ( dragTarget.find( '[href=#TEMPLATE_ID_'+ i +']' ) )
        dragTarget.find( '[href=#TEMPLATE_ID_'+ i +']' ).attr( 'href', '#' + id );
    } else { break; }
  }

  dragTarget.attr( 'id', getUUID() );
  dragTarget.attr( 'data-modulecs', cs );
  dragTarget.attr( 'data-modulejs', js );
  dragTarget.attr( 'data-moduletext', text );
  dragTarget.find( 'a[data-container="drag-helper"]' ).each( function() { cleanSelf( this ) } );
}

function addScriptAndStyle( dragTarget ) {
  dragTarget = $( dragTarget );
  let id = dragTarget.attr( 'id' );
  let moduleJs = dragTarget.attr( 'data-modulejs' );
  let moduleStyle = dragTarget.attr( 'data-modulecs' );
  let shareModal = $( '#v-shareModal' );

  dragTarget.removeAttr( 'data-modulejs' ).removeAttr( 'data-modulecs' ).removeAttr( 'data-moduletext' );

  if ( !$( id + 'js' ).length && moduleJs ) {
    try {
      $( 'body' ).append( '<script id="' + id + 'js" defer>' + moduleJs + '</script>' );
    } catch( err ) {
      shareModal.find( '.modal-header' ).html( '组件js异常，本次操作将被取消！' );
      shareModal.find( '.modal-body' ).html( err.toString() );
      shareModal.modal( 'show' );
      removeScriptAndStyle( dragTarget );
      return;
    }
  }

  if ( !$( 'head #' + id + 'cs' ).length && moduleStyle ) {
    try {
      $( 'head' ).append( '<style id="' + id + 'cs">' + moduleStyle + '</style>' );
    } catch( err ) {
      shareModal.find( '.modal-header' ).html( '组件cs异常，本次操作将被取消！' );
      shareModal.find( '.modal-body' ).html( err.toString() );
      shareModal.modal( 'show' );
      removeScriptAndStyle( dragTarget );
    }
  }
}

function removeScriptAndStyle( dragTarget ) {
  dragTarget = $( dragTarget );
  let id = dragTarget.attr( 'id' );
  let res = dragTarget.attr( 'data-moduleres' );
  if ( res ) {
    let resIds = res.split( ',' ).map( res => { res = res.split( ':' ); return { resType: res[ 0 ], resId: res[1] } } );
    resIds.forEach( function( res ) {
      let el = $( '#' + res.resId );
      let count = Number( el.attr( 'data-count' ) );
      if ( count === 0 ) {
        el.remove();
      } else {
        el.attr( 'data-count', --count );
      }
    } );
  }
  $( '#' + id + 'js' ).remove();
}

function addResScript( dragTarget ) {
  dragTarget = $( dragTarget );
  let res = dragTarget.attr( 'data-moduleres' );
  if ( res ) {
    let resIds = res.split( ',' ).map( res => { res = res.split( ':' ); return { resType: res[ 0 ], resId: res[1] } } );
    resIds.forEach( function( res ) {
      let el = $( '#' + res.resId );
      if ( el.length === 0 ) {
        switch( res.resType ) {
          case "1":
            let tempJs = "<script id='" + res.resId + "' async type='text/javascript' data-count='0' src='" + path + version + "/pageRes/res/file/" + res.resId + "'/>";
            $( 'body' ).append( tempJs );
            resCachedList.js.push( tempJs );
            break;
          case "2":
            let tempCs = "<link id='" + res.resId + "' rel='stylesheet' type='text/css' data-count='0' href='" + path + version + "/pageRes/res/file/" + res.resId + "'/>";
            $( 'head' ).append( tempCs );
            resCachedList.cs.push( tempCs );
            break;
        }
      } else {
        let count = Number( el.attr( 'data-count' ) );
        el.attr( 'data-count', ++count );
      }
    } );
  }
}

function updateTemplateFrame( dragTarget ) {
  signUUID( dragTarget );
  dragTarget = $( dragTarget );

  let ele = transparentTags( dragTarget.clone() );
  let pureHtmlTemplate = $( '#v-pureHtmlTemplate' ).contents();
  let id = dragTarget.attr( 'id' );
  let prevId = findPrevSiblingTag( dragTarget[ 0 ] );
  let nextId = findNextSiblingTag( dragTarget[ 0 ] );
  let pId = findParentDropHelper( dragTarget[ 0 ] );

  cleanTags( ele );

  if ( pureHtmlTemplate.find( '[data-uuid="' + id + '"]' ).length ) {
    pureHtmlTemplate.find( '[data-uuid="' + id + '"]' ).replaceWith( ele );
  } else if ( nextId && pureHtmlTemplate.find( '[data-uuid="' + nextId + '"]' ).length ) {
    let nextEle = pureHtmlTemplate.find( '[data-uuid="' + nextId + '"]' )[ 0 ];
    pureHtmlTemplate.find( '[data-uuid="' + pId + '"]' )[ 0 ].insertBefore( ele, nextEle );
  } else if ( prevId && pureHtmlTemplate.find( '[data-uuid="' + prevId + '"]' ).length ) {
    pureHtmlTemplate.find( '[data-uuid="' + prevId + '"]' ).parent().append( ele );
  }  else {
    pureHtmlTemplate.find( '[data-uuid="' + pId + '"]' )[ 0 ].appendChild( ele );
  }

  $( '#' + id ).replaceWith( $( ele ).clone() );
}

function transparentTags( dragTarget ) {
  let id = dragTarget.attr( 'id' );
  let uuid = dragTarget.attr( 'data-uuid' );
  let className = dragTarget.attr( 'class' );

  if ( className.includes( 'normal drag') ) {
    let views = $( dragTarget.attr( 'data-moduleText' ) )[0];
    views.setAttribute( 'id', id );
    views.setAttribute( 'data-uuid', uuid );
    views.className = ( views.className + ' ' + className ).replace( 'normal-drop ', '' ).replace( 'normal drag ', '' );
    return views;
  } else {
    return dragTarget[0];
  }
}

function cleanTags( node ) {
  function getChildren( node ) {
    if ( node && node.nodeType === 1 ) {
      if ( node.className.includes( 'drag-helper' ) ) {
        node.parentNode.removeChild( node );
      }

      if ( node.className.includes( 'drag' ) ) {
        node.removeAttribute(  'data-modulejs' );
        node.removeAttribute(  'data-modulecs' );
        node.removeAttribute(  'data-moduletext' );
      }
    }

    let childNodes = node? node.childNodes: [];
    for( let i = 0, length = childNodes.length; i < length; i++ ) {
      getChildren( childNodes[ i ] );
    }
  }

  getChildren( node );
}

function directToTemplate() {
  window.location = "/xbconsole/v1/pageModel/pageTemplate/?pageId=" + pageModel.pageId;
}