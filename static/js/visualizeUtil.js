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
function getUUID(){
  let s = [];
  let hexDigits = '0123456789abcdef';

  for ( let i = 0; i < 8; i++ ) {
    s[ i ] = hexDigits.substr( Math.floor( Math.random() * 0x10 ), 1 );
  }
  s[ 14 ] = '4';
  s[ 19 ] = hexDigits.substr( ( s[ 19 ] & 0x3 ) | 0x8, 1 );

  return s.join( '' );
}

function signUUID( node ) {
  if ( node && node.nodeType === 1 && node.getAttribute( 'data-uuid' ) !== '' ) {
    node.setAttribute( 'data-uuid', getUUID() );
  }

  let childNodes = node? node.childNodes: [];
  for( let i = 0, length = childNodes.length; i < length; i++ ) {
    signUUID( childNodes[ i ] );
  }
}

function delUUID( node ) {
  if ( node && node.nodeType === 1 ) {
    node.removeAttribute( 'data-uuid' );
    node.className = node.className.replace( 'drag-container', '').replace( 'ui-sortable', '' ).replace( 'ui-draggable', '' ).replace( 'drag', '' );
  }
  let childNodes = node? node.childNodes: [];
  for ( let i = 0, length = childNodes.length; i < length; i++ ) {
    delUUID( childNodes[ i ] );
  }
}

function cleanSelf( e ) {
  //$( e ).parent().append( $( e ).children().html() );
  $( e ).parent().find( e ).remove();
}

function findParentDragHelper( e ) {
  let node = e.target;
  while ( node&&!node.className.includes( 'drag ui-draggable' ) ) {
    node = node.parentNode;
  }

  return node;
}

function findParentDropHelper( node ) {
  while ( node&&!node.className.includes( 'drop-helper' ) ) {
    node = node.parentNode;
  }

  return node? node.getAttribute( 'data-uuid' ): 'container';
}

function findPrevSiblingTag( node ) {
  while ( node.parentNode&&!node.parentNode.className.includes( 'drop-helper' ) ) {
    node = node.parentNode;
  }

  try {
    return node.previousSibling.getAttribute( 'data-uuid' );
  } catch ( e  ) { return 0; }
}

function findNextSiblingTag( node ) {
  while ( node.parentNode&&!node.parentNode.className.includes( 'drop-helper' ) ) {
    node = node.parentNode;
  }

  try {
    return node.nextSibling.getAttribute( 'data-uuid' );
  } catch ( e  ) { return 0; }
}