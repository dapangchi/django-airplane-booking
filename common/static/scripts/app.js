(function(){

  var handlePopovers = function(){};
  var basepath = $(document.body).data('basepath');

  var places = [
    "Paris, France, all airports",
    "Paris Hill, United States",
    "Paris, United States",
    "London, UK",
    "Bern, Switzerland"
  ];

  var AscentJet = {
    init: function(){
      this.initUI();
      this.initTabs();
      this.initAccordion();
      if($('div.expander div.map').length > 0) {
        $('div.expander div.map').each(function() {
          AscentJet.initMap($(this), new google.maps.LatLng(51.575363, -0.043945), new google.maps.LatLng(52.547966, -1.889648));
        });
      }
      this.initDetailsButton();
      this.initMobileDetailsButton();
      this.switchGallery();
      this.switchSmallGallery();
      this.switchMobileGallery();
      if($('div.map-holder').length > 0) {
        var coors = [[51.575363, -0.043945], [52.547966, -1.889648], [53.708088, -1.450195], [55.935356, -4.306641]];
        this.initLargeMap($('div.map-holder'), coors);
      }
      this.mobileNavSlide();
      this.showMenu();
      this.switchCheckoutGallery();
      this.showHideOfferDetails();
      this.addPassanger();
      this.expandFlights();
      this.expandTimes();
      this.addNewLeg();
      this.removeLeg();
      this.showHideLogin();
      this.cookieMessage();
      this.tooltipInit();
      this.toggleFlightTimes();
      // this.randomImage();
    },

    initUI: function() {
      $('.datepicker:visible').datepicker();
      $('.autocomplete:visible').autocomplete({
        source: places
      });
      // $('a.popup').webuiPopover({
      //   delay: {
      //       show: 300,
      //       hide: 300
      //   },
      //   closeable: true
      // });

      scroll_func = function(event) {
          var sticky = $('#fixed-top');
          var curPos = $(window).scrollTop();
          if (parseInt(curPos) >= 70) {
              sticky.addClass('fixed');
              $('.ascent-logo').addClass('wide');
          }
          else {
              sticky.removeClass('fixed');
              $('.ascent-logo').removeClass('wide');
          }
      }
      $(window).scroll(scroll_func);
    },

    initTabs: function() {
      $('div.tabs div.navigation a').on('click', function(e) {
        e.preventDefault();
        $(this).closest('div.navigation').find('a').removeClass('active');
        $(this).addClass('active');
        $(this).closest('div.tabs').find('div.tab').removeClass('show');
        $($(this).data('target')).addClass('show');
        AscentJet.initUI();
      });
    },

    initAccordion: function() {
      $('ul.aircrafts li.closed div.title').on('click', function() {
        $('ul.aircrafts li').removeClass('expanded').addClass('closed');
        $('ul.aircrafts li.expanded div.extra').slideUp();
        $(this).addClass('expanded');
        $(this).next().slideToggle();
        $(this).find('.icons').toggle();
      });
    },

    initDetailsButton: function() {
      $('td.actions .btn').on('click', function(e) {
        e.preventDefault();
        $(this).closest('tr').addClass('expanded');
        var $this = $(this);
        $(this).parents('tr').next().find('div.expander').slideDown(function() {
          $this.parents('tr').next().find('div.map').css({ display: 'block' });
          google.maps.event.trigger($this.parents('tr').next().find('div.map').get(0), 'resize');
        });
      })
    },

    initMobileDetailsButton: function() {
      $('div.table div.row .btn').on('click', function(e) {
        e.preventDefault();
        $(this).parents('div.row').addClass('active');
        $(this).parents('div.row').find('div.extra').slideDown();
      })
    },

    initMap: function(container, from, to) {
      var iconBase = '/media/static/images/';

      var image = new google.maps.MarkerImage(iconBase + 'marker.png',
        null,
        // The origin for this image is 0,0.
        new google.maps.Point(0,0),
        // The anchor for this image is the base of the flagpole at 0,32.
        new google.maps.Point(75, 35)
      );

      var image = {
        url: iconBase + 'marker.png',
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12)
      };

      var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(0, -180),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true
      };

      var map = new google.maps.Map($(container).get(0), mapOptions);

      var flightPlanCoordinates = [
        from,
        to
      ];

      var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: false,
        strokeColor: '#323a45',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      flightPath.setMap(map);

      var markers = new Array(from, to);
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(from);
      bounds.extend(to);

      map.fitBounds(bounds);

      var marker = new google.maps.Marker({
        position: from,
        map: map,
        icon: image
      });

    },

    initLargeMap: function(container, coordinates) {
      var iconBase = '/media/static/images/';

      var image = new google.maps.MarkerImage(iconBase + 'marker.png',
        null,
        new google.maps.Point(0,0),
        new google.maps.Point(75, 35)
      );

      var image = {
        url: iconBase + 'marker.png',
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12)
      };

      var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(0, -180),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        scrollwheel: false,
      };

      var map = new google.maps.Map($(container).get(0), mapOptions);

      var coors = [];
      $.each(coordinates, function(i, v) {
        position = new google.maps.LatLng(v[0], v[1]);
        coors.push(position);
      });

      var bounds = new google.maps.LatLngBounds();
      $.each(coors, function(i, v) {
        bounds.extend(v);
        var contentString = '' +
          '<div class="popover-maps">' +
          '  <h3>Paris, France (PAR)</h3>' +
          '  <div class="icons">' +
          '    <span class="icon icon-tiny-jet active"></span>' +
          '    <span class="icon icon-small-jet active"></span>' +
          '    <span class="icon icon-regular-jet"></span>' +
          '    <span class="icon icon-medium-jet"></span>' +
          '    <span class="icon icon-large-jet"></span>' +
          '  </div>' +
          '  <p>14 km from Rua Da Piscina, Castelo Branco</p>' +
          '  <a href="#" class="btn add-start">Add as starting point</a>' +
          '  <a href="#" class="btn add-end">Add as destination</a>' +
          '</div>';

        var myOptions = {
      		 content: contentString
           ,disableAutoPan: true
           ,maxWidth: 0
           ,pixelOffset: new google.maps.Size(-100, -240)
           ,zIndex: null
           ,closeBoxURL: ''
           ,infoBoxClearance: new google.maps.Size(1, 1)
           ,isHidden: false
           ,pane: "floatPane"
           ,enableEventPropagation: false
      	};

        var marker = new google.maps.Marker({
          position: v,
          map: map,
          icon: image
        });

        var ib = new InfoBox(myOptions);

        google.maps.event.addListener(marker, 'click', function() {
           ib.close();
	         ib.open(map, marker);
        });

        google.maps.event.addListener(map, 'click', function() {
          ib.close();
        });
      });

      map.fitBounds(bounds);
    },

    showMenu: function() {
      $('html').click(function() {
        $('body').removeClass('expanded');
      });
      $('a.menu-trigger').on('click touchstart', function(e) {
        e.stopPropagation();
        $('body').toggleClass('expanded');
      });
      $('.mobile-nav').click(function(event){
        event.stopPropagation();
      });
    },

    switchGallery: function() {
      $('tr.details div.switch a').on('click', function(e) {
        e.preventDefault();
        $(this).parents('td').find('div.switch a').removeClass('active');
        $(this).parents('td').find('div.images div.gallery').removeClass('show');
        $(this).parents('td').find($(this).data('target')).addClass('show');
        $(this).addClass('active');
      });
    },

    switchSmallGallery: function() {
      $('div.column.galleries ul li a').on('click', function(e) {
        e.preventDefault();
        $(this).parents('div.galleries').find('ul a').removeClass('active');
        $(this).parents('div.galleries').find('div.images div.gallery').removeClass('show');
        $(this).parents('div.galleries').find($(this).data('target')).addClass('show');
        $(this).addClass('active');
      });
    },

    switchMobileGallery: function() {
      $('div.table div.switch a').on('click', function(e) {
        e.preventDefault();
        $(this).parents('div.row').find('div.switch a').removeClass('active');
        $(this).parents('div.row').find('div.galleries div.gallery').removeClass('show');
        $(this).parents('div.row').find($(this).data('target')).addClass('show');
        $(this).addClass('active');
      });
    },

    mobileNavSlide: function() {
      $('nav.mobile-nav span.action').on('click', function() {
        $(this).parent().toggleClass('expanded');
        $(this).parent().find('ul').first().slideToggle();
      })
    },

    switchCheckoutGallery: function() {
      $('div.offer div.switch a').on('click', function(e) {
        e.preventDefault();
        $(this).parents('div.offer').find('div.switch a').removeClass('active');
        $(this).parents('div.offer').find('div.images div.gallery').removeClass('show');
        $(this).parents('div.offer').find($(this).data('target')).addClass('show');
        $(this).addClass('active');
      });
    },

    showHideOfferDetails: function() {
      $('div.offer div.header a.switch').on('click', function(e) {
        $('.slick').resize();
        e.preventDefault();
        $(this).parent().find('a').toggleClass('show');
        $(this).parents('div.offer').find('div.additional, dl.extra').slideToggle();
      });
    },

    addPassanger: function() {
      $('a.add-passanger').on('click', function(e) {
        e.preventDefault();
        var tmpl = $('div.passanger-template').html();
        var count = $('form div.passanger.single').length;
        tmpl = tmpl.replace('xyz', count + 1);
        $(tmpl).removeClass('template');
        $('form div.passanger.single:last').after(tmpl);
        AscentJet.initUI();
      });
    },

    expandFlights: function() {
      if($('body').width() < breakpoint) {
        $('div.sidebar div.part h3').on('click', function(e) {
          e.preventDefault();
          $(this).parent().find('ul').slideToggle();
        });
      }
    },

    expandTimes: function() {
      $('a.expand-times').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('open');
        $(this).next().slideToggle();
      });
    },

    addNewLeg: function() {
      $('a.add-return-leg').on('click', function(e) {
        e.preventDefault();
        var template = $('div.leg-template').html();
        var count = $('#charter-quote-form div.row.data').length;
        time = new Date().getTime();
        template = template.replace(/xyz/g, time).replace('leg-no', count + 1);
        $('#charter-quote-form div.row.data:last').after(template);
        AscentJet.initUI();
      });
    },

    removeLeg: function() {
      $(document).on('click', 'a.remove-leg', function(e) {
        e.preventDefault();
        $(this).closest('div.row').remove();
        AscentJet.recountLegs();
      });
    },

    recountLegs: function() {
      var count = $('#charter-quote-form div.row.data');
      $('#charter-quote-form div.row.data').each(function(index) {
        i = index + 1;
        $(this).find('.custom').html('Leg ' + i);
      })
    },

    showHideLogin: function() {
      $('html').click(function() {
        $('div.toolbar a.login').removeClass('active');
        $('div.toolbar a.login').closest('li').next().slideUp();
      });
      $('div.toolbar a.login').on('click', function(e) {
        e.stopPropagation();
        $(this).toggleClass('active');
        $(this).closest('li').next().slideToggle();
      })
      $('.login-form').click(function(event){
        event.stopPropagation();
      });
    },

    cookieMessage: function() {
      $('.cookie .btn').on('click', function() {
        Cookies.set('cookieMessage', true);
        $('#cookie').slideUp();
      });
      if (Cookies.get('cookieMessage') != 'true') {
        setTimeout(function() {
          $('#cookie').slideDown();
        }, 1000);
      }
    },

    tooltipInit: function() {
      $('a.webui-tooltip').webuiPopover({
        width:        '330',
        arrow:        false,
        animation:    'pop',
        content:      $('#tooltip-offer').html(),
        style:        'offer'
      });

      $('#empty-leg-date.webui-tooltip').webuiPopover({
        width:        '330',
        arrow:        false,
        animation:    'pop',
        content:      $('#tooltip-emptyLegStart').html(),
        style:        'emptyLegStart'
      });

      $('a.popover').webuiPopover({
        content:      $('#popover-content').html(),
        placement:    'top',
        animation:    'pop',
        style:        'notice'
      });

      $('body').on('click', '.tooltip-close, .popover-close', function(e){
        e.preventDefault();
        $('body').trigger('click');
      });
    },

    randomImage: function() {
      var backgroundImage = [
        'url(' + basepath + 'images/home.jpg)',
        'url(' + basepath + 'images/guy.jpg)',
      ];
      var size = backgroundImage.length
      var x = Math.floor(size*Math.random())
      $('section.index').css('background-image', backgroundImage[x]);
    },

    toggleFlightTimes: function() {
      $('body').on('click', 'ul.checkboxes .extra', function(){
        $(this).parent().find('.flight-times').slideToggle();
        $(this).toggleClass('open');
      });
    },
  };

  window.AscentJet = AscentJet;
  var sf, body;
  var breakpoint = 960;
  body = $('body');
  sf = $('ul.st-menu');
  if(body.width() >= breakpoint) {
    sf.superfish();
  }

  $(window).resize(function() {
    if(body.width() >= breakpoint && !sf.hasClass('sf-js-enabled')) {
      sf.superfish('init');
    } else if(body.width() < breakpoint) {
      sf.superfish('destroy');
    }
  });

  $(".payment-button").click(function () {
    if($(this).parent().parent().find('input.agree').is(':checked')) {
      Datatrans.startPayment({'form': $(this).data('form')});
      $(this).parent().parent().find('label').removeClass('error');
    } else {
      $(this).parent().parent().find('label').addClass('error');
    }
  });

  // registration form validation
  jQuery.validator.addMethod("email_pattern", function(value, element) {
    return this.optional(element) ||  /^[-_a-z0-9]+(\.[-_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(value);
  }, "Please enter a valid email address.");

})();

AscentJet.init();

$(function() {
    if(navigator.userAgent.indexOf('Firefox') != -1) {
        $('body').addClass('firefox');
    }
})

function GetIEVersion() {
  var sAgent = window.navigator.userAgent;

  var Idx = sAgent.indexOf("MSIE");

  if (Idx > 0) {
      return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
  }else if (!!navigator.userAgent.match(/Trident\/7\./)) {
      return 11;
  } else if( navigator.userAgent.indexOf('Edge/') > 0 ){
    return 12;
  }
  else
    return 0;
}

if (GetIEVersion() > 0) {
    $('body').addClass('ie');
    fIE = true;
}

var slideIdx = 1;
var sliderId;
if(location.pathname == '/') {
    var sliderHeading = ['<h2>Pricing direct from operators</h2><p class="lead">We offer total transparency</p>',
                         '<h2>Select an offer and buy online</h2><p class="lead">There\'s never been an easier way to book a taylor-made flight</p>',
                         /*'<h2>A unique booking system</h2><p class="lead">We connect you directly to the operators. Ascent Jet\'s unique booking system enables you to solicit offers directly from qualified operators.  We use advanced technologies to match the aircraft to your requirements at the best prices.</p>',*/
                         '<h2>A vast choice of private aircraft</h2><p class="lead">We select the aircraft best suited to your itineray and requirements</p>'
                        ];

    function slideMove(movSlide) {
        clearInterval(sliderId);
        /*$('.home.index').fadeTo(600, 0.7, function() {
            $('.home.index').css('background-image', 'url(' + sliderImg[movSlide] + ')').fadeIn(3000)
            $('.slider-heading').html(sliderHeading[movSlide]);
        }).delay(1).fadeTo(400, 1, function(){
            $('.home.index').css('background-image', 'url(' + sliderImg[movSlide] + ')')
            $('.home.index').fadeIn(500);
            $('.slider-heading').html(sliderHeading[movSlide]);
        });*/

        /*$('.home.index').animate({
            duration: 300,
            easing: 'linear',
            complete: function() {
                var dd = 0;
            },
            done: function() {
                $('.home.index').css('background-image', 'url(' + sliderImg[movSlide] + ')');
                $('.home.index').fadeIn(1000);
            }
        });*/

        $('.home.index').animate({
            opacity: 0.7
        }, 300, "linear", function() {
            //$('.home.index').css('background-image', 'url(' + sliderImg[movSlide] + ')');
            $('.home.index').animate({
                opacity: 0.8
            }, 300, "linear", function() {
                $('.home.index').css('background-image', 'url(' + sliderImg[movSlide] + ')');
                $('.home.index').animate({
                    opacity: 1
                }, 600, "linear", function () {
                })
            });
        });

        $('.slider-heading').html(sliderHeading[movSlide]);
        sliderId = setInterval(function(){ slideShow(); }, 8000)
    }
    $('.slider-prev').on('click', function(){
        if(slideIdx == 0)
            slideIdx = 2;
        else
            slideIdx -= 1;
        slideMove(slideIdx);
    })
    $('.slider-next').on('click', function(){
        if(slideIdx == 2)
            slideIdx = 0;
        else
            slideIdx += 1;
        slideMove(slideIdx);
    })
    function slideShow() {
        /*$('.home.index').css('background-image', 'url(' + sliderImg[slideIdx] + ')').show(0, function(){

        })*/
        /*$('.home.index').css('background-image', 'url(' + sliderImg[slideIdx] + ')')
        $('.slider-heading').html(sliderHeading[slideIdx]).fadeIn(1000);*/

        /*$('.home.index').animate({
            opacity: 0.7
        }, 500, "linear", function() {
            $('.home.index').css('background-image', 'url(' + sliderImg[slideIdx] + ')').animate({
                opacity: 1
            }, 1200, "linear", function(){
                $('.slider-heading').html(sliderHeading[slideIdx]).fadeIn(1000);
            })
        });*/

        $('.home.index').animate({
            opacity: 0.7
        }, 300, "linear", function() {
            //$('.home.index').css('background-image', 'url(' + sliderImg[movSlide] + ')');
            $('.home.index').animate({
                opacity: 0.8
            }, 500, "linear", function() {
                $('.slider-heading').html(sliderHeading[slideIdx]).fadeIn(500);
                $('.home.index').css('background-image', 'url(' + sliderImg[slideIdx] + ')');
                $('.home.index').animate({
                    opacity: 1
                }, 700, "linear", function () {

                })
            });
        });

        if(slideIdx >= 2)
            slideIdx = 0;
        else
            slideIdx += 1;
    }
    sliderId = setInterval(function(){
        slideShow();
    }, 8000)

}
if(location.pathname == "/why-ascent-jet/the-ascent-jet-difference/") {
    $('.content-remove').find('p')[2].remove();
    $('.content-remove').find('p')[2].remove();
}
if(location.pathname == '/flying-privately/a-guide-to-flying-privately/') {
    $.preLoadImages = function() {
    $.get($('link[rel="stylesheet"]')[0].href, function(data){
        r = /url\(['|"]?(\S+\.(jpg)[^'(]*)['|"]?\)/ig;
        while (match = r.exec(data)){
                var cacheImage = document.createElement('img');
                cacheImage.src = match[1];
            }
        });
    }
    $.preLoadImages()
}