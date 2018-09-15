/**
 Version v0.0.5
 User songshuzhong@bonc.com.cn
 ------------------------------------------------------------
 Date         Author          Version            Description
 ------------------------------------------------------------
 2018年9月14日 songshuzhong   v0.0.5            重构代码结构、采用html5原生拖放api
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
    node.className = node.className.replace( 'drag-container', '').replace( 'ui-sortable', '' ).replace( 'ui-draggable', '' ).replace( 'drag', '' ).replace( 'weak drag', '').replace( 'normal drag', '' ).replace( 'force drag', '');
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
  while ( node&&( node.className.includes( 'weak drag' ) || node.className.includes( 'normal drag' ) || node.className.includes( 'force drag' ) || node.className.includes( 'body drop' ) ) ) {
    node = node.parentNode;
  }

  return node;
}

function findParentDropHelper( node ) {
  while ( node&&!( node.className.includes( 'weak drop' ) || node.className.includes( 'normal drop' ) || node.className.includes( 'force drop' ) || node.className.includes( 'body drop' ) ) ) {
    node = node.parentNode;
  }

  return node? node.getAttribute( 'data-uuid' ): 'container';
}

function findPrevSiblingTag( node ) {
  try {
    while ( node.parentNode&&!node.className.includes( 'weak drop' ) || node.className.includes( 'normal drop' ) || node.className.includes( 'force drop' ) || node.className.includes( 'body drop' ) ) {
      node = node.parentNode;
    }
    return node.previousSibling.getAttribute( 'data-uuid' );
  } catch ( e  ) { return 0; }
}

function findNextSiblingTag( node ) {
  try {
    while ( node.parentNode&&!node.className.includes( 'weak drop' ) || node.className.includes( 'normal drop' ) || node.className.includes( 'force drop' ) || node.className.includes( 'body drop' ) ) {
      node = node.parentNode;
    }
    return node.nextSibling.getAttribute( 'data-uuid' );
  } catch ( e  ) { return 0; }
}