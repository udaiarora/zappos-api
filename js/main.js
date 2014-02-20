function post_search(){
	var item=$('.txt').val();
	console.log("Searched for: " + item);

	$.get('fetch', "item="+item , function(data){
		//$(".image-container").append(data.limit);
		$(".image-container").html("");
		data=$.parseJSON(data);
		$.each(data.results,function() {
			$(".image-container").append("<img class='result' src='"+this.thumbnailImageUrl+"' product='"+this.productId+"' style='"+this.styleId+"'/>");
		})
	});

}

var watch_list_json={items: []};

function post_watchlist(){
	$('.discounted-items').html("");
	console.log("Submitting Watch List to the server");

	$.get('watch', "watch_list_json="+JSON.stringify(watch_list_json) , function(data){
		data=$.parseJSON(data);
		var i=0;
		$.each(data.disc_items,function() {
			$('.discounted-items').append(data.disc_items[i].percentOff);
			i++;
		});
		
	});
	setTimeout(function(){
		post_watchlist();
	},5000)
}

$(document).ready(function(){
	$('.image-container').on("click", '.result' , function(){
		var pid=$(this).attr("product");
		var sid=$(this).attr("style");
		watch_list_json.items.push({"productId":pid, "styleId":sid});
		$('.watch-list').append(this);
	})
});