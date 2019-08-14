(function () {
    "use strict";
    var activeClass="active",
        galleryJSON,
        categoriesContainer = $("#categories"),
        categoriesElement = "li",
        categoriesElementSpan = "span",
        contentContainer = $("ul#slick"),
        currentCategory,
        thumbsContainer = $("ul#slick-thumbs");    


    function makeThumbs(content, category) {
        var thumbElement = $(document.createElement('li')),
            thumbData = $(document.createElement('img'));

        thumbData.attr({
            alt: content.alt,
            src: content.thumb
        })

        thumbElement.addClass(category.toLowerCase().replace(" ","-"));

        thumbElement.append(thumbData);
        return thumbElement;
    }

    function populateThumbs(content, category) {
        for(var i = 0; i < content.length; i++) {
            var thumbs = makeThumbs(content[i], category);
            thumbsContainer.append(thumbs); 
        }
            
    }

    function makeContent(content, category) {
        var contentElement = $(document.createElement('li')),
            contentData = $(document.createElement('img'));
        contentData.addClass('responsive-img');
        contentData.attr({
            alt: content.alt,
            src: content.full_url,
            srcset: content.full_url,
            sizes: "(max-width: " + content.full_width + "px) 100vw, " + content.full_width + "px"
        });

        contentElement.addClass(category.toLowerCase().replace(" ","-"));
        contentElement.append(contentData);

        // Add caption, if it exists.
        if(content.caption) {
            var captionContainer = $(document.createElement('div'));
            captionContainer.addClass('gallery-caption');
            captionContainer.html(content.caption);
            contentElement.append(captionContainer);
        }

        return contentElement;
    }

    function populateContent(content, category) {
        for(var i = 0; i < content.length; i++) {
            var contentElements = makeContent(content[i], category);
            contentContainer.append(contentElements); 
        }    
    }

    function showCategoryContent(catElement, catObject) {
        categoriesContainer.find(categoriesElement).removeClass(activeClass);
        currentCategory = catObject;
        populateContent(currentCategory.content, currentCategory.category_name);
        populateThumbs(currentCategory.content, currentCategory.category_name);
    }

    function makeCategory(gallery, isActive) {
        var categoryElement = $(document.createElement(categoriesElement));
        var categoryElementSpan = $(document.createElement(categoriesElementSpan));

        categoryElement.val(gallery.category_name.toLowerCase().replace(" ","-"));

        if (isActive){
            showCategoryContent(categoryElement,gallery);
        }

        categoryElementSpan.html(gallery.category_name);
        categoryElement.html(categoryElementSpan);
       
        return categoryElement;

    }

    function populateCategories(categories) {
        var isActive = true;
        for (var i = 0; i<categories.length; i++) {
            var category = makeCategory(categories[i],isActive);
            populateContent(categories[i]);
            categoriesContainer.append(category); 
        }
    }

    function initialize_sliders() {

        // Initialize Slider.
        $('#slick').slick({
            infinite: true,
            dots: false,
            arrows: true,
            prevArrow:'<span class="slick-prev icon-arrow"></span>',
            nextArrow:'<span class="slick-next icon-arrow"></span>',
            fade: true,
            autoplay: false,
            centerMode: true,
            variableWidth: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '#slick-thumbs',
            cssEase:"ease-in-out"
        });

        // Thumbnail Controller
        $('#slick-thumbs').slick({
            infinite: true,
            dots: false,
            arrows: true,
            prevArrow:'<span class="slick-prev icon-arrow"></span>',
            nextArrow:'<span class="slick-next icon-arrow"></span>',
            autoplay: false,
            slidesToShow: 5,
            slidesToScroll: 1,
            centerMode: true,
            mobileFirst: false,
            //variableWidth: true,
            adaptiveHeight: false,
            asNavFor: '#slick',
            focusOnSelect: true,
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,

                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,

                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },

            ]
        });
    }

2

    function startGallery() {
        $('#categories li:first-child').addClass('active');
        initialize_sliders();
        /*----------  Filter  ----------*/
        $('#categories li').on('click', function(e){
            var filter = $(this).text().toLowerCase();
            var key = "."+filter;

            // Toggle class active
            $('#categories li').removeClass('active');
            $(this).addClass('active');

            $('#slick, #slick-thumbs').slick('slickUnfilter');
            $('#slick, #slick-thumbs').slick('slickFilter',key).slick('refresh');
            $('#slick, #slick-thumbs').slick('slickGoTo', 0);

        });
    }

    function init(){
      $.ajax({
        cache:false,
        url:templateURL + "/JSON/gallery.json",
        dataType:"json",
        success:function(data){
            galleryJSON = data;

            // Add an "All" Category
            var allCategories = {
              category_name: "All",
              content:[]
            };

            // Loop through data and get existing category content, and push them to into "allCategories" array.
            for (var i=0; i<galleryJSON.length; i++){
              for (var j=0; j<galleryJSON[i].content.length; j++){
                allCategories.content.push(galleryJSON[i].content[j]);
              }
            }
            galleryJSON.unshift(allCategories);

            populateCategories(galleryJSON);
            startGallery();


        }
      });
    }

    $(document).ready(function(){
        init();
    });

    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
                incrementImage(-1);
                break;
            case 39: // right
                incrementImage(1);
                break;
            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
}());