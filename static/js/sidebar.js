/**
 Version v0.0.2
 User songshuzhong@bonc.com.cn
 Copyright (C) 1997-present BON Corporation All rights reserved.
 ------------------------------------------------------------
 Date         Author          Version            Description
 ------------------------------------------------------------
 2018年8月9日 songshuzhong    v0.0.1            修复组件通信
 2018年9月3日 songshuzhong    v0.0.2            重构代码结构、页面布局、代码提示、组件异常捕获
 */
$(function () {
  window.resCachedList = { js: [], cs: [] };
  $( document ).on( 'click', '.v-sidebar-menu li a span', function( e ) {
    let li = $( e.target ).parent().parent();
    let ul = $( e.target ).parent().next();
    if ( !ul.children().length ) {
      fetchDataSource( li.attr( 'id' ), ul );
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
  $( '.drop-helper' ).sortable( {
    revert: true,
    opacity: .35,
    cancel: '.row',
    connectWith: '.drop-helper',
    start: function( e, t ) {
      convertTagsId( e, t );
      addResScript( e, t );
    },
    stop: function( e, t ) {
      updateTemplateFrame( e, t );
      addScriptAndStyle( e, t );
    }
  } );
  $( '#v-cleanLayout' ).click( function(){ cleanLayout() } );
  $( '#v-savePageModel' ).click( function( e ){ savePageModel( e ) } );
  $( '#v-saveEditorial' ).click( function( e ){ saveEditorial( e ) } );
  $( '#v-pureHtmlTemplate' ).contents().find( 'body' ).html( '<div id="v-main-container" data-uuid="container" />' );
  $( '#v-previewComponentBtn' ).click( function(){ $( '#previewTabs a:last' ).tab( 'show' ); previewEditorial() } );
  bindDroppable();
  fetchDataSource( 'root', document.getElementById( 'v_side_bar_menu' ) );
  initLayout( pageModel );
} );

function fetchDataSource( moduleTypeId, container ) {
  $.ajax( {
    url: path + version + '/api/pageModule/module/type/detail/' + moduleTypeId,
    type: 'GET',
    success: function ( data ) {
      renderMenuList( data, container );
    },
    error: function ( xhr ) { console.log( '服务器出错，返回内容：' + xhr.responseText ) }
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
    url: path + version + '/pageModel/' + pageModel.pageId,
    type: 'put',
    dataType: 'json',
    data: model,
    success: function( data ) {
      if ( data.code == 201 ) {
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

function renderMenuList( datas, container ) {
  let nodes = datas.nodes;
  let pageModuleList = datas.pageModuleList;

  nodes.forEach( ( node ) => { let li = createStaticLi( node ); $( li ).appendTo( container ); } );

  pageModuleList.forEach( ( pageModule ) => { let li = createMovableLi( pageModule ); $( li ).appendTo( container ); bindDraggable(); } );
}

function createMovableLi( pageModule ) {
  let li = $(
    '<li id="' + pageModule.moduleId + '" class="v-treeview">'+
    '  <div class="drag">' +
    '    <a id="' + pageModule.moduleTypeId + '" data-container="drag-helper" data-toggle="tooltip" data-placement="right" title="' + pageModule.moduleTip + '">' +
    '      <i class="glyphicon glyphicon-object-align-horizontal v-angle"></i>' +
    '      <span>' + pageModule.moduleName + '</span>' +
    '      <i class="drag-helper glyphicon glyphicon-move v-angle-right"></i>' +
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

  if ( pageModule.moduleText.trim().includes( 'force-drop' ) )
    $( li ).children( '.drag' ).removeClass( 'drag' ).addClass( 'force drag' );
  else if ( pageModule.moduleText.trim().includes( 'normal-drop' ) )
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

function bindDraggable() {
  $( '.v-sidebar-menu .drag' ).draggable( {
    zIndex:999,
    scroll: false,
    revert: 'invalid',
    helper: 'clone',
    handle: '.drag-helper',
    appendTo:'body',
    connectToSortable: '.drop-helper-container',
    drag: function( e, t ) {
      t.helper.width( 400 )
    },
    stop: function( e, t ) {
      $( '.drop-helper' ).sortable( {
        opacity: .35,
        connectWith: '.drop-helper',
        start: function( e, t ) {
          convertTagsId( e, t );
          addResScript( e, t );
        },
        stop: function( e, t ) {
          updateTemplateFrame( e, t );
          addScriptAndStyle( e, t );
        }
      } )
    }
  } );
}

function bindDroppable() {
  $( '.drop-helper' ).sortable( {
    revert: true,
    opacity: .35,
    connectWith: '.drop-helper',
    start: function( e, t ) {
      convertTagsId( e, t );
      addResScript( e, t );
    },
    stop: function( e, t ) {
      updateTemplateFrame( e, t );
      addScriptAndStyle( e, t );
    }
  } );
}

function convertTagsId( e,t ) {
  let cs = t.item.attr( 'data-modulecs' );
  let js = t.item.attr( 'data-modulejs' );
  let text = t.item.attr( 'data-moduletext' );

  for ( let i = 0; ; i++ ) {
    if ( text.includes( 'TEMPLATE_ID_' + i ) ) {
      let id = getUUID();
      text = text.replace( new RegExp( 'TEMPLATE_ID_' + i, 'gm' ), id );
      if ( js.includes( 'TEMPLATE_ID_' + i ) ) {
        js = js.replace( new RegExp( 'TEMPLATE_ID_' + i, 'gm' ), id );
      }
      if ( cs.includes( 'TEMPLATE_ID_' + i ) ) {
        cs = cs.replace( new RegExp( 'TEMPLATE_ID_' + i, 'gm' ), id );
      }
      t.item.find( '#TEMPLATE_ID_' + i ).attr( 'id', id );
      t.item.find( '[href=#TEMPLATE_ID_'+ i +']' ).attr( 'href', '#' + id );
    } else { break; }
  }

  t.item.attr( 'id', getUUID() );
  t.item.attr( 'data-modulecs', cs );
  t.item.attr( 'data-modulejs', js );
  t.item.attr( 'data-moduletext', text );
  t.item.find( 'a[data-container="drag-helper"]' ).each( function() { cleanSelf( this ) } );
}

function addScriptAndStyle( e, t ) {
  let id = t.item.attr( 'id' );
  let moduleJs = t.item.attr( 'data-modulejs' );
  let moduleStyle = t.item.attr( 'data-modulecs' );
  let shareModal = $( '#v-shareModal' );

  t.item.removeAttr( 'data-modulejs' ).removeAttr( 'data-modulecs' ).removeAttr( 'data-moduletext' );

  if ( !$( id + 'js' ).length && moduleJs ) {
    try {
      $( 'body' ).append( '<script id="' + id + 'js" defer>' + moduleJs + '</script>' );
    } catch( err ) {
      shareModal.find( '.modal-header' ).html( '组件js异常，本次操作将被取消！' );
      shareModal.find( '.modal-body' ).html( err.toString() );
      shareModal.modal( 'show' );
      removeScriptAndStyle( e, t );
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
      removeScriptAndStyle( e, t );
    }
  }
}

function removeScriptAndStyle( e, t ) {
  let id = t.item.attr( 'id' );
  let res = t.item.attr( 'data-moduleres' );
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

function addResScript( e, t ) {
  let res = t.helper.attr( 'data-moduleres' );
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

function updateTemplateFrame( e, t ) {
  signUUID( t.item[0] );

  let ele = transparentTags( t.item.clone() );
  let pureHtmlTemplate = $( '#v-pureHtmlTemplate' ).contents();
  let id = t.item.attr( 'id' );
  let prevId = findPrevSiblingTag( t.item[ 0 ] );
  let nextId = findNextSiblingTag( t.item[ 0 ] );
  let pId = findParentDropHelper( t.item[ 0 ] );

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
  $( '.drop-helper' ).sortable( { opacity: .35, connectWith: '.drop-helper' } );
}

function transparentTags( ele ) {
  let id = ele.attr( 'id' );
  let uuid = ele.attr( 'data-uuid' );
  let className = ele.attr( 'class' );

  if ( className.includes( 'normal drag') ) {
    let views = $( ele.attr( 'data-moduleText' ) )[0];
    views.setAttribute( 'id', id );
    views.setAttribute( 'data-uuid', uuid );
    views.className = ( views.className + ' ' + className ).replace( 'normal-drop ', '' ).replace( 'normal drag ', '' );
    return views;
  } else {
    return ele[0];
  }
}

function cleanTags( node ) {
  function getChildren( node ) {
    if ( node && node.nodeType === 1 ) {
      if ( node.className.includes( 'drag-helper' ) ) {
        node.parentNode.removeChild( node );
      }

      if ( node.className.includes( 'drag ui-draggable' ) ) {
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