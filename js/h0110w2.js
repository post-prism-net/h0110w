$( document ).ready( function() {
  
  h0110w.init();

} ); /* } document.ready */


var h0110w = ( function() {

  var debug = true;

  var init = function() {
    debuglog( 'h0110w.init()');

    tools.init();
    nav.init(); 
    content.init();
    url.init(); 

    $( '.content' ).focus();

  }

  var encode = function( html ) {

    var base64 = LZString.compressToBase64( html );
    return base64;
  
  }

  var decode = function( base64 ) {

    var html = LZString.decompressFromBase64( base64 );
    return html;
  
  }

  // module url 
  var url = ( function() {

    var baseURL = $( 'head' ).attr( 'data-baseurl' );


    var init = function() {
      debuglog( 'url.init()' );

      var query = decodeURIComponent( location.href.replace( baseURL, '' ) );

      // delete '/#'' from beginning of the query
      if( query.substr( 0,2 ) == '#/' ) {
        query = query.substr( 2 );
      }

      debuglog( 'query: ' + query, true );

      if( query.length > 0 ) {

        var html = decode( query );
        content.update( html );

        nav.update( baseURL + '#/' + query );

      }

    }

    var update = function( query ) {
      debuglog( 'url.update( ' + query + ' )' );

      history.replaceState( 0, document.title, baseURL + '#/' + query );
    }

    return {
      init: function() { init(); },
      update: function( query ) { update( query ) },
      getBaseURL: function() { return baseURL }
    }


  } )();


  // module content 
  var content = ( function() {

    var el_content;

    var init = function() {

      el_content = $( '.content' );
      bindEventHandlers();
    
    }

    var bindEventHandlers = function() {

      is_typing = false;

      el_content.on( 'blur keyup', function() {

        debuglog( 'on.keyup' );

        // throttle keyup event
        if( !is_typing ) {

          is_typing = true;

          setTimeout( function() {
            is_typing = false;
            onTyping();
          }, 1000 );

        }

      } );

      el_content.on( 'mouseup', function() {
        debuglog( 'on.mouseup()' );

        if( getSelection() != '' ) {

          debuglog( 'on.select()' );

          // show tools
          tools.show();


        } else {

          // hide tools
          tools.hide();

        }

      } );
      
      $( document ).on( 'mouseenter', '.content em, .content strong', function() {
        tools.build( $( this ) );
      } );


      $( document ).on( 'mouseleave', '.content em, .content strong', function() {
        tools.hide();
      } );

    }

    var onTyping = function() {

        var html = el_content.html();
        var lz = encode( html );

        url.update( lz );
        nav.update( url.getBaseURL() + '#/' + lz );

    }

    var getSelection = function() {

      var text = '';
        if( window.getSelection ) {
          text = window.getSelection();
        } else if( document.getSelection ) {
          text = document.getSelection();
        } else if( document.selection ) {
          text = document.selection.createRange().text;
        }

        return text;

    }

    var format = function( format ) {
      debuglog( 'content.format( ' + format + ' )' );

      document.execCommand( format );
    }

    var update = function( html ) {
      debuglog( 'content.update( ' + html + ')' );

      el_content.html( html );
    }

    return {
      init: function() { init(); },
      getSelection: function() { getSelection(); },
      format: function( f ) { format( f ) },
      update: function( html ) { update( html ); }
    }

  } )();


  // module clipboard
  var clipboard = ( function() { 

    var paste = function( el, e ) {

      document.execCommand( 'insertText', false, e.clipboardData.getData( 'text/plain' ) );
      e.preventDefault();

    }

    return {
      paste: function( el, e ) { paste( el, e ) }
    }

  } )()

  // module tools
  var tools = ( function() {

    var el_tools;

    var init = function() {

      build();
      bindEventHandlers();
      el_tools = $( '.tools' );
    
    }

    var bindEventHandlers = function() {

      $( document ).on( 'click', '.tools a', function( e ) {

        e.preventDefault();
        var format = $( this ).attr( 'data-format' );
        content.format( format );

      } );

    }

    var build = function( el, range ) {

      debuglog( 'tools.build( el: ' + el + ', range: ' + range + ')' );

      var el_tools = $( '<div class="tools" contenteditable="false"></div>' );      
      var links = new Array();


      /* link strong style */
      links.push( $( '<a href="javascript:void(0)" class="strong" data-format="bold" title="strong">A</a>' ) );

      /* link em style */
      links.push( $( '<a href="javascript:void(0)" class="emphasize" data-format="italic" title="emphasize">A</a>' ) );
      
      /* link remove style */
      links.push( $( '<a href="javascript:void(0)" class="remove" data-format="removeFormat" title="remove Format">&times</a>' ) );


      $.each( links, function() {
        el_tools.append( $( this ) );
      });

      el_tools.prependTo( $( 'body' ) );

    }

    var show = function() {
      debuglog( 'tools.show()' );

      setTimeout( function() {

        el_tools.addClass( 'active' );

      }, 1 );

    }

    var hide = function() {
      debuglog( 'tools.hide()' );

      el_tools.removeClass( 'active' );
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

  // module nav 

  var nav = ( function() {

    var el_nav;

    var init = function() {

      el_nav = $( 'nav' );
      bindEventHandlers();

    }

    var bindEventHandlers = function() {

      // prevent action on share link 
      el_nav.find( '.share' ).on( 'click', function( e ) {

        e.preventDefault();

      } );


      // select url on click 
      el_nav.find( '.share input' ).on( 'click', function() {

        $( this ).select();

      } );

    }


    var update = function( url ) {
      debuglog( 'nav.update( ' + url + ' )' );
      debuglog( el_nav );

      el_nav.find( '.share input' )
        .attr( 'value', '' )
        .attr( 'value', url );
    }

    return {
      init: function() { init(); },
      update: function( url ) { update( url ); }
    }


  } )();


  // debuglog 

  var debuglog = function( l ) {

    if( ( debug ) && typeof console != 'undefined' ) console.log( l );

  }

  return {
    init: function() { init(); },
    clipboard: clipboard
  }


} )()