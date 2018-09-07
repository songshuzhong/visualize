let pageTypeId = "root";
let pagesTreeRoot = { id: "root", name: "页面分类", isParent: true, open: true };
let setting = {
  async: {
    type: "get",
    enable: true,
    url: getAsyncUrl,
    dataFilter: handleDataFilter
  },
  data: {
    simpleData: {
      enable: true
    }
  },
  view: {
    addHoverDom: handleAddHoverDom,
    removeHoverDom: handleRemoveHoverDom,
  },
  edit: {
    enable: true
  },
  callback: {
    onClick: handlePagesTreeClick,
    onRename: handlePagesTreeRename,
    onRemove: handlePagesTreeRemove
  }
};

function getAsyncUrl( treeId , treeNode ) {
  let id = ( treeNode!== undefined ) ? treeNode.id : pageTypeId;

  return contextPath + version +  "/api/pageType/childDetail/" + id;
}

function handleDataFilter( treeId, parentNode, childNodes ) {
  let nodes = childNodes.nodes;

  for ( let i = 0, length = nodes.length; i < length; i++ ){
    nodes[i].parent? nodes[i].isParent = true: null;
  }

  !parentNode? nodes.unshift( pagesTreeRoot ): null;

  return nodes;
}

function handlePagesTreeClick( event, treeId, treeNode ) {
  $.ajax({
    type: 'get',
    url: contextPath + version +  "/api/pageModel/childDetail/" + treeNode.id,
    success : function( data ) {
      if ( data != null ) {
        data = data.data;
        if( data !== null && data.length !== 0 ){
          renderLeafPeer( data );
          renderBreadCrumb();
        } else {
          confirm( '该节点下没有叶子节点！' );
          $( '.item-aside' ).html( '' );
        }
      }
    },
    error : function() {
      alert("请求错误！");
    }
  });
}

function handlePagesTreeRename( event, treeId, treeNode, isCancel ) {
  treeNode.id?
    $.ajax({
      type: "put",
      dataType: 'json',
      url: contextPath + version +  "/pageType/" + treeNode.id,
      data: { pageTypeName: treeNode.name },
      success: function( data ){
        alert( data.message );
      },
      error : function() {
        alert("请求错误！");
      }
    })
    :
    $.ajax({
      type: "post",
      url: contextPath + version +  "/pageType/savePageType",
      data: { pageTypeName: treeNode.name, pageParentId: treeNode.pId },
      success: function( data ){
        if ( data.code === 201 ){
          alert( "添加节点成功！" );
        }else {
          alert("添加节点失败！");
        }
      }
    });
}

function handlePagesTreeRemove( event, treeId, treeNode ) {
  $.ajax({
    type: "delete",
    dataType: 'json',
    url: contextPath + version +  "/pageType/" + treeNode.id,
    data: { pageTypeName: treeNode.name },
    success: function( data ){
      alert( data.message );
    },
    error : function() {
      alert("请求错误！");
    }
  });
}

function handleAddHoverDom(treeId, treeNode) {
  let sObj = $( "#" + treeNode.tId + "_span" );
  if ( treeNode.editNameFlag || $( "#addBtn_" + treeNode.tId ).length > 0 ) return;
  let addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>";
  sObj.after(addStr);
  let btn = $( "#addBtn_" + treeNode.tId );
  if ( btn ) btn.bind( "click", function() {
    window.pickerTree.addNodes( treeNode, { pId: treeNode.id, name: "new node" } );
    return false;
  } );
}

function handleRemoveHoverDom(treeId, treeNode) {
  $( '#addBtn_' +treeNode.tId) .unbind().remove();
}

function handlePageModuleRename( pId, pageName, e ) {
  let input = "<input id='tempInput' value='" + pageName+ "' placeholder='请确认文件名称......' />";

  $( e.target ).parent().css( 'left', '216px');
  $( e.target ).parent().prev( 'span' ).remove();
  $( e.target ).parent().before( input );
  $( '#tempInput' ).focus();
}

function handlePageModuleEditor( pId, e ) {
  let url = contextPath + version +  "/visualize/" + pId;
  //window.open( url,'', 'toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
  window.location = url;
}

function handlePageModuleDelete( pId, e ) {
  if ( confirm( "确定要删除该条资源吗？" ) ){
    $.ajax({
      type: "delete",
      url: contextPath + version +  "/api/pageModel/" + pId,
      success: function( data ) {
        if ( data.code >= 200 ){
          $( e.target ).parent().parent().remove();
        } else {
          alert( data.message );
        }
      }
    });
  }
}

function renderBreadCrumb() {
  let selectNode = window.pickerTree.getSelectedNodes()[0];
  let activeCrumb = "";

  for( let i = 0; true; i++ ) {
    if ( selectNode ) {
      i === 0? activeCrumb = "<li>" + selectNode.name + "</li>" + activeCrumb: activeCrumb = "<li><a href='#'>" + selectNode.name + "</a></li>" + activeCrumb;
      selectNode = selectNode.getParentNode();
    } else {
      break;
    }
  }

  $( '.item-breadcrumb' ).html( "<li><a href='#'>root</a></li>" + activeCrumb );
}

function renderLeafPeer( data ) {
  let leafs = "";

  data.forEach( function( leaf, index ) {
    leafs += "<artical class='item-artical' data-pageId='" + leaf.pageId +
      "' data-updateDate='" + leaf.updateDate +
      "' data-createBy='" + leaf.createBy +
      "'data-createDate='" + leaf.createDate + "'>" +
      "  <img style='width: 50px; height: 50px;' src='/img/jsp.png' >" +
      "  <span>" + leaf.pageName + "</span>" +
      "  <menu class='artical-menu'>" +
      "    <div class='menu-btn' data-type='0'>重命名</div>" +
      "    <div class='menu-btn' data-type='1'>编辑</div>" +
      "    <div class='menu-btn' data-type='2'>删除</div>" +
      "  </menu>" +
      "</artical>"
  } );

  $( '.item-aside' ).html( '' ).html( leafs );
}

function renderLeafDetail( pageId, createBy, createDate, updateDate ) {
  let detail = "<span>编号：" + pageId + "</span>" +
    "<span>创建者：" + createBy + "</span>" +
    "<span>创建日期：" + timestampToTime( parseInt( createDate ) ) + "</span>" +
    "<span>更新日期：" + timestampToTime( parseInt( updateDate ) ) + "</span>";

  $( '.item-footer' ).html( '' ).html( detail );
}

$( document ).ready( function () {
  window.pickerTree = $.fn.zTree.init( $( "#pageTypeTree" ), setting );
  handlePagesTreeClick( null, null, { id: 'root' } );
} );

$( '.item-aside' ).delegate( 'artical', 'mousemove', function( e ) {
  $( this ).addClass( 'artical-active' ).siblings().removeClass( 'artical-active' );
  $( this ).children( '#tempInput' )[0]? null: $( this ).children( 'menu' ).css( 'left', '75%' );
  let target = $( e.target ).is( 'artical' )? $( e.target ): $( e.target ).parent();
  let pageId = target.attr( 'data-pageId' );
  let createBy = target.attr( 'data-createby' );
  let createDate = target.attr( 'data-createDate' );
  let updateDate = target.attr( 'data-updateDate' );
  renderLeafDetail( pageId, createBy, createDate, updateDate );
} )
  .delegate( 'artical', 'mouseleave', function( e ) {
    $( this ).removeClass( 'artical-active' ).children( 'menu' ).css( 'left', '100%' ); } )
  .delegate( '.menu-btn', 'click', function( e ) {
    let type = $( e.target ).attr( 'data-type' );
    let pId = $( e.target ).parent().parent().attr( 'data-pageId' );
    let pageName = $( e.target ).parent().prev( 'span' ).html();
    switch ( type ) {
      case '0': handlePageModuleRename( pId, pageName, e ); break;
      case '1': handlePageModuleEditor( pId, e ); break;
      case '2': handlePageModuleDelete( pId, e ); break;
    }
  } )
  .delegate( '#tempInput', 'keypress', function( e ) {
    if ( e.keyCode !== 13 ) return;

    let pageName = e.target.value;
    let pageId = e.target.parentNode.getAttribute( 'data-pageid' );
    try {
      let node = window.pickerTree.getSelectedNodes()[ 0 ];
      pageId?
        $.ajax({
          type: "put",
          url: contextPath + version +  "/api/pageModel/" + pageId,
          data: { "pageName": pageName, "pageTypeId": node.id },
          success: function(data){
            if ( data.code == 201 ){
              alert("更新页面成功！");
              $( '#tempInput' ).before( "<span>" + pageName + "</span>" ).parent().find( 'input' ).remove();
              handlePagesTreeClick( null, null, node );
            } else {
              alert("更新页面失败！");
            }
          }
        }): $.ajax({
          type: "post",
          url: contextPath + version +  "/api/pageModel/savePageModel",
          data: { "pageName": pageName, "pageTypeId": node.id },
          success: function(data){
            if ( data.code == 201 ){
              alert("添加页面成功！");
              $( '#tempInput' ).before( "<span>" + pageName + "</span>" ).parent().find( 'input' ).remove();
              handlePagesTreeClick( null, null, node );
            } else {
              alert("添加页面失败！");
            }
          }
        });
    } catch ( e ) {
      alert( "请先确认目标节点！");
    }
  } );

$( '#menu-btn-add' ).click( function() {
  let artical =  "<artical class='item-artical'>" +
    "  <img style='width: 50px; height: 50px;' src='/img/jsp.png' >" +
    "  <input id='tempInput' value='new_page' placeholder='请确认文件名称......' />" +
    "  <menu class='artical-menu'>" +
    "    <div class='menu-btn' data-type='0'>重命名</div>" +
    "    <div class='menu-btn' data-type='1'>编辑</div>" +
    "    <div class='menu-btn' data-type='2'>删除</div>" +
    "  </menu>" +
    "</artical>";

  $( '.item-aside' ).prepend( artical );
  $( '#tempInput' ).focus();
} );
$( '#menu-btn-search' ).click( function( e ) {
  let key = e.target.value;
  let currNode = window.pickerTree.getSelectedNodes()[0];
} );