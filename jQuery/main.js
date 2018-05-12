$('.menu1 > .item').on('click', function(){
    $('.menu1 > .submenu').slideToggle(1000);
});

$('.menu2 > .item').on('click', function(){
    $('.menu2 > .submenu').slideToggle(1000);
});

if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('/jQuery/sw.js')
    .then(registration => {console.log('Service Worker is registered in scope: ' + registration.scope)})
}
