/* config */

debugmode = true;
baseUrl = location.href.replace( location.hash, '' );

/* document.ready */

$( document ).ready( function() {
  
  baseUrl = $( 'head' ).attr( 'data-baseurl' );
  debuglog( 'baseUrl: ' + baseUrl );

  // onLoad();

  h0ll0w.init();

  
  /* on content change */

  /*

  $( document ).on( 'blur keyup paste', '.content', function() {

    var inputHtml = $( this ).html();

    onContentChange( inputHtml );

  } );

  */
  
  /* on select / jump */

  /*

  dblclickTimer = 0;
  dblclick = false;

  $( document ).on( 'mouseup', '.content', function() {

    if( !dblclick ) {

      window.setTimeout( function() {

        onClick();

      }, 250 );


    }

    dblclick = true;

    dblclickTimer = setTimeout( function() {

      dblclick = false;

    }, 250 );

  } );

  */


  /* on hover styles */

  /*

  $( document ).on( 'mouseenter', '.content em, .content strong', function() {

    showToolBar( $( this ) );


  } );


  $( document ).on( 'mouseleave', '.content em, .content strong', function() {

    hideBars();

  } );

*/


} ); /* } document.ready */


/* global vars */

// var md = '';
// var html = '';


/* event callbacks */

/*

function onLoad() {

  getQuery();  

  $( '.content' ).focus();

}
*/

/*

function onContentChange( html ) {

  // debuglog( 'onContentChange()' );

  // update global vars
  html = html;
  md = html2md( html );

  updateUrl( md );

  // debuglog( 'HTML: ' + html );
  // debuglog( 'MD: ' + md );

}
*/

/*

function onClick() {

  debuglog( 'onClick()' );

  var range = rangy.getSelection().getRangeAt( 0 );

  debuglog( 'range: ' + range );

  destroyTemp();

  if( range.toString() != '' ) {

    onSelection( range );

  } else {

    hideBars();

  }

}

*/

/*


function onSelection( range ) {

  var el = buildTemp( range );

  showToolBar( el, range );

}

*/


/* style */

/*

function addStyle( range, type ) {

  debuglog( 'addStyle()' );

  debuglog( 'range: ' + range );

  var el = document.createElement( type );
  
  range.surroundContents( el );

  destroyTemp();

  range.collapse();

  hideBars();

}

*/

/*
function removeStyle( el ) {

  debuglog( 'removeStyle()' );

  el.replaceWith( el.html() );

  hideBars();

  $( '.content' ).trigger( 'keyup' );

}
*/

/* temporary element */

/*

function buildTemp( range ) {

  debuglog( 'buildTemp()' );

  debuglog( 'range: ' + range );

  var el = document.createElement( 'temp' );
  range.surroundContents( el );

  return $( el );

}


function destroyTemp() {

  debuglog( 'destroyTemp()' );

  $( 'temp' ).each( function() {

      $( this ).replaceWith( $( this ).html() );

  } );

}

*/


/* update functions */

/*

function updateUrl( md ) {

  history.replaceState( 0, document.title, '#/' + md );
  // location.hash = '/' + md;

}


function updateContent( html ) {

  $( '.content' ).html( html );

}

*/

/*

function getQuery() {

  var query = decodeURIComponent( window.location.href.replace( baseUrl, '' ) );

  // delete /# from beginning of the query

  if( query.substr( 0,2 ) == '#/' ) {
    query = query.substr( 2 );
  }

  debuglog( 'query: ' + query, true );

  if( query.length > 0 ) {

    md = query;
    html = md2html( md );

    updateContent( html );

  }

}

*/


/* text conversion */

/*

function md2html( md ) {

  var html;

  html = md
    .replace( /\_\_(.*?)\_\_/g, '<strong>$1</strong>' )
    .replace( /\_(.*?)\_/g, '<em>$1</em>' )
    .replace( /[+]/g, ' ' ) // already done by decodeURIComponent() ???
    .replace( /\/\//g, '<br>' );

  return html;

}


function html2md( html ) {

  var md;

  md = html
    .replace( /<strong>/g, '__' )
    .replace( /<\/strong>/g, '__' )
    .replace( /<em>/g, '_' )
    .replace( /<\/em>/g, '_' )
    .replace( / /g, '+' )
    .replace( /<temp>/g, '' )
    .replace( /<\/temp>/g, '' )
    .replace( /&nbsp;/g, '+' )
    .replace( /<div(.+?)<\/div>/g, '' )
    .replace( /<br>/g, '//' );

  return md;

}

*/

/* toolbars */

/*

function showToolBar( el, range ) {

  debuglog( 'showToolBar( el: ' + el + ', range: ' + range + ')' );


  hideBars();

  var toolbar = $( '<div class="tools" contenteditable="false"></div>' );
  var offset = el.offset();
  var type = ( el.get(0).tagName == 'TEMP' ) ? 'add' : 'remove';
  var links = new Array();


  if( type == 'remove' ) {

    // link remove style

    links.push( $( '<a href="#" class="remove" title="Remove format">Remove format</a>' ).on( 'click', function() {

      removeStyle( el );

    }) );

  } else {

    //* link strong style

    links.push( $( '<a href="#" class="strong" title="strong">Strong</a>' ).on( 'click', function( e ) {

      e.preventDefault();
      addStyle( range, 'strong' );
    
    }) );

    // link em style
    
    links.push( $( '<a href="#" class="emphasize" title="emphasize">Emphasize</a>' ).on( 'click', function( e ) {

      e.preventDefault();
      addStyle( range, 'em' );

    }) );

  }

  $.each( links, function() {

    toolbar.append( $( this ) );

  });

  toolbar.prependTo( el );

  setTimeout( function() {

    toolbar.toggleClass( 'active' );

  }, 1 );

}


function hideBars() {
    
  $( '.tools' )
    .removeClass( 'active' )
    .delay( 500 )
    .remove();

}

*/

/* debuglog */

function debuglog( log, force ) {

  if( ( debugmode || force ) && typeof console != 'undefined' ) console.log( log );

}

var h0ll0w = ( function() {

  var debug = true;
  var md = '';
  var html = '';

  var init = function() {

    tools.init();
    content.init();
    url.init();  

    $( '.content' ).focus();

  }

  var md2html = function( html ) {

    var html;

    html = html
      .replace( /\_\_(.*?)\_\_/g, '<strong>$1</strong>' )
      .replace( /\_(.*?)\_/g, '<em>$1</em>' )
      .replace( /[+]/g, ' ' ) // already done by decodeURIComponent() ???
      .replace( /\/\//g, '<br>' );

    return html;

  }

  var html2md = function( html ) {

    var md;

    md = html
      .replace( /<strong>/g, '__' )
      .replace( /<\/strong>/g, '__' )
      .replace( /<em>/g, '_' )
      .replace( /<\/em>/g, '_' )
      .replace( / /g, '+' )
      .replace( /<temp>/g, '' )
      .replace( /<\/temp>/g, '' )
      .replace( /&nbsp;/g, '+' )
      .replace( /<div>/g, '' )        //opening divs w/o attributes
      .replace( /<\/div>/g, '' )      //closing divs
      .replace( /<span>/g, '' )       //opening spans w/o attributes
      .replace( /<\/span>/g, '' )     //closing spans
      .replace( /<br>/g, '//' );

    return md;

  } 

  // module url 
  var url = ( function() {

    var init = function() {

      debuglog( 'url.init()' );

      var query = decodeURIComponent( location.href.replace( baseUrl, '' ) );

      // delete '/#'' from beginning of the query
      if( query.substr( 0,2 ) == '#/' ) {
        query = query.substr( 2 );
      }

      debuglog( 'query: ' + query, true );

      if( query.length > 0 ) {

        md = query;
        html = md2html( md );

        content.update( html );

      }

    }

    var update = function( m ) {

      debuglog( 'url.update( ' + m + ' )' );

      history.replaceState( 0, document.title, baseUrl + '#/' + m );
    }

    return {
      init: function() { init(); },
      update: function( m ) { update( m ) }
    }


  } )();


  // module content 
  var content = ( function() {

    var el_content = null;

    var init = function() {

      el_content = $( '.content' );
      bindEventHandlers();
    
    }

    var bindEventHandlers = function() {

      el_content.on( 'blur keyup paste', function() {

        html = el_content.html();
        md = html2md( html );

        url.update( md );

      } );
      
      /* on select / jump */

      dblclickTimer = 0;
      dblclick = false;

      el_content.on( 'mouseup', function() {

        if( !dblclick ) {

          window.setTimeout( function() {

            var range = rangy.getSelection().getRangeAt( 0 );

            selection.destroyTemp();

            if( range.toString() != '' ) {
              
              debuglog( 'range: ' + range );

              var el = selection.buildTemp( range );

              debuglog( 'el: ' + el );

              tools.build( el, range );
            
            } else {
              tools.hide();
            }

          }, 250 );

        }

        dblclick = true;
        dblclickTimer = setTimeout( function() {
          dblclick = false;
        }, 250 );

      } );

      $( document ).on( 'mouseenter', '.content em, .content strong', function() {
        tools.build( $( this ) );
      } );


      $( document ).on( 'mouseleave', '.content em, .content strong', function() {
        tools.hide();
      } );

    }

    var update = function( c ) {

      debuglog( 'content.update( ' + c + ')' );

      el_content.html( c );

    }

    return {
      init: function() { init(); },
      update: function( c ) { update( c ); }
    }

  } )();


  // module tools
  var tools = ( function() {

    var el_tools;

    var init = function() {
      el_tools = $( '.tools' );
    }

    var build = function( el, range ) {

      debuglog( 'tools.build( el: ' + el + ', range: ' + range + ')' );

      hide();

      var el_tools = $( '<div class="tools" contenteditable="false"></div>' );

      if( el ) {

      var offset = el.offset();
      var type = ( el.get(0).tagName == 'TEMP' ) ? 'add' : 'remove';
        
      }
      
      var links = new Array();

      if( type == 'remove' ) {

        /* link remove style */

        links.push( $( '<a href="#" class="remove" title="Remove format">Remove format</a>' ).on( 'click', function( e ) {

          e.preventDefault();
          selection.removeFormat( el );

        }) );

      } else {

        /* link strong style */

        links.push( $( '<a href="#" class="strong" title="strong">Strong</a>' ).on( 'click', function( e ) {

          e.preventDefault();
          selection.addFormat( range, 'strong' );
        
        }) );

        /* link em style */
        
        links.push( $( '<a href="#" class="emphasize" title="emphasize">Emphasize</a>' ).on( 'click', function( e ) {

          e.preventDefault();
          selection.addFormat( range, 'em' );

        }) );

      }

      $.each( links, function() {

        el_tools.append( $( this ) );

      });

      el_tools.prependTo( el );

      show();

    }

    var show = function() {

      setTimeout( function() {

        el_tools.toggleClass( 'active' );

      }, 1 );

    }

    var hide = function() {

      init();

      el_tools.removeClass( 'active' );

      destroy();

    }

    var destroy = function() {

      init();

      el_tools
        .delay( 500 )
        .remove();

    }

    return {
      init:  function() { init() },
      build: function( el, range ) { build( el, range ) },
      show:  function() { show() },
      hide:  function() { hide() },
      destroy: function() { destroy() }
    }

  } )();


  // module selection
  var selection = ( function() {

    var buildTemp = function( range ) {

      debuglog( 'selection.buildTemp( ' + range + ' )' );

      var el = document.createElement( 'temp' );
      range.surroundContents( el );

      debuglog( $( el ) );

      return $( el );
    }

    var destroyTemp = function() {

      debuglog( 'selection.destroyTemp()' );

      $( 'temp' ).each( function() {

          $( this ).replaceWith( $( this ).html() );

      } );

    }

    var addFormat = function( range, tag ) {

      debuglog( 'selection.addFormat( ' + range + ',' + tag + ')' );

      var el = document.createElement( tag );
      
      range.surroundContents( el );
      destroyTemp();
      range.collapse();
      tools.hide();

      $( '.content' ).trigger( 'keyup' );

      
    }

    var removeFormat = function( el ) {

      debuglog( 'removeFormat()' );

      el.replaceWith( el.html() );
      tools.hide();

      $( '.content' ).trigger( 'keyup' );
    }

    return {
      buildTemp: function( range ) { return buildTemp( range ); },
      destroyTemp: function() { destroyTemp(); },
      addFormat: function( range, tag ) { addFormat( range, tag ); },
      removeFormat: function( el ) { removeFormat( el ) }
    }


  } )();


  // debuglog 

  var debuglog = function( l ) {

    if( ( debug ) && typeof console != 'undefined' ) console.log( l );

  }

  return {
    init: function() { init(); }
  }


} )()