$(function(){ $('div.description').find('.edit').click(function(){

console.log('edit');

var this_description = $(this).parent();
this_text = this_description.find('span.body').text();
this_description.find('span').hide();
var edit_html = '<div class="editing"><textarea style="padding:5px; width:400px;">' + $.trim(this_text) + '</textarea><button style="position:absolute; margin: 18px 5px;">OK</button></div>';

this_description.append(edit_html);
this_description.find('button').click(function(){ 
	// AJAX call
	var new_text = this_description.find('textarea').val();
	this_description.find('div.editing').remove();
	this_description.find('span.body').text(new_text);
	this_description.find('span').show();
	
	});
	
});


});