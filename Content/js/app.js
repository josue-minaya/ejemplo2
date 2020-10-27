new universalParallax().init();
function closeMenu(){
	$("#nav-shadow").css("display","none");
	$("body").css("overflow","scroll").removeClass("active-nav-aside");  
}
function openMenu(){
	window.tmpChoose = null;
	$("#nav-shadow-cart").css("display","none");
	$("#nav-choose").css("display","none");
	if($("#nav-shadow").is(":visible")){
		closeMenu();
	}else{
		$("#nav-shadow").css("display","block"); 
		$("body").css("overflow","hidden").addClass("active-nav-aside"); 
	}
}

function openCart(){
	closeMenu();
	window.tmpChoose = null;
	if($("#nav-shadow-cart").is(":visible")){
		closeMenu();
		$("#nav-shadow-cart").css("display","none");
	}else{
		$("#nav-shadow-cart").css("display","block"); 
		$("#nav-choose").css("display","none");
		$("body").css("overflow","hidden");
	}
}

$( window ).on( 'hashchange', function( e ) {
    closeMenu();
} );

function goto(id){
	closeMenu();
	window.location.hash = "#" + id;
}

$(document).ready(function(){

	var lightbox = new SimpleLightbox('.slick a, .slick_full a', { docClose:false, nav:false, animationSpeed:100, swipeClose:false });
	var lightbox = new SimpleLightbox('.zoomin', { docClose:false, nav:false, animationSpeed:100, swipeClose:false, captionSelector:'div' });

	$('.slick').slick({
	  slidesToShow:(window.screen.width > 600 ? 4 : 2),
	  slidesToScroll: 1,
	  autoplay: true,
	  autoplaySpeed: 2000,
	  arrows: false,
	  adaptiveHeight:true,
	  infinite:false,
	  pauseOnFocus:false,
	  pauseOnHover:false,
	  mobileFirst:true
	});
	
	$('.slick_full').slick({
	slidesToShow: 1,
	autoplay:true,
	speed:2000,
	arrows:false
	});
	
	printShopping();
	
});

function showmore(obj){
	$(obj).closest(".block-products").find(".block-products-container").removeClass("hidecontent");
	$(obj).closest(".block-products").find(".block-products-gradient").css("display","none");
	$(obj).closest(".block-products").find(".block-products-showmore").css("display","none");
}

function openSocial(whatsappUrl){
	
	var is_cordova = false;
	
	if(typeof webkit !== "undefined"){
		if(typeof webkit.messageHandlers !== "undefined"){
			if(typeof webkit.messageHandlers.cordova_iab !== "undefined"){
				is_cordova = true;
			}
		}
	}
	
	if(is_cordova){
		webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({ url: whatsappUrl }));
	}else{
		window.open(whatsappUrl);
	}

}

window.shopping = {
	
	fullname:"",
	instructions:"",
	address:"",
	products:{}
};

function cleanPrice(price){

	price = price.toLowerCase();
	price = price.replace(",","");
	price = price.replace(" ","");
	price = price.replace("$","");

	return price;

}

window.tmpChoose = null;

function displayChoose(){
	$("body").css("overflow","hidden");
	$("#nav-choose").css("display","block");
	
	var tmpHtml = '<div class="choose_bigtitle">Por favor completa los siguientes detalles<br>del producto seleccionado:</div>';
	var tmpTitle = "";
	var tmpPrice = null;
	
	for(var i = 0; i < window.tmpChoose.choose.length; i++){
		switch(window.tmpChoose.choose[i].type){
			case "textarea":
				tmpHtml += '<div class="choose_title">'+window.tmpChoose.choose[i].title+'</div>';
				tmpHtml += '<div class="choose_input"><textarea id="'+window.tmpChoose.id+'_choose_'+i+'_textarea" placeholder="Escribe aquí"></textarea></div>';
			break;
			case "radio":
				tmpHtml += '<div class="choose_title">'+window.tmpChoose.choose[i].title+'</div>';
				tmpHtml += '<div class="choose_radio">';
				for(var j = 0; j < window.tmpChoose.choose[i].options.length; j++){
					if(typeof window.tmpChoose.choose[i].options[j] == "string"){
						tmpTitle = window.tmpChoose.choose[i].options[j];
						tmpPrice = null;
					}else{
						tmpTitle = window.tmpChoose.choose[i].options[j].title;
						if(typeof window.tmpChoose.choose[i].options[j].price !== "undefined"){
							tmpPrice = window.tmpChoose.choose[i].options[j].price;
						}
					}
					tmpHtml += '<div class="choose_radio_option"><input type="radio" name="'+window.tmpChoose.id+'_choose_'+i+'_radio" value="'+tmpTitle+'" ' + ( tmpPrice !== null ? 'price="'+tmpPrice+'"' : '') + '> '+tmpTitle+'</div>';
				}
				tmpHtml += '</div>';
			break;
		}
	}
	
	tmpHtml += '<div class="container_button"><button type="button" id="addProductChoose" class="big_button_green" onclick="chooseProcessing();">AGREGAR PRODUCTO</button></div>';
	
	$("#nav-choose").html(tmpHtml);
	
}

function chooseProcessing(){
	$("#addProductChoose").attr("disabled","disabled");
	var tmpId = null;
	var tmpObj = null;
	window.tmpChoose.description_extended = window.tmpChoose.description;
	for(var i = 0; i < window.tmpChoose.choose.length; i++){
		switch(window.tmpChoose.choose[i].type){
			case "textarea":
				window.tmpChoose.description_extended += ' [ '+ window.tmpChoose.choose[i].title_order + ' : ' + $('#'+window.tmpChoose.id+'_choose_'+i+'_textarea').val() + ' ]';
			break;
			case "radio":
				//tmpId = window.tmpChoose.id+'_choose_'+i+'_'+j+'_radio';
				tmpObj = $('input[name=\''+ window.tmpChoose.id + '_choose_' + i + '_radio\']:checked');
				window.tmpChoose.description_extended += ' [ '+ window.tmpChoose.choose[i].title_order + ' : ' + $(tmpObj).val() ;
				window.tmpObjTest = tmpObj;
				if($(tmpObj).attr("price")){
					window.tmpChoose.price = (parseFloat(window.tmpChoose.price) + parseFloat($(tmpObj).attr("price")));
					window.tmpChoose.description_extended += ' $' + $(tmpObj).attr("price");
				}
				window.tmpChoose.description_extended += ' ]';
			break;
		}
	}
	window.tmpChoose.price = window.tmpChoose.price + "";
	window.addProduct(window.tmpChoose.id + "_" + window.makeid(4),window.tmpChoose.description_extended,window.tmpChoose.price);
	window.tmpChoose = null;
	window.closeChoose();
}

function closeChoose(){
	$("#nav-choose").html("");
	$("body").css("overflow","scroll");
	$("#nav-choose").css("display","none");
}

function addProduct(id,description,price,choose){

	price = cleanPrice(price);
	
	description = description.replace('&#39;',"'");
	
	if(typeof choose !== "undefined"){
		window.tmpChoose = {
			id:id,
			price:price,
			description:description,
			choose: JSON.parse(choose)
		};
		window.displayChoose(choose);
		return false;
	}
	
	if( typeof window.shopping.products[id] !== "undefined"){
		window.shopping.products[id].amount++;
	}else{
		window.shopping.products[id] = {
			description:description,
			price:price,
			amount:1
		};
	}
	
	
	setTimeout(function() {
        $(".alerta").fadeIn(500);
	},500);
	setTimeout(function() {
        $(".alerta").fadeOut(3000);
    },3000);
	printShopping();

}

function deleteProduct(id){
	if( typeof window.shopping.products[id] !== "undefined"){
		if(window.shopping.products[id].amount > 1){
			window.shopping.products[id].amount = window.shopping.products[id].amount - 1;
		}else{
			delete window.shopping.products[id];
		}
		
		printShopping();
		
	}
	
}

function calcTotal(){
	
	var total = 0;
	
	for( var key in window.shopping.products ) {
		if(window.shopping.products[key].price !== "s/t"){
			total += ( parseFloat(window.shopping.products[key].price) * parseInt(window.shopping.products[key].amount) );
		}
	}
	
	if($("input[name='shopping_servicetype']:checked").val() == "1"){
		if(typeof window.shippingPrice !== "undefined"){
			total += window.shippingPrice;
		}
	}
	
	return total;
	
}

function changeServiceType(){

	if($("input[name='shopping_servicetype']:checked").val() == "1"){
		$("#shopping_address").css("display","block");
	}else{
		$("#shopping_address").css("display","none");
	}
	
	if($("input[name='shopping_servicetype']:checked").val() == "1"){
		$("#shopping_cuota").css("display","block");
	}else{
		$("#shopping_cuota").css("display","none");
	}
	
	printShopping();
	
}

function createOrder(){
	
	var fullname = $("#shopping_name").val();
	var instructions = $("#shopping_instructions").val();
	var address = $("#shopping_address").val();
	var cuota = $("#shopping_cuota").val();
	if(fullname == ""){
		alert("Por favor completa tu nombre completo.");
		return false;
	}
	
	
	if($("input[name='shopping_servicetype']:checked").val() == "1"){
		if(address == ""){
			alert("Por favor completa tu dirección.");
			return false;
		}
	}
	if($("input[name='shopping_servicetype']:checked").val() == "1"){
		if(cuota == ""){
			alert("Por favor completa con cuanto pagarás.");
			return false;
		}
	}

	var text = "*PIZZAS A LA PIEDRA*\n\n";
	text += "Hola, quiero hacer un pedido:\n\n";
	
	for( var key in window.shopping.products ) {
		
		text += "" + window.shopping.products[key].description + "\n";
		text += window.shopping.products[key].amount + " x $" + window.shopping.products[key].price + "  ";
		text += "= S/" + ( parseFloat(window.shopping.products[key].price) * parseInt(window.shopping.products[key].amount) ) + "\n" ;
	
		text += "------------------------------------------------\n" ;

	}
	
	text += "\n" ;
	
	if($("input[name='shopping_servicetype']:checked").val() == "1"){
		if(typeof window.shippingPrice !== "undefined"){
			text += "*Envio:* $  " + window.shippingPrice + "\n";
		}
	}
	
	text += "*Total del Pedido:* $" + calcTotal() + "\n\n";
	
	if(instructions !== ""){
	text += "*Importante:* " + instructions + "\n\n";
	}
	
	text += "*Mi nombre es:* " + fullname + "\n\n";
	
	if($("input[name='shopping_servicetype']:checked").val() == "1"){
		text += "*Mi dirección:* " + address + "\n\n";
		text += "*Pagaré con :* $" + cuota + "\n\n";
		
	}else{
		text += "***Paso a Recogerlo***\n\n";
	}
	
	text += "Gracias";
	
	text = window.encodeURIComponent(text);
	
	window.openSocial('https://api.whatsapp.com/send?phone='+window.restaurantWhatsapp+'&text='+text);
	
}

function printShopping(){
	
	var total = window.calcTotal();
	
	$("#shopping_total").html(total);
	
	
	var html = "";
	
	var bubble = 0;
	
	for( var key in window.shopping.products ) {
		
		bubble += window.shopping.products[key].amount;
		
		html += '<li>';
		html += '<div class="name">' + window.shopping.products[key].description + '</div>';
		html += '<div class="amount">x' + window.shopping.products[key].amount + '</div>';
		html += '<div class="price">$' + window.shopping.products[key].price + '</div>';
		html += '<div class="delete" onclick="deleteProduct(\''+key+'\');">X</div>';
		html += '</li>';
		
	}
	
	if($("input[name='shopping_servicetype']:checked").val() == "1"){
		if(typeof window.shippingPrice !== "undefined"){
			html += '<li>';
			html += '<div class="name">Envio</div>';
			html += '<div class="amount">---</div>';
			html += '<div class="price"> $' + window.shippingPrice + '</div>';
			html += '<div class="delete"></div>';
			html += '</li>';
		}
	}
	
	if(bubble > 0){
		$("#shopping_bubble").html(bubble);
		$("#shopping_bubble").css("display","block");
	}else{
		$("#shopping_bubble").css("display","none");
	}
	
	$("#shopping_products").html(html);
	
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}