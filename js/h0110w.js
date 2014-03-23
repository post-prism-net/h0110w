/**
 * h0110w App
 */
var h0110w = ( function() {

  /**
   * General configuration
   */
  var config = new Array();

  config['debug'] = false;
  config['default_text'] = '<strong>h0110w</strong><br><br>transient publishing.';

  /**
   * Init h0110w
   */
  var init = function() {
    debuglog( 'h0110w.init()');

    $( 'html' ).addClass( 'js' );

    tools.init();
    nav.init(); 
    content.init();
    url.init(); 

    $( '.content' ).focus();
  }

  /**
   * Encodes the content HTML to URL-safe Base64 encoded LZ compressioned string
   * http://pieroxy.net/blog/pages/lz-string/index.html
   *
   * @param   {string}  html  HTML content
   * @return  {string}  base64 string
   */
  var encode = function( html ) {
    var base64 = LZString.compressToBase64( html );
    debuglog( 'Compression ratio: ' + computeRatio( html, base64 ) + '%' );
    return base64;
  }

  /**
   * Decodes a base 64 encoded LZ compressed string to HTML content
   * http://pieroxy.net/blog/pages/lz-string/index.html
   *
   * @param   {string}  base64  base64 string
   * @return  {string}  html content      
   */
  var decode = function( base64 ) {
    var html = LZString.decompressFromBase64( base64 );
    return html;
  }

  var computeRatio = function( html, base64 ) {
    var ratio = parseInt( base64.length / html.length * 100 );
    return ratio; 
  }

  /**
   * Module URL
   */
  var url = ( function() {

    var baseURL;

    /**
     * Init module
     */
    var init = function() {
      debuglog( 'url.init()' );

      baseURL = window.location.href.replace( window.location.hash, '' );
      var hash = decodeURIComponent( location.href.replace( baseURL, '' ) );

      /**
       * remove '/#' from hash
       */
      if( hash.substr( 0,2 ) == '#/' ) {
        hash = hash.substr( 2 );
      }

      if( hash.length > 0 ) {
        var html = decode( hash );
        content.update( html );
      } else {
        content.update( config['default_text'] );
      }

      content.focusEnd();
      nav.update( baseURL + '#/' + hash );
    }

    /**
     * Updates the URL's hash 
     *
     * @param   {string}   hash   base64 encoded LZ compressed string
     */
    var update = function( hash ) {
      history.replaceState( 0, document.title, baseURL + '#/' + hash );
    }

    return {
      init:       function() { init(); },
      update:     function( query ) { update( query ) },
      getBaseURL: function() { return baseURL }
    }

  } )();


  /**
   * Module content
   */ 
  var content = ( function() {

    var el_content;

    /**
     * Init module
     */
    var init = function() {
      el_content = build();
      bindEventHandlers();
      focusEnd();
    }

    /**
     * Bind event Handlers to elements
     */
    var bindEventHandlers = function() {
      is_typing = false;

      /**
       * Keyup event, throttled
       */
      el_content.on( 'blur keyup', function() {
        debuglog( 'on.keyup' );

        if( !is_typing ) {
          is_typing = true;

          setTimeout( function() {
            is_typing = false;
            onTyping();
          }, 1000 );
        }
      } );

      /**
       * Poor man's onSelect event
       */
      el_content.on( 'mouseup touchend', function() {
        if( getSelection() != '' ) {
          debuglog( 'event:select' );
          tools.show();
        } else {
          tools.hide();
        }
      } );
    }

    /**
     * Build the content area
     * 
     * @return  {object}  jquery object
     */
    var build = function() {
      debuglog( 'content.build()' );

      var html = $( '<div></div>' );

      html
        .addClass( 'content' )
        .attr( 'contenteditable', 'true' )
        .attr( 'onpaste', 'h0110w.clipboard.paste( this, event );' );

      $( 'body' ).append( html );

      return html;
    }

    /**
     * Event: content changed
     */
    var onTyping = function() {
        var html = el_content.html();
        var lz = encode( html );

        url.update( lz );
        nav.update( url.getBaseURL() + '#/' + lz );
    }

    /**
     * Wrapper function to get current selected text 
     *
     * @return  {string}  selected text
     */
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
    
    /**
     * Set the cursor to the end of the current text content.
     */
    var focusEnd = function() {

      var range;
      var selection;

      if( document.createRange ) {
          range = document.createRange();
          range.selectNodeContents( el_content[0] );
          range.collapse( false );
          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange( range );
      } else if( document.selection ) { 
          range = document.body.createTextRange();
          range.moveToElementText( el_content[0] );
          range.collapse( false );
          range.select();
      }
    }

    /**
     * Format selected content text
     * See http://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla?redirectlocale=en-US&redirectslug=Web%2FAPI%2Fdocument.execCommand#Executing_Commands 
     *
     * @param   {string}  format  format type
     */
    var format = function( format ) {
      debuglog( 'content.format( ' + format + ' )' );
      document.execCommand( format );
    }

    /**
     * Update the whole content HTML
     *
     * @param   {string}  html  HTML content
     */
    var update = function( html ) {
      el_content.html( html );
    }

    return {
      init:         function() { init(); },
      getSelection: function() { getSelection(); },
      focusEnd:     function() { focusEnd(); },
      format:       function( f ) { format( f ) },
      update:       function( html ) { update( html ); }
    }

  } )();


  /**
   * Module clipboard
   */
  var clipboard = ( function() { 

    /**
     * Paste raw-text-only from clipboard
     *
     * @param   {object}  el  jquery object 
     * @param   {object}  e   event object
     */
    var paste = function( el, e ) {
      document.execCommand( 'insertText', false, e.clipboardData.getData( 'text/plain' ) );
      e.preventDefault();
    }

    return {
      paste: function( el, e ) { paste( el, e ) }
    }

  } )()


  /**
   * Module format tools
   */  
  var tools = ( function() {

    var el_tools;

    var init = function() {
      el_tools = build();
      bindEventHandlers();
    }

    /**
     * bind event handlers to DOM elements
     */  
    var bindEventHandlers = function() {
      $( document ).on( 'click', '.tools a', function( e ) {
        e.preventDefault();
        var format = $( this ).attr( 'data-format' );
        content.format( format );
      } );
    }

    /**
     * build tools
     *
     * @return  {object}  jquery object   
     */  
    var build = function() {
      debuglog( 'tools.build()' );

      var html = $( '<div class="tools" contenteditable="false"></div>' );      
      var links = new Array();

      /* link remove style */
      links.push( $( '<a href="javascript:void(0)" class="remove" data-format="removeFormat" title="remove format">Aa</a>' ) );

      /* link strong style */
      links.push( $( '<a href="javascript:void(0)" class="strong" data-format="bold" title="> strong">Aa</a>' ) );

      /* link em style */
      links.push( $( '<a href="javascript:void(0)" class="emphasize" data-format="italic" title="> emphasize">Aa</a>' ) );

      $.each( links, function() {
        html.append( $( this ) );
      });
      html.prependTo( $( 'body' ) );

      return html;
    }

    /**
     * show tools
     */ 
    var show = function() {
      debuglog( 'tools.show()' );
      setTimeout( function() {
        el_tools.addClass( 'active' );
      }, 1 );
    }

    /**
     * hide tools
     */ 
    var hide = function() {
      debuglog( 'tools.hide()' );
      el_tools.removeClass( 'active' );
    }

    /**
     * destroy tools
     */ 
    var destroy = function() {
      init();

      el_tools
        .delay( 500 )
        .remove();
    }

    return {
      init:    function() { init() },
      build:   function() { build() },
      show:    function() { show() },
      hide:    function() { hide() },
      destroy: function() { destroy() }
    }

  } )();


  /**
   * Module navigation 
   */
  var nav = ( function() {

    var el_nav;

    /**
     * Init module
     */
    var init = function() {
      el_nav = build();
      bindEventHandlers();
    }

    /**
     * bind event handlers to elements
     */
    var bindEventHandlers = function() {
      el_nav.find( '.share' ).on( 'click', function( e ) {
        e.preventDefault();
      } );

      el_nav.find( '.share input' ).on( 'click', function() {
        $( this ).select();
      } );
    }

    /**
     * build navigation DOM elements
     * 
     * return   {object}  jquery object
     */
    var build = function() {
      debuglog( 'nav.build()' );

      var html = $( '<nav><h1>h0110w</h1></nav>' );

      debuglog( 'url.getBaseURL: ' + url.getBaseURL() );

      html
        .append( '<a href="#" class="share">share<span><input type="text" name="url" value="" readonly="readonly"/></span></a>' )
        .append( '<a href="#" class="new" target="_blank">new</a>' );
      
      html.appendTo( $( 'body' ) );

      return html;
    }

    /**
     * Update the sharing link in the input
     * 
     * @param   {string}  url   current URL  
     */
    var update = function( url ) {
      el_nav.find( '.share input' )
        .attr( 'value', url );
    }

    return {
      init: function() { init(); },
      update: function( url ) { update( url ); }
    }

  } )();


  /**
   * Logging debug infos to console
   * 
   * @param   {string}  message   log message 
   */
  var debuglog = function( message ) {
    if( ( config['debug'] ) && typeof console != 'undefined' ) {
      console.log( message );
    }
  }

  return {
    init: function() { init(); },
    clipboard: clipboard
  }

} )()

$( document ).ready( function() {
  h0110w.init();
} );