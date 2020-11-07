$(document).ready(function() {
  
   //search
	$(".is-search,.go-left").click(function() {
        $(".search-page").toggle();
    });	
	  
	
    //nav
    $("nav li a:not(:first)").each(function(){
        $this = $(this);
        if($this[0].href==String(window.location)){
            $this.parent().addClass("selected");
        }
    });

    $("nav li a").each(function(){
        $this = $(this);
        if($this[0].href==String(window.location)){
            $this.parent().addClass("selected");
        }
    });
	
 //nav
	$("#mnavh").click(function(){
    $("#starlist").toggle();
	$("#mnavh").toggleClass("open");
	$(".sub").hide();
	});
	//nav menu
  
  $(".menu").click(function(event) {	
  $(this).children('.sub').slideToggle();
  $(this).siblings('.menu').children('.sub').slideUp('');	
   event.stopPropagation()
   });
   $(".menu a").click(function(event) {
   event.stopPropagation(); 
   });
   $(".sub li").click(function(event) {
   event.stopPropagation(); 
   });
	
	//aside
    var Sticky = new hcSticky('aside', {
      stickTo: 'main',
      innerTop: 0,
      followScroll: false,
      queries: {
        480: {
          disable: true,
          stickTo: 'body'
        }
      }
    });
	
	
});

	