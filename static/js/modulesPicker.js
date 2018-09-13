var componentTypeId = "root";
var pagesTreeRoot = { id: "root", name: "组件分类", isParent: true, open: true };
var setting = {
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
    onClick: handleComponentsTreeClick,
    onRename: handleComponentsTreeRename,
    onRemove: handleComponentsTreeRemove
  }
};

function getAsyncUrl( treeId , treeNode ) {
  var id = ( treeNode!= undefined ) ? treeNode.id : componentTypeId;

  return contextPath + version + '/api/pageModule/module/type/detail/' + id;
}

function handleDataFilter( treeId, parentNode, childNodes ) {
  var nodes = childNodes.nodes;

  for ( var i = 0, length = nodes.length; i < length; i++ ){
    nodes[i].parent? nodes[i].isParent = true: null;
  }

  !parentNode? nodes.unshift( pagesTreeRoot ): null;

  return nodes;
}

function handleComponentsTreeClick( event, treeId, treeNode ) {
  $.ajax({
    type: 'get',
    url: contextPath + version + "/api/pageModule/module/moduleinfo/" + treeNode.id,
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

function handleComponentsTreeRename( event, treeId, treeNode, isCancel ) {
  treeNode.id?
    $.ajax({
      type: "put",
      dataType: 'json',
      url: contextPath + version + "/api/pageModuleType/module/type/update/" + treeNode.id,
      data: { moduleTypeName: treeNode.name, moduleParentId: treeNode.id },
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
      url: contextPath + version + "/api/pageModuleType/module/type",
      data: { moduleTypeName: treeNode.name, moduleParentId: treeNode.pId },
      success: function( data ){
        if ( data.code === 201 ){
          alert( "添加节点成功！" );
        }else {
          alert("添加节点失败！");
        }
      }
    });
}

function handleComponentsTreeRemove( event, treeId, treeNode ) {
  $.ajax({
    type: "delete",
    dataType: 'json',
    url: contextPath + version + "/api/pageModuleType/module/type/delete/" + treeNode.id,
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
  var sObj = $( "#" + treeNode.tId + "_span" );
  if ( treeNode.editNameFlag || $( "#addBtn_" + treeNode.tId ).length > 0 ) return;
  var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>";
  sObj.after(addStr);
  var btn = $( "#addBtn_" + treeNode.tId );
  if ( btn ) btn.bind( "click", function() {
    window.pickerTree.addNodes( treeNode, { pId: treeNode.id, name: "new node" } );
    return false;
  } );
}

function handleRemoveHoverDom(treeId, treeNode) {
  $( '#addBtn_' +treeNode.tId) .unbind().remove();
}

function handleComponentPreview( pId, e ) {
  window.location.href = contextPath + version + '/pageModule/moduleShow?moduleId=' + pId;
}

function handleComponentModuleEditor( pId, e ) {
  window.location.href = contextPath + version + '/pageModule/editModule/' + pId;
}

function handleComponentModuleDelete( pId, e ) {
  if ( confirm( "确定要删除该条资源吗？" ) ){
    $.ajax({
      type: "delete",
      url: contextPath + version + "/api/pageModule/module/delete/" + pId,
      success: function( data ) {
        if ( data.code == 200 ){
          $( e.target ).parent().parent().remove();
        } else {
          alert( data.message );
        }
      }
    });
  }
}

function renderBreadCrumb() {
  var selectNode = window.pickerTree.getSelectedNodes()[0];
  var activeCrumb = "";

  for( var i = 0; true; i++ ) {
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
  var leafs = "";

  data.forEach( function( leaf, index ) {
    leafs += "<artical class='item-artical' data-pageId='" + leaf.moduleId +
      "' data-updateDate='" + leaf.updateDate +
      "' data-createBy='" + leaf.createBy +
      "'data-createDate='" + leaf.createDate + "'>" +
      "  <img style='width: 50px; height: 50px;' src='/img/module.png' >" +
      "  <span>" + leaf.moduleName + "</span>" +
      "  <menu class='artical-menu'>" +
      "    <div class='menu-btn' data-type='0'>预览</div>" +
      "    <div class='menu-btn' data-type='1'>编辑</div>" +
      "    <div class='menu-btn' data-type='2'>删除</div>" +
      "  </menu>" +
      "</artical>"
  } );

  $( '.item-aside' ).html( '' ).html( leafs );
}

function renderLeafDetail( pageId, createBy, createDate, updateDate ) {
  var detail = "<span>编号：" + pageId + "</span>" +
    "<span>创建者：" + createBy + "</span>" +
    "<span>创建日期：" + timestampToTime( parseInt( createDate ) ) + "</span>" +
    "<span>更新日期：" + timestampToTime( parseInt( updateDate ) ) + "</span>";

  $( '.item-footer' ).html( '' ).html( detail );
}

$( document ).ready( function () {
  window.pickerTree = $.fn.zTree.init( $( "#pageTypeTree" ), setting );
  handleComponentsTreeClick( null, null, { id: 'root' } );
} );

$( '.item-aside' ).delegate( 'artical', 'mousemove', function( e ) {
  $( this ).addClass( 'artical-active' ).siblings().removeClass( 'artical-active' );
  $( this ).children( '#tempInput' )[0]? null: $( this ).children( 'menu' ).css( 'left', '75%' );
  var target = $( e.target ).is( 'artical' )? $( e.target ): $( e.target ).parent();
  var pageId = target.attr( 'data-pageId' );
  var createBy = target.attr( 'data-createby' );
  var createDate = target.attr( 'data-createDate' );
  var updateDate = target.attr( 'data-updateDate' );
  renderLeafDetail( pageId, createBy, createDate, updateDate );
} )
  .delegate( 'artical', 'mouseleave', function( e ) {
    $( this ).removeClass( 'artical-active' ).children( 'menu' ).css( 'left', '100%' ); } )
  .delegate( '.menu-btn', 'click', function( e ) {
    var type = $( e.target ).attr( 'data-type' );
    var pId = $( e.target ).parent().parent().attr( 'data-pageId' );
    var pageName = $( e.target ).parent().prev( 'span' ).html();
    switch ( type ) {
      case '0': handleComponentPreview( pId, pageName, e ); break;
      case '1': handleComponentModuleEditor( pId, e ); break;
      case '2': handleComponentModuleDelete( pId, e ); break;
    }
  } );

$( '#menu-btn-add' ).click( function() {
  window.location.href = contextPath + version + '/pageModule/addModule/' + window.pickerTree.getSelectedNodes()[0].id;
} );