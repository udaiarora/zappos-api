// Author: Udai Arora
// www.udaiarora.com
// Made for Zappos Internship 2014

//Function called to Search for products
function post_search(){
	var item=$('.txt').val();
	console.log("Searched for: " + item);

	$.get('fetch', "item="+item , function(data){
		//$(".image-container").append(data.limit);
		$(".image-container").html("");
		data=$.parseJSON(data);
		$.each(data.results,function() {
			$(".image-container").append("<div class='inline result-holder' product='"+this.productId+"' productstyle='"+this.styleId+"'><a  target='_blank' href='"+this.productUrl+"'><img class='result' src='"+this.thumbnailImageUrl+"'/></a><div class='add block'>Add</div><div>");
		})
	});

}

var watch_list_json={items: []};

//Function called to Update the discounts
var xhr = function() {
	$('.step1').fadeOut(200,function(){
		$('.step2').fadeIn(200);
	});
	console.log("Submitting Watch List to the server");
	watch_list_string="watch_list_json="+JSON.stringify(watch_list_json);
	$.ajax({url:'/watch', type:"GET", data:watch_list_string, success:function(data){
		data=$.parseJSON(data);
		var i=0;
			$('.discounted-items').html('');
		$.each(data.disc_items,function() {
			$('.discounted-items').append("<div class='inline result-holder'><a href='"+data.disc_items[i].productUrl+"'  target='_blank'><img src='"+data.disc_items[i].thumbnailImageUrl+"'/></a><div class='off'>"+data.disc_items[i].percentOff+"% off!</div></div>");
			i++;
		});
		
	}});
	setTimeout(function(){
		xhr();
	},10000)
}

$(document).ready(function(){
	$('.image-container').on("click", '.add' , function(){
		thisparent=$(this).parent();
		$(this).remove();
		var pid=$(thisparent).attr("product");
		var sid=$(thisparent).attr("productstyle");
		watch_list_json.items.push({"productId":pid, "styleId":sid});
		$('.watch-list').append(thisparent)
	})
});