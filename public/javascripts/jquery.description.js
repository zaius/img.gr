$(function(){ $('div.description').find('.edit').click(function(){

var this_description = $(this).parents('div.description');
var this_id = this_description.parents('div.image').attr('id');
this_text = this_description.find('span.body').text();

this_description.find('span').hide();
var edit_html = '<div class="editing"><textarea>' + $.trim(this_text) + '</textarea><button>OK</button></div>';

this_description.append(edit_html);
this_description.find('button').click(function(){ 
	
	var new_description = this_description.find('textarea').val();
	this_description.find('div.editing').remove();
	this_description.find('span.body').text(new_description);
	this_description.find('span').show();

	// AJAX call
    $.ajax({
		type: "POST", 
		url: '/update',
		datatype: "html",
		data:
			{ id: this_id, description: new_description },
		error: function() {  },
		success: function(response) { console.log(response); }
});	

	
	});
	
});


});