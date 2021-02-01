$(document).ready(function() {
    if ($(window).width() > '769'){
        $('.nav__li').removeClass('nav__li-mobile')
    }else{
        $('.nav__li').addClass('nav__li-mobile')

    }

});
$('.open__menu').on('click', function (){
    $('.nav').show(300)
    $('.open__menu').hide(300)
    $('.close__menu').show(300)
    $('header').css({'height':'800px'})
})
$('.close__menu,.nav__li-mobile').on('click', function (){
    console.log('435345345')
    $('.nav').hide(300)
    $('.open__menu').show(300)
    $('.close__menu').hide(300)
    $('header').css({'height':''})
})

$('.slider').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                arrows: false,
                slidesToShow: 1,
                autoplay: true,
                autoplaySpeed: 2000,
            }
        },
        {
            breakpoint: 992,
            settings: {
                arrows: false,
                slidesToShow: 2,
                autoplay: true,
                autoplaySpeed: 2000,
            }
        },
        {
            breakpoint: 1200,
            settings: {
                arrows: false,
                slidesToShow: 3,
                autoplay: true,
                autoplaySpeed: 2000,
            }
        },
    ]
});