let pageTypeId = "root";
let pagesTreeRoot = { id: "root", name: "资源分类", isParent: true, open: true };
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

  return contextPath + version +  "/api/pageResType/restype/detail/" + id;
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
  $('#v-res-table').bootstrapTable( 'refresh', {
    url: contextPath + version +  "/api/pageRes/restype/resinfo/" + treeNode.id,
  } );
  renderBreadCrumb();
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

$( document ).ready( function () {
  window.pickerTree = $.fn.zTree.init( $( "#pageTypeTree" ), setting );
  handlePagesTreeClick( null, null, { id: 'root' } );
} );

window.operateEvents = {
  'click .like': function(e, value, row, index) {
    console.log(value, row, index);
  },
  'click .edit': function(e, value, row, index) {
    console.log(value, row, index);
  },
  'click .remove': function(e, value, row, index) {
    console.log(value, row, index);
  }
};

$("#v-res-table").bootstrapTable({
    url: contextPath + version +  "/api/pageRes/restype/resinfo/" + ( window.pickerTree? window.pickerTree.getSelectedNodes()[0]: 'root' ),
    method: "post",
    striped: true,
    cache: false,
    pagination: true,
    sortable: true,
    sortOrder: "asc",
    responseHandler: function(res) {
      return {
        "total": res.total,
        "rows": res.data
      };
    },
    queryParams: function(params) {
      return {
        limit: params.limit,
        offset: params.offset,
        order: params.order,
        search: params.search,
        sort: params.sort
      };
    },
    sidePagination: "server",
    pageNumber: 1,
    pageSize: 5,
    pageList: [10, 25, 50, 100],
    search: false,
    strictSearch: false,
    showColumns: false,
    showRefresh: false,
    minimumCountColumns: 2,
    clickToSelect: true,
    width: '100%',
    height: 'auto',
    uniqueId: "Id",
    showToggle: false,
    cardView: false,
    detailView: false,
    columns: [
      {
        radio: true
      }, {
        field: "resName",
        title: "资源名称",
        sortable: true
      }, {
        field: "resTypeName",
        title: "任务描述"
      }, {
        field: "createDate",
        title: "创建时间"
      }, {
        field: "operate",
        title: "操作",
        align: "center",
        valign: "middle",
        clickToSelect: false,
        events: window.operateEvents,
        formatter: operateFormatter
      }
    ]
  }
);
function operateFormatter(value, row, index) {
  return [
    '<a class="like" href="javascript:void(0)" title="Like">',
    '<i class="glyphicon glyphicon-heart"></i>',
    '</a>',
    ' <a class="edit" href="javascript:void(0)" title="Edit">',
    '<i class="glyphicon glyphicon-edit"></i>',
    '</a>',
    ' <a class="remove" href="javascript:void(0)" title="Remove">',
    '<i class="glyphicon glyphicon-remove"></i>',
    '</a>'
  ].join('');
}
