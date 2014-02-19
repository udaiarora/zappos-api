function post_search(){

	var item=$('.txt').val();
	console.log("Searched for: " + item);

	$.get('fetch', "item="+item , function(data){
		//$(".image-container").append(data.limit);
		$(".image-container").html("");
		data=$.parseJSON(data);
		$.each(data.results,function() {
			$(".image-container").append("<img src='"+this.thumbnailImageUrl+"' product='"+this.productId+"' style='"+this.styleId+"'/>");
		})

	});
}