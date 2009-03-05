/*
 * jModal - Slidey modal thing in jQuery
 *
 * Copyright Ryan Funduk (ryan.funduk@gmail.com) 2009
 * All rights reserved.
 *
 * Released under the MIT license
 *
 * VERSION: 0.1
 */
 
( function( $ ) {
  $.fn.jModal = function( content_location, opts ) {
    var wrapper = this;
    var utils =   $.fn.jModal.utils;
    var options = $.extend( utils.options, opts );
    var content = "";
    utils.init();
    
    switch( typeof( content_location ) ) {
      case 'string':
        content = content_location;
        break;
      case 'object':
        content = content_location.html();
        break;
      case 'function':
        content = content_location();
        break;
    }
    
    return wrapper.each( function() {
      $(this).click( function() {
        utils.content.set( content );
        utils.overlay.in();
        utils.modal.show();
      } );
    } );
  };

  $.fn.jModal.utils = {
    debug: true,
    active: false,
    log: function( msg ) { if( this.debug ) { console.log( msg ); } },
    initialized: false,
    neededElements: [ 'modal', 'frame', 'header', 'caption',
                      'loading', 'content', 'overlay' ],
    elements: {},
    init: function() {
      var utils = this;
      
      utils.log( 'initing...' );
      if( utils.initialized ) {
        utils.log( 'already inited!' );
        return;
      }
      
      // create elements
      $.each( utils.neededElements, function( id, element ) {
        var default_id = utils.options.ids[element];
        var eid = typeof( default_id ) == 'undefined' ?
                    "jModal_" + element :
                    default_id;
        utils.log( ' creating "' + element + '" with an id of "' + eid + '"' );
        utils.elements[element] = $('<div id="' + eid + '"/>');
      } );
      
      var es = utils.elements;
      
      // create close element seperately, it's an anchor, not a div
      var close_id = typeof( utils.options.ids.close ) == 'undefined' ?
                       "jModal_close" :
                       utils.options.ids.close;
      es.close = $('<a href="#" id="' + close_id + '">' + utils.options.closeValue + '</a>');
      es.close.click( utils.modal.close );
      
      // set some styles and such up
      es.overlay.css( { display: 'none', opacity: 0, zIndex: 9995 } );
      es.modal.css( { display: 'none', zIndex: 9996 } );
            
      // insert them into the dom
      if( utils.options.showHeader ) {
        es.caption.html( utils.options.title );
        es.header
          .append( es.close )
          .append( es.caption );
        es.frame.append( es.header );
      }
      
      es.loading.append( utils.options.loadingString );
      es.content.append( es.loading );
      es.frame.append( es.content );
      
      es.modal.append( utils.elements.frame );
      
      $('body')
        .append( utils.elements.overlay )
        .append( utils.elements.modal );
      
      // bind some listeners on the elements
      if( utils.options.overlayClose ) { utils.elements.overlay.click( utils.overlay.out ); }
      $(window).bind( 'resize', function() {
        utils.modal.autoPosition();
      } );
      
      utils.initialized = true;
      utils.log( 'inited!' );
    },
    content: {
      set: function( content ) {
        var utils = $.fn.jModal.utils;
        utils.elements.content.html( content );
      },
      load: function( url ) {
        
      }
    },
    modal: {
      show: function() {
        var utils = $.fn.jModal.utils;
        utils.active = true;
        utils.elements.modal.slideDown( utils.options.modalShowDuration );
        utils.modal.autoPosition();
      },
      close: function() {
        $.fn.jModal.utils.overlay.out();
      },
      hide: function( after ) {
        var utils = $.fn.jModal.utils;
        if( !utils.active ) { return; }
        utils.elements.modal.slideUp( utils.options.modalHideDuration,
                                      after );
      },
      autoPosition: function() {
        var utils = $.fn.jModal.utils;
        if( !utils.active ) { return; }
        var top = ( document.documentElement && document.documentElement.scrollTop ) ?
                     document.documentElement.scrollTop :
                     document.body.scrollTop;
        var left = ( utils.elements.overlay.width() - utils.elements.modal.width() ) / 2;
        
        utils.elements.modal.css( { top:  top + 'px',
                                    left: left + 'px' } );
      }
    },
    overlay: {
      in: function() {
        var utils = $.fn.jModal.utils;
        utils.log( '** showing overlay' );
        utils.elements.overlay.show().animate( {
          opacity: utils.options.overlayOpacity,
        }, utils.options.overlayFadeDuration );
      },
      out: function() {
        var utils = $.fn.jModal.utils;
        utils.log( '** hiding overlay' );
        utils.modal.hide( function() {
          utils.elements.overlay.animate(
            { opacity: 0.0 },
            utils.options.overlayFadeDuration,
            function() { utils.elements.overlay.hide(); }
          );
        } );
      }
    },
    options: {
      title:               'jModal Window',
      showHeader:          true,
      overlayClose:        true,
      width:               500,
      height:              100,
      overlayOpacity:      0.65,
      overlayFadeDuration: 250,
      modalShowDuration:   500,
      modalHideDuration:   250,
      modalResizeDuration: 250,
      animate:             true,
      loadingString:       'Please wait. Loading...',
      closeTitle:          'Close window',
      closeValue:          "&times;",
      autoFocusForms:      true,
      ids:                 {}
    }
  };
} )( jQuery );
