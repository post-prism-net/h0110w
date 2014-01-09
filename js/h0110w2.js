$( document ).ready( function() {
  
  h0ll0w.init();

} ); /* } document.ready */


var h0ll0w = ( function() {

  var debug = true;

  var init = function() {

    tools.init();
    nav.init(); 
    content.init();
    url.init(); 

    $( '.content' ).focus();

  }

  var encode = function( html ) {

    var base64 = $.base64.encode( html );
    return base64;
  
  }

  var decode = function( base64 ) {

    var html = $.base64.decode( base64 );
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

    var el_content = null;

    var init = function() {

      el_content = $( '.content' );
      bindEventHandlers();
    
      el_content.focus();

    }

    var bindEventHandlers = function() {

      is_typing = false;

      el_content.on( 'blur keyup paste', function() {

        // throttle keyup event
        if( !is_typing ) {

          is_typing = true;

          setTimeout( function() {
            is_typing = false;
            onTyping();
          }, 1000 );

        }

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

    var onTyping = function() {

        var html = el_content.html();
        var lz = encode( html );

        url.update( lz );
        nav.update( url.getBaseURL() + '#/' + lz );

    }

    var update = function( html ) {

      debuglog( 'content.update( ' + html + ')' );

      el_content.html( html );

    }

    return {
      init: function() { init(); },
      update: function( html ) { update( html ); }
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
    init: function() { init(); }
  }


} )()