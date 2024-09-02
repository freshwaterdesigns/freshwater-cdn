/*#########################################################################################
#                                                                                         #
#    Freshwater v2.0 GLOBAL JS FILE                                                       #
#    ------------------------------                                                       #
#    Used for site-wide JS functionality.                                                 #
#                                                                                         #
#########################################################################################*/


/*#########################################################################################
#    Constants & Global Variables                                                         #
#########################################################################################*/

const   $freshDocument = $0(document),
        $freshWindow = $0(window),
        freshMaxWsm = 767;

var     onLoad = '',
        onResize = '',
        lazyLoadInstance = new LazyLoad({ });


/*#######################################################################################
#    Fresh Global Functions                                                             #
#########################################################################################*/

/******************************************************************************************
 * Title: Debounce Execution Control
 *
 * Description:
 * Debounce Function (https://davidwalsh.name/javascript-debounce-function)
 * Delays the execution of a function to limit its rate of operation, ideal for events like scrolling.
 * This helps in reducing the frequency of function calls to improve performance.
 *
 * Parameters:
 * @param {Function} func - Function to debounce.
 * @param {Number} wait - Milliseconds to delay before invoking the function.
 * @param {Boolean} immediate - If true, triggers the function on the leading edge instead of the trailing.
 *
 * @author Alexander Khost
 *******************************************************************************************/ 
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


/********************************************************************************************
 * Title: ADA Compliance Fix for Slick Carousels
 *
 * Description:
 * Fixes ADA compliance for Slick carousels without dots. 
 * Ensures that proper ARIA attributes are set for enhanced accessibility in carousels.
 * This function dynamically adjusts ARIA attributes to meet accessibility standards.
 *
 * Reference: 
 * https://www.beacontechnologies.com/blog/2017/11/how-to-remove-aria-described-by-if-dots-are-disabled-in-slick-slider.aspx
 *
 * Parameters:
 * @param {string|object} slickCarousel - The Slick carousel element (or selector) to be modified.
 * 
 * @author Alexander Khost
 ********************************************************************************************/
function freshCheckSlickAriaAttributes( slickCarousel ) {
    $0( slickCarousel ).find('li').each(function () {
        let $slide = $0(this);
        if ($slide.attr('aria-describedby') != undefined) {
            $slide.attr('id', $slide.attr('aria-describedby'));
        }
    });
}


/********************************************************************************************
 * Title: Open External Links in New Window
 *
 * Description:
 * Opens all external links within 'body' in a new window.
 * This function enhances the user experience by allowing users to stay on the current page 
 * while enabling them to view the content of external links in a new window.
 * 
 * Reference: https://css-tricks.com/snippets/jquery/open-external-links-in-new-window/
 * 
 * * @param {string} filter - an optional list of paths to targetted external links, defaults to filter out reviews links
 *
 * @author Alexander Khost
 ********************************************************************************************/
function freshOpenExternalLinksInNewWindow(filter) {
    if(!filter) {
        filter = 'a:not(.jdgm-paginate__page,.jdgm-star,.jdgm-paginate__load-more)';
    }
    $0('body').find(filter).each(function() {
          var a = new RegExp('/' + window.location.host + '/');
          if(!a.test(this.href)) {
              $0(this).click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                window.open(this.href, '_blank');
              });
          }
    });
}


/********************************************************************************************
 * Title: Smooth Scrolling for Anchor Links
 *
 * Description:
 * Implements smooth scrolling for internal anchor links.
 * This function enhances the user experience by creating a seamless and visually pleasing 
 * navigation experience when users click on internal anchor links within the page.
 *
 * @author Alexander Khost
 ********************************************************************************************/
function smoothScrollToInlineAnchors() {
  $freshDocument.on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
    event.stopPropagation();
    $0('html, body').animate({
        scrollTop: $0($0.attr(this, 'href')).offset().top
    }, 500);
  });
}

/********************************************************************************************
* Title: Animation Reinitialization on Page Reload
*
* Description:
* This function ensures that certain animations are properly triggered even after a user reloads the page.
* Adapted for the Dawn theme --Alex 20230808
*
* @author Alexander Khost 
/********************************************************************************************/
function initializeAnimationOnReload() {
  setTimeout(() => {
    if (typeof initializeScrollAnimationTrigger === "function") {
        initializeScrollAnimationTrigger();
    }
  }, 350);
}


/********************************************************************************************
 * Title: Accordion Behavior Handler
 *
 * Description:
 * This function toggles the visibility of accordion content and ensures only one item is open at a time.
 * - Toggles 'active' class on clicked accordion headers.
 * - Adjusts the maximum height of the accordion content to show/hide it.
 * - Swaps icons in the accordion header to indicate its state (open/close).
 * - Closes any other open accordion items to maintain only one active item.
 * Note: Customized for specific icons (icon1 and icon2) within the accordion headers.
 * 
 * @author Ahmed Ezzaouia
/********************************************************************************************/
function fresh_toggleAccordion() {
  $0('.accordion_item .accordion-header').click(function () {
      var button = $0(this);
      var accordionContent = button.next('.accordion-content');
      button.toggleClass('active');
      if (button.hasClass('active')) {
        accordionContent.css('maxHeight', accordionContent.prop('scrollHeight') + 'px');
        button.find('.icon1').hide();
        button.find('.icon2').show(); 
      } else {
        accordionContent.css('maxHeight', 0);
        button.find('.icon1').show();
        button.find('.icon2').hide(); 
      }
      // Close other open accordion items
      $0('.accordion_item .accordion-header')
        .not(button)
        .each(function () {
          $0(this).removeClass('active');
          $0(this).next('.accordion-content').css('maxHeight', 0);
          $0(this).find('.icon1').show();
          $0(this).find('.icon2').hide(); 
        });
  });
}


/*********************************************************************************************
 * Title: Hero Section Box Positioning
 *
 * Description:
 * Adjusts positioning of content boxes in hero sections.
 * - Finds each '.fresh-hero__box' within a '.fresh-hero' section.
 * - Calculates and sets the position of these boxes differently for small and large screens.
 *   - Uses 'heroboxxmd', 'heroboxymd' for large screens (width > 767px).
 *   - Uses 'heroboxxsm', 'heroboxysm' for small screens.
 * - Displays the box if it has text, hides it otherwise.
 * - Updated to support hero carousels with multiple hero slides --Alex, 20240411
 *
 * @author Ahmed Ezzaouia
 ********************************************************************************************/
function fresh_heroBoxPositioning(fresh_hero, fresh_box) {
    if($0(window).width() > 767){
        var leftPosition = ((fresh_hero.outerWidth() - fresh_box.outerWidth()) * fresh_hero.data('heroboxxmd')) / 100;
        var topPosition = ((fresh_hero.outerHeight() - fresh_box.outerHeight()) * fresh_hero.data('heroboxymd')) / 100;
      } else {
        var leftPosition = ((fresh_hero.outerWidth() - fresh_box.outerWidth()) * fresh_hero.data('heroboxxsm')) / 100;
        var topPosition = ((fresh_hero.outerHeight() - fresh_box.outerHeight()) * fresh_hero.data('heroboxysm')) / 100;
      }
     fresh_box.css('top', `${topPosition}px`);
     fresh_box.css('left', `${leftPosition}px`);
     fresh_box.css('display', 'block');
     if (!fresh_box.text().trim()) {
       fresh_box.css('display', 'none');
     }
}

var freshSetXY = () => {
   $0('.fresh-hero-container').each(function() {
     var fresh_carousel = $0(this).find('.fresh-slides');
    //if carousel, wait until slick has initialized, otherwise, just set the position
    if(fresh_carousel.length > 0) {
        fresh_carousel.on("init", function (event, slick) {
            //for each hero slide
            $0('.fresh_carousel__slide').each(function() {
                var fresh_hero = $0(this).find('.fresh-hero');
                var fresh_box = fresh_hero.find('.fresh-hero__box');
                fresh_heroBoxPositioning(fresh_hero, fresh_box);
            });
        });
     } else {
        var fresh_hero = $0(this).find('.fresh-hero');
        var fresh_box = fresh_hero.find('.fresh-hero__box');
        fresh_heroBoxPositioning(fresh_hero, fresh_box);
     }
   });
 };


/********************************************************************************************
 * Title: Slick Slider Initialization
 *
 * Description:
 * Initializes Slick sliders for all sections.
 * This function targets all elements with the specified slick slider class,
 * reads their data attributes for settings, and initializes the Slick slider
 * with those settings if they haven't already been initialized.
 *
 * @param {string} fresh_slick_class - The class selector for Slick elements.
 * 
 * @author Ahmed Ezzaouia
 ********************************************************************************************/ 
function fresh_slickInit(fresh_slick_class) {
  var fresh_slickElements = $0(fresh_slick_class);
  fresh_slickElements.each(function () {
    var fresh_slickElement = $0(this);
    if (fresh_slickElement.hasClass('fresh-is-animated')) return true;

    let slidesToShowMd = Number(fresh_slickElement.attr('data-slidesToShowMd'));
    let slidesToShowSm = Number(fresh_slickElement.attr('data-slidesToShowSm'));
    //as long as slides to show has not been turned off (0), set Slick
    if(
        (window.innerWidth >= 768 && slidesToShowMd != 0) ||
        (window.innerWidth < 768 && slidesToShowSm != 0)
    ) {
        var slickData = fresh_slickElement.attr('data-slick')
        if (!slickData) return false; 
        var fresh_slickSettings = JSON.parse(slickData.replace(/&quot;/g, '"'));
        if (!fresh_slickElement.hasClass('slick-initialized')) {
            fresh_slickElement.slick(fresh_slickSettings);
        }
    }
  });
}


/********************************************************************************************
 * Title: Video Load for Responsive Design
 *
 * Description:
 * Ensures that mobile or desktop videos are loaded appropriately when 
 * the window is resized or a Shopify section is reloaded.
 * Targets '.fresh_video_desktop' for screens ≥ 768px and 
 * '.fresh_video_mobile' for screens < 768px.
 *
 * @author Ahmed Ezzaouia
 ********************************************************************************************/
const fresh_handleVideoLoad = () => {
  const fresh_videoDesktop = $0('.fresh_video_desktop');
  const fresh_videoMobile = $0('.fresh_video_mobile');
  if ($0(window).width() < 768) {
    fresh_videoMobile.each(function() {this.load()});
  } else {
    fresh_videoDesktop.each(function() {this.load()});
  }
};


/********************************************************************************************
 * Title: Infinite Scroll with Responsive Cloning
 *
 * Description:
 * Implements infinite scroll by dynamically cloning and appending elements within designated
 * containers. Enhances visual continuity for a seamless user experience. Responsive design 
 * ensures compatibility with various screen sizes.
 *
 * Usage:
 * To enable infinite scroll on an element, add the class (fresh_infinit-scoller) to the parent of the list.
 * 
 * Example usage in a Shopify section:
 * 
 * <div class="fresh_infinit-scoller" >
 *    <ul data-animation-speedMd="{{ section.settings.fresh_scroll_speed--md }}"
 *        data-animation-speedSm="{{ section.settings.fresh_scroll_speed--sm }}"
 *    </ul>
 * </div>
 *
 * @Author Ahmed Ezzaouia
 ********************************************************************************************/
function fresh_infinite_scroll(e){
  console.log("🚀 ~ fresh_infinite_scroll fn: Event type: ", e.type)
  const scrollers = document.querySelectorAll(".fresh_infinit-scoller");
  scrollers.forEach(scroller=>{
    const list = scroller.querySelector('ul');

    //if the slides to scroll is set to 0 (for desktop and/or mobile), set the slide width to equal the size the image has been set to / remove white space around slide images
    let slidesToShowMd = Number(list.getAttribute('data-slidesToShowMd'));
    let slidesToShowSm = Number(list.getAttribute('data-slidesToShowSm'));
    let slidesMaxWidthMd = Number(list.getAttribute('data-slidesMaxWidthMd'));
    let slidesMaxWidthSm = Number(list.getAttribute('data-slidesMaxWidthSm'));
    if(window.innerWidth >= 768 && slidesToShowMd == 0) {
        for (var i = 0; i < list.children.length; i++) {
            let imageWidthMd = Number(list.children[i].getAttribute('data-imageWidthMd'));
            let slideWidth = slidesMaxWidthMd * imageWidthMd;
            if( list.children[i].querySelector('img') !== null ) {
                list.children[i].style.width = slideWidth + 'px';
                list.children[i].querySelector('img').style.maxWidth = '100%';
            }
        }
    } else if(window.innerWidth < 768 && slidesToShowSm == 0) {
        for (var i = 0; i < list.children.length; i++) {
            let imageWidthSm = Number(list.children[i].getAttribute('data-imagewidthMd')); //we're only supplying desktop slide images, and so, using md image on mobile for now --Alex 2024-03-20
            let slideWidth = slidesMaxWidthSm * imageWidthSm;
            if( list.children[i].querySelector('img') !== null ) {
                list.children[i].style.width = slideWidth + 'px';
                list.children[i].querySelector('img').style.maxWidth = '100%';
                list.children[i].querySelector('img').removeAttribute('loading'); //removing lazy load for mobile scrolling images due to a related Safari iOS bug --Alex 2024-06-11
            }
        }
    }
    
    //if using lazyload images, set the src to the data-src after cloning
    for (var i = 0; i < list.children.length; i++) {
        if(
            list.children[i].querySelector('img') !== null &&
            list.children[i].querySelector('img').getAttribute('src') == null &&
            list.children[i].querySelector('img').getAttribute('data-src') !== ''
            
        ) {
            list.children[i].querySelector('img').setAttribute('src', list.children[i].querySelector('img').getAttribute('data-src'));
        }
    }

    let animationSpeedMd = Number(list.getAttribute('data-animation-speedMd'))
    let animationSpeedSm = Number(list.getAttribute('data-animation-speedSm'))
    const duplicatedList = scroller.querySelector('.fresh-duplicated-list');
    if (duplicatedList) duplicatedList.remove();
    const clonedList = list.cloneNode(true);
    clonedList.classList.add('fresh-duplicated-list');
    list.classList.add('fresh-is-animated');
    clonedList.classList.remove('fresh-is-animated');
    scroller.appendChild(clonedList);
    var slickData = clonedList.getAttribute('data-slick');
    if (slickData) {
      var fresh_slickSettings = JSON.parse(slickData.replace(/&quot;/g, '"'));
      const desktopSlick = fresh_slickSettings.responsive[0].settings
      const mobileSlick = fresh_slickSettings.responsive[1].settings
      if (animationSpeedMd > 0 && desktopSlick !== 'unslick') animationSpeedMd = 0;
      if (animationSpeedSm > 0 && mobileSlick !== 'unslick') animationSpeedSm = 0;
    }
    if (window.innerWidth <= 768 && animationSpeedSm > 0) fresh_startAnimation(list, clonedList);
    else if (window.innerWidth > 768 && animationSpeedMd > 0) fresh_startAnimation(list, clonedList);
  });
}

function fresh_startAnimation(list, clonedList){
  clonedList.setAttribute('data-infinite-scroll', true);
  var totalWidth = 0;
  while (totalWidth < list.parentNode.offsetWidth * 11) {
    for (var i = 0; i < list.children.length; i++) {
      var clonedChild = list.children[i].cloneNode(true);
      clonedChild.setAttribute('aria-hidden', 'true');
      clonedList.appendChild(clonedChild);
      totalWidth += clonedChild.offsetWidth;
    }
  }
}


/********************************************************************************************
 * Title: Logo Click Handler
 *
 * Description:
 * Handles click events on logos, updating their opacity and displaying corresponding text.
 *
 * @Author Ahmed Ezzaouia
 ********************************************************************************************/
function handleLogoClick(e) {
  console.log("🚀 ~ handleLogoClick function: Event type: ", e.type)
  const logos = document.querySelectorAll('.fresh-logobar');
  const activeTexts = document.querySelectorAll('.fresh_bragbar_text');
  logos.forEach((logo) => {
    logo.addEventListener('click', () => {
      logos.forEach((logo) => {
        logo.style.opacity = '0.4';
      });
      logo.style.opacity = '1';
      activeTexts.forEach((activeText) => {
        activeText.style.display = 'none';
      });
      const blockId = logo.classList[1].replace('fresh-logobar--', '');
      const activeText = document.querySelector('.fresh_bragbar_text--' + blockId);
      activeText.style.display = 'block';
    });
  });
}


/********************************************************************************************
 * Title: Convert Video Poster Images to High Quality
 *
 * Description:
 * Strips the _small and _medium image path names from images to ensure a higher quality video
 *
 * @author Alexander Khost, based off https://community.shopify.com/c/shopify-design/why-are-my-video-thumbnails-blurry-on-the-dawn-theme/m-p/2291713
 ********************************************************************************************/
function freshConvertVideoPosterImages() {
    let videos = document.querySelectorAll('.fresh_video');
    videos.forEach(item=>{
        let newThumbnail = item.getAttribute('poster'); 
        if (newThumbnail.includes('_small')){ 
            newThumbnail = newThumbnail.replace('_small',''); 
            item.setAttribute('poster', newThumbnail)
        } else if (newThumbnail.includes('_medium')){ 
            newThumbnail = newThumbnail.replace('_medium',''); 
            item.setAttribute('poster', newThumbnail)
        }
    });
}


/*#########################################################################################
#                                                                                         #
#    Event Listeners                                                                      #
#    -----------------                                                                    #
#    Hook functions to specific events here.                                              #
#                                                                                         #
#########################################################################################*/

$0(document).ready(function() {
  freshOpenExternalLinksInNewWindow();
  smoothScrollToInlineAnchors();
  initializeAnimationOnReload();
  fresh_toggleAccordion();
  freshSetXY();
  freshConvertVideoPosterImages();
});

$0(document).ready(function(e) {
  fresh_infinite_scroll(e);
  fresh_slickInit(".fresh-slides");
//  freshSetXY();
  handleLogoClick(e);
});

$0(window).on('resize', debounce(function(e) {
  fresh_handleVideoLoad();
  freshSetXY();
  fresh_infinite_scroll(e);
  fresh_slickInit(".fresh-slides");
  handleLogoClick(e);
}, 100));

//sticky-header scrolling detection
var freshScroll = 0;
$freshWindow.scroll(function(){
    let $freshStickyHeader = $0('sticky-header').first(),
        freshStickyHeaderHeight = $freshStickyHeader.outerHeight();
    freshScroll = $freshWindow.scrollTop();

    if (freshScroll >= freshStickyHeaderHeight) {
        $freshStickyHeader.addClass('fresh-scrolled');
    } else {
        $freshStickyHeader.removeClass('fresh-scrolled');
    }
});
$0(document).ready(function() {
    let $freshStickyHeader = $0('sticky-header').first(),
        freshStickyHeaderHeight = $freshStickyHeader.outerHeight(),
        $mobileHeaderDrawer = $freshStickyHeader.find('header-drawer').first();
    $mobileHeaderDrawer.on('click',function() {
        if (freshScroll <= freshStickyHeaderHeight) {
            if($freshStickyHeader.hasClass('fresh-scrolled')) {
                $freshStickyHeader.removeClass('fresh-scrolled');
            } else {
                $freshStickyHeader.addClass('fresh-scrolled');
            }
        }
    });
});

$0(document).on('shopify:section:load', function(e){
  lazyLoadInstance.update();
  fresh_toggleAccordion();
  fresh_handleVideoLoad();
  freshSetXY();
  fresh_infinite_scroll(e);
  fresh_slickInit(".fresh-slides");
  handleLogoClick(e);
  
});

$0(document).on('shopify:section:reorder', function(){
  lazyLoadInstance.update();
});

$0(document).on('shopify:block:load', function(e){
  fresh_infinite_scroll(e);
  fresh_slickInit(".fresh-slides");
  handleLogoClick(e);
});