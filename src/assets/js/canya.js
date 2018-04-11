'use strict';


//----------------------------------------------------/
// CanYa
//----------------------------------------------------/
//
+function($, window){

  var canya = {
    name:       'CanYa',
    version:    '1.0.0',
  };

  canya.defaults = {
    googleApiKey: null,
    googleAnalyticsId: null,
    smoothScroll: true,
  }

  // Breakpoint values
  //
  canya.breakpoint = {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200
  };


  // Config application
  //
  canya.config = function(options) {
    //$.extend(true, canya.defaults, options);

    // Rteurn config value
    if ( typeof options === 'string' ) {
      return canya.defaults[options];
    }


    // Save configs
    $.extend(true, canya.defaults, options);


    // Make necessary changes
    //
    if ( !canya.defaults.smoothScroll ) {
      SmoothScroll.destroy();
    }



    // Google map
    //
    if ( $('[data-provide~="map"]').length && window["google.maps.Map"] === undefined ) {
      $.getScript("https://maps.googleapis.com/maps/api/js?key="+ canya.defaults.googleApiKey +"&callback=canya.map");
    }


    // Google Analytics
    //
    if ( canya.defaults.googleAnalyticsId ) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', canya.defaults.googleAnalyticsId, 'auto');
      ga('send', 'pageview');
    }

  }



  // Initialize the application
  //
  canya.init = function() {


    canya.topbar();


    // FadeOUt header
    $(window).on('scroll', function() {
      var st = $(this).scrollTop()-200;
      $('.header.fadeout').css('opacity', (1-st/ window.innerHeight ) );
    });



    // Drawer
    //
    $(document).on( 'click', '.drawer-toggler, .drawer-close, .drawer-backdrop', function() {
      $('body').toggleClass( 'drawer-open' );
    } );


  };


  //----------------------------------------------------/
  // Topbar functionality
  //----------------------------------------------------/
  canya.topbar = function() {

    var body = $('body');
    $(window).on('scroll', function() {
      if ($(document).scrollTop() > 10) {
        body.addClass('body-scrolled');
      }
      else {
        body.removeClass('body-scrolled');
      }
    });


    // Open menu on click
    //
    $(document).on('click', '.nav-toggle-click .nav-link', function(e) {
      var link = $(this),
          item = link.closest('.nav-item'),
          siblings = item.siblings('.nav-item');

      if ( '#' == link.attr('href') ) {
        e.preventDefault();
      }

      siblings.removeClass('show');
      siblings.find('.nav-item.show').removeClass('show');
      item.toggleClass('show');
    });


    // Topbar toggler
    //
    $(document).on('click', '.topbar-toggler', function(){
      //body.toggleClass('topbar-reveal').prepend('<div class="topbar-backdrop"></div>');
      body.toggleClass('topbar-reveal');
      $(this).closest('.topbar').prepend('<div class="topbar-backdrop"></div>');
    });

    $(document).on('click', '.topbar-backdrop', function(){
      body.toggleClass('topbar-reveal');
      $(this).remove();
    });


    // Dropdown for small screens
    //
    $(document).on('click', '.topbar-reveal .topbar-nav .nav-item > .nav-link', function(){
      var item = $(this),
          submenu = item.next('.nav-submenu'),
          parent = item.closest('.nav-submenu');
      item.closest('.topbar-nav').find('.nav-submenu').not( submenu ).not( parent ).slideUp();
      submenu.slideToggle();
    });

    // Close nav if a scrollto link clicked
    //
    $(document).on('click', '.topbar-reveal .topbar-nav .nav-link', function(){
      if ( $(this).hasDataAttr('scrollto') ) {
        body.removeClass('topbar-reveal');
        $('.topbar-backdrop').remove();
      }
    });

  }

  window.canya = canya;
}(jQuery, window);

$(function() {
  canya.init();
});

// Check if an element has a specific data attribute
//
jQuery.fn.hasDataAttr = function(name) {
  return $(this)[0].hasAttribute('data-'+ name);
};



// Get data attribute. If element doesn't have the attribute, return default value
//
jQuery.fn.dataAttr = function(name, def) {
  return $(this)[0].getAttribute('data-'+ name) || def;
};



// Instance search
//
//$.expr[':'] -> $.expr.pseudos
jQuery.expr[':'].search = function(a, i, m) {
  return $(a).html().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
