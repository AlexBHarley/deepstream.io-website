/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {

        var $postContent = $(".post-content");
        $postContent.fitVids();

        $(".scroll-down").arctic_scroll();

        $(".menu-button, .nav-cover, .nav-close").on("click", function(e){
            e.preventDefault();
            $("body").toggleClass("nav-opened nav-closed");
        });

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };

    searchAutocomplete();

})(jQuery);

// for docs pages
function searchAutocomplete() {
    $.get('/searchIndex.json').success(function(data) {
        window.lunr_search_idx = data;
        var idx = lunr.Index.load(data);
        window.lunr_idx = idx;

        $(".main-search").autocomplete({
            appendTo: '.main-serach-results',
            source: function(request, response) {
                var results = idx.search(request.term).filter(function(item) {
                    if (item.ref.indexOf('index.md') !== -1) {
                        return false;
                    }
                    return true;
                })
                return response(results);
            },
            minLength: 3,
            focus: function( event, ui ) {
                return false;
            },
            select: function( event, ui ) {
                window.location = '/' + ui.item.slug;
                return false;
            }
        }).autocomplete( "instance" )._renderItem = function( ul, item ) {
            var link = item.ref.split('__')[0].split('/');
            link.pop();
            link = link.join('/') + '/';
            var title = item.ref.split('__')[1];
          return $( "<li>" )
            .append( "<a href='/" + link + "'><br>" + title + "</a>")
            .appendTo( ul );
        };
        $("input.main-search").on('focus', function() {
            $("ul.ui-autocomplete").show()
        })
    })
}

$(function(){
    if ( $( '.docs .col' ).length === 0 ) {
        return;
    }

    var history = window.History.createHistory();
    var adjustSize = function() {
        var windowWidth = $(window).width();
        if( windowWidth > 999 ) {
            $( '.docs' ).addClass( 'two-col' );
            $( '.docs .col.left.small' ).toggle( true );
            $( '.docs .col.big.right' ).width( windowWidth -  ( $('.docs .col.left').width() + 2 ) );
        } else {
            $( '.docs' ).removeClass( 'two-col' );
            $( '.docs .col.left.small' ).toggle( false );
            $( '.docs .col.big.right' ).width( windowWidth );
        }
        // $( '.docs .col' ).height( $(window).height() - $( 'nav' ).height() );
    };

    adjustSize();
    $(window).resize( adjustSize );

    $( '.sub-section-toggle' ).click(function(){
        $(this).parent().toggleClass( 'open' );
    });

    $( '.tree-nav .entry a' ).click(function( e ){
        e.preventDefault();
        var pathname = $(this).attr( 'href' );
        history.push( {
            pathname: pathname.replace( /\/[^/]*\.html/, '/' ),
            state: {
                realPathname: pathname
            }
        } );
    });

    var unlisten = history.listen(location => {
        var pathname = (location.state || {}).realPathname
        if (pathname == null) {
            // the first page visit didn't set the state
            // so recover the ajax page from its basename
            var splitted = location.pathname.split('/')
            if (splitted[splitted.length - 1] === '') {
                pathname = splitted[splitted.length - 2]
            } else {
                pathname = splitted[splitted.length - 1]
            }
            pathname = location.pathname + pathname + '.html'
        }
        changeEntryPage( {
            pathname: pathname
        } );
    })

    function changeEntryPage( location ) {
        var pathname = location.pathname;
        var link = $( '[href="' + pathname + '"]' )
        $( '.entry .active' ).removeClass( 'active' );

        link.parent().addClass( 'active' );

        $( '.col.right .header h1' ).text( link.text() );
        $.get( pathname, function( result ){

            //TODO Error handling
            $( '.breadcrumbs span:last-child' ).text( link.text() );
            $( '.col.big.right .content' ).html( result );

            $('.content pre code').each(function(i, block) {
                Prism.highlightElement( block );
            });
        });
    };
});
