$(function(){ $('div.description').find('.edit').click(function(){

var this_description = $(this).parents('div.description');
this_text = this_description.find('span.body').text();

this_description.find('span').hide();
var edit_html = '<div class="editing"><textarea>' + $.trim(this_text) + '</textarea><button>OK</button></div>';

this_description.append(edit_html);
this_description.find('button').click(function(){ 
	
	var new_text = this_description.find('textarea').val();
	this_description.find('div.editing').remove();
	this_description.find('span.body').text(new_text);
	this_description.find('span').show();



return;	// AJAX call
    $.ajax({
		type: "POST", 
		url: '/',
		datatype: "json",
		data:
			{ description: new_text },
		error: function() {  },
		success: function(response) { }
});	

	
	});
	
});


});