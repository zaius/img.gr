// var notes = [{"x1":"10","y1":"10","height":"150","width":"50","note":"This is note one"}, {"x1":"25","y1":"25","height":"70","width":"80","note":"<strong>This</strong> is a new note This is another note This is a new note"}];
var query_textbox, autocomp
var coords
$(function(){
	
	$("img#main_image").imgNotes();
	//$("img#main_image").imgAreaSelect();
	$("img#main_image").click(function(e){
		var iLeft = e.pageX - parseInt($(this).offset().left);
		// alert(e.pageY);
		// alert($(this).offset().top);
		var iTop = e.pageY - parseInt($(this).offset().top);
		$(this).imgAreaSelect({ onSelectChange: showaddnote, x1:iLeft, y1: iTop, x2: iLeft + 100, y2: iTop + 100 });
		//$(this).imgAreaSelect({ onSelectChange: showaddnote, x1:100, y1: 100, x2: 100, y2:100 });
	});

	
	function showaddnote (img, area) {
		imgOffset = $(img).offset();
		form_left  = parseInt(imgOffset.left) + parseInt(area.x1);
		form_top   = parseInt(imgOffset.top) + parseInt(area.y1) + parseInt(area.height)+5;
		query_textbox = $("#q"); 
		autocomp = $("#footer").next(); // was "#q"
		
		query_textbox.css({ left: form_left + 'px', top: form_top + 'px'});
		autocomp.css({ left: form_left + 'px', top: form_top + 22 + 'px'});
		
		query_textbox.show().focus();
		autocomp.show();

		query_textbox.css("z-index", 10000);
		autocomp.css("z-index", 10000);
		$('#NoteX1').val(area.x1);
		$('#NoteY1').val(area.y1);
		$('#NoteHeight').val(area.height);
		$('#NoteWidth').val(area.width);
		coords = area;
	}
	
});