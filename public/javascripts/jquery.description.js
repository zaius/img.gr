$(function(){ 


$('textarea#image_description').keyup(function(){
these_chars_left = $(this).parent().find('div.chars_left');
limitChars($(this), 140, these_chars_left);
});



$('div.description').find('.edit').click(function(){

var this_description = $(this).parents('div.description');
var this_id = this_description.parents('div.image').attr('id');
this_text = this_description.find('span.body').text();

this_description.find('span').hide();
var edit_html = '<div class="editing"><textarea maxlength=120>' 
+ $.trim(this_text) + 
'</textarea><button>OK</button><div class="chars_left"></div>';

this_description.append(edit_html);

// textarea character count for aboutme section
var this_textarea = this_description.find('textarea');
var these_chars_left = this_description.find('.chars_left');
this_textarea.keyup(function(){
limitChars(this_textarea, 140, these_chars_left);
});
limitChars(this_textarea, 140, these_chars_left);


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

	
	}); // end submit description
	
}); // end edit description


    
});


function limitChars(textarea, limit, infodiv)
{

	var text = textarea.val();	
	var textlength = text.length;
	if(textlength > limit)
	{
		//$('#' + infodiv).html("You've reached the "+limit+" limit ");
		textarea.val(text.substr(0,limit));
		return false;
	}
	else
	{
		infodiv.html((limit - textlength) +' characters left');
		return true;
	}
}