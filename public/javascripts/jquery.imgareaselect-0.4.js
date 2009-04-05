/*
 * imgAreaSelect jQuery plugin
 * version 0.4
 *
 * Copyright (c) 2008 Michal Wojciechowski (odyniec.net)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://odyniec.net/projects/imgareaselect/
 *
 */

jQuery.imgAreaSelect = function (img, options) {
    var $area = jQuery('<div id="1"></div>'),
        $border1 = jQuery('<div id="2"></div>'),
        $border2 = jQuery('<div id="3"></div>'),
        $outLeft = jQuery('<div id="4"></div>'),
        $outTop = jQuery('<div id="5"></div>'),
        $outRight = jQuery('<div id="6"></div>'),
        $outBottom = jQuery('<div id="7"></div>'),
        imgOfs, imgWidth, imgHeight,
        zIndex = 0, fixed = false,
        startX, startY, moveX, moveY,
        resizeMargin = 10, resize = [ ], V = 0, H = 1,
        d, aspectRatio,
        x1, x2, y1, y2, x, y,
        selection = { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 };

    var $a = $area.add($border1).add($border2);
    var $o = $outLeft.add($outTop).add($outRight).add($outBottom);

    function getZIndex()
    {
        var $p = jQuery(img);

        while ($p.length && !$p.is('body')) {
            if (!isNaN($p.css('z-index')) && $p.css('z-index') > zIndex)
                zIndex = $p.css('z-index');
            if ($p.css('position') == 'fixed') fixed = true;

            $p = $p.parent();
        }
    }

    function areaMouseMove(event)
    {
        x = event.pageX - selection.x1 - imgOfs.left;
        y = event.pageY - selection.y1 - imgOfs.top;

        resize = [ ];

        if (options.resizable) {
            if (y <= resizeMargin)
                resize[V] = 'n';
            else if (y >= selection.height - resizeMargin)
                resize[V] = 's';
            if (x <= resizeMargin)
                resize[H] = 'w';
            else if (x >= selection.width - resizeMargin)
                resize[H] = 'e';
        }

        $border2.css('cursor', resize.length ? resize.join('') + '-resize' :
            options.movable ? 'move' : '');
    }

    function areaMouseDown(event)
    {
        if (event.which != 1) return false;

        if (options.resizable && resize.length > 0) {
            jQuery('body').css('cursor', resize.join('') + '-resize');

            x1 = (resize[H] == 'w' ? selection.x2 : selection.x1) + imgOfs.left;
            y1 = (resize[V] == 'n' ? selection.y2 : selection.y1) + imgOfs.top;

            jQuery(document).mousemove(selectingMouseMove);
            $border2.unbind('mousemove', areaMouseMove);

            jQuery(document).one('mouseup', function () {
                resize = [ ];

                jQuery('body').css('cursor', '');

                if (options.autoHide)
                    $a.hide();

                options.onSelectEnd(img, selection);

                jQuery(document).unbind('mousemove', selectingMouseMove);
                $border2.mousemove(areaMouseMove);
            });
        }
        else if (options.movable) {
            moveX = selection.x1 + imgOfs.left;
            moveY = selection.y1 + imgOfs.top;
            startX = event.pageX;
            startY = event.pageY;

            jQuery(document)
                .mousemove(movingMouseMove)
                .one('mouseup', function () {
                    options.onSelectEnd(img, selection);

                    jQuery(document).unbind('mousemove', movingMouseMove);
                });
        }
        else
            jQuery(img).mousedown(event);

        return false;
    }

    function aspectRatioXY()
    {
        x2 = Math.max(imgOfs.left, Math.min(imgOfs.left + imgWidth,
            x1 + Math.abs(y2 - y1) * aspectRatio * (x2 > x1 ? 1 : -1)));
        y2 = Math.round(Math.max(imgOfs.top, Math.min(imgOfs.top + imgHeight,
            y1 + Math.abs(x2 - x1) / aspectRatio * (y2 > y1 ? 1 : -1))));
        x2 = Math.round(x2);
    }

    function aspectRatioYX()
    {
        y2 = Math.max(imgOfs.top, Math.min(imgOfs.top + imgHeight,
            y1 + Math.abs(x2 - x1) / aspectRatio * (y2 > y1 ? 1 : -1)));
        x2 = Math.round(Math.max(imgOfs.left, Math.min(imgOfs.left + imgWidth,
            x1 + Math.abs(y2 - y1) * aspectRatio * (x2 > x1 ? 1 : -1))));
        y2 = Math.round(y2);
    }

    function selectingMouseMove(event)
    {
        x2 = !resize.length || resize[H] || aspectRatio ? event.pageX : selection.x2 + imgOfs.left;
        y2 = !resize.length || resize[V] || aspectRatio ? event.pageY : selection.y2 + imgOfs.top;

        if (options.minWidth && Math.abs(x2 - x1) < options.minWidth) {
            x2 = x1 - options.minWidth * (x2 < x1 ? 1 : -1);

            if (x2 < imgOfs.left)
                x1 = imgOfs.left + options.minWidth;
            else if (x2 > imgOfs.left + imgWidth)
                x1 = imgOfs.left + imgWidth - options.minWidth;
        }

        if (options.minHeight && Math.abs(y2 - y1) < options.minHeight) {
            y2 = y1 - options.minHeight * (y2 < y1 ? 1 : -1);

            if (y2 < imgOfs.top)
                y1 = imgOfs.top + options.minHeight;
            else if (y2 > imgOfs.top + imgHeight)
                y1 = imgOfs.top + imgHeight - options.minHeight;
        }

        x2 = Math.max(imgOfs.left, Math.min(x2, imgOfs.left + imgWidth));
        y2 = Math.max(imgOfs.top, Math.min(y2, imgOfs.top + imgHeight));

        if (aspectRatio)
            if (Math.abs(x2 - x1) / aspectRatio > Math.abs(y2 - y1))
                aspectRatioYX();
            else
                aspectRatioXY();

        if (options.maxWidth && Math.abs(x2 - x1) > options.maxWidth) {
            x2 = x1 - options.maxWidth * (x2 < x1 ? 1 : -1);
            if (aspectRatio) aspectRatioYX();
        }

        if (options.maxHeight && Math.abs(y2 - y1) > options.maxHeight) {
            y2 = y1 - options.maxHeight * (y2 < y1 ? 1 : -1);
            if (aspectRatio) aspectRatioXY();
        }

        selection.x1 = Math.min(x1, x2) - imgOfs.left;
        selection.x2 = Math.max(x1, x2) - imgOfs.left;
        selection.y1 = Math.min(y1, y2) - imgOfs.top;
        selection.y2 = Math.max(y1, y2) - imgOfs.top;
        selection.width = Math.abs(x2 - x1);
        selection.height = Math.abs(y2 - y1);
		
        $a.css({
            left: (selection.x1 + imgOfs.left) + 'px',
            top: (selection.y1 + imgOfs.top) + 'px',
            width: Math.max(selection.width - options.borderWidth * 2, 0) + 'px',
            height: Math.max(selection.height - options.borderWidth * 2, 0) + 'px'
        });
        $outLeft.css({ width: selection.x1 + 'px' });
        $outTop.css({ left: imgOfs.left + selection.x1 + 'px', width: selection.width + 'px', 
            height: selection.y1 + 'px' });
        $outRight.css({ left: imgOfs.left + selection.x2 + 'px', width: imgWidth - selection.x2 + 'px' });
        $outBottom.css({ left: imgOfs.left + selection.x1 + 'px', top: imgOfs.top + selection.y2 + 'px',
            width: selection.width + 'px', height: imgHeight - selection.y2 + 'px' });

        options.onSelectChange(img, selection);

        return false;        
    }

    function movingMouseMove(event)
    {
        x1 = Math.max(imgOfs.left, Math.min(moveX + event.pageX - startX,
            imgOfs.left + imgWidth - selection.width));
        y1 = Math.max(imgOfs.top, Math.min(moveY + event.pageY - startY,
            imgOfs.top + imgHeight - selection.height));
        x2 = x1 + selection.width;
        y2 = y1 + selection.height;

        selection.x1 = x1 - imgOfs.left;
        selection.y1 = y1 - imgOfs.top;
        selection.x2 = x2 - imgOfs.left;
        selection.y2 = y2 - imgOfs.top;

        $a.css({
            left: x1 + 'px',
            top: y1 + 'px',
            width: Math.max(x2 - x1 - options.borderWidth * 2, 0) + 'px',
            height: Math.max(y2 - y1 - options.borderWidth * 2, 0) + 'px'
        });
        $outLeft.css({ width: selection.x1 + 'px' });
        $outTop.css({ left: imgOfs.left + selection.x1 + 'px', width: selection.width + 'px', 
            height: selection.y1 + 'px' });
        $outRight.css({ left: imgOfs.left + selection.x2 + 'px', width: imgWidth - selection.x2 + 'px' });
        $outBottom.css({ left: imgOfs.left + selection.x1 + 'px', top: imgOfs.top + selection.y2 + 'px',
            width: selection.width + 'px', height: imgHeight - selection.y2 + 'px' });

        options.onSelectChange(img, selection);
        event.preventDefault();

        return false;
    }

    function imgMouseDown(event)
    {
        if (event.which != 1) return false;
		
        startX = x1 = event.pageX;
        startY = y1 = event.pageY;

        resize = [ ];
		
        $a.css({ width: '0px', height: '0px', left: x1, top: y1 });
        $outLeft.css({ width: x1 - imgOfs.left + 'px' });
        $outTop.css({ left: x1 + 'px', height: y1 - imgOfs.top + 'px', width: '0px' });
        $outRight.css({ left: x1 + 'px', width: imgOfs.left + imgWidth - x1 + 'px' });
        $outBottom.css({ left: x1 + 'px', top: y1 + 'px', width: '0px', height: imgOfs.top + imgHeight - y1 + 'px' });
        $a.add($o).show();
		// our hacks
		query_textbox.hide();
		autocomp.hide();
	
		// $("img#main_image").imgNotes();
		// 		$("img#main_image").imgAreaSelect({hide:true});
		//
        jQuery(document).mousemove(selectingMouseMove);
        $border2.unbind('mousemove', areaMouseMove);

        selection.x1 = selection.x2 = x1 - imgOfs.left;
        selection.y1 = selection.y2 = y1 - imgOfs.top;

        options.onSelectStart(img, selection);

        jQuery(document).one('mouseup', function () {
            if (options.autoHide)
                $a.add($o).hide();

            options.onSelectEnd(img, selection);

            jQuery(document).unbind('mousemove', selectingMouseMove);
            $border2.mousemove(areaMouseMove);
        });

        return false;
    }

    this.setOptions = function(newOptions)
    {
        
	options = jQuery.extend(options, newOptions);
	
        if (newOptions.x1 != null) {
            x1 = (selection.x1 = newOptions.x1) + imgOfs.left;
            y1 = (selection.y1 = newOptions.y1) + imgOfs.top;
            x2 = (selection.x2 = newOptions.x2) + imgOfs.left;
            y2 = (selection.y2 = newOptions.y2) + imgOfs.top;
            selection.width = x2 - x1;
            selection.height = y2 - y1;

            $a.css({
                left: x1 + 'px',
                top: y1 + 'px',
                width: Math.max(x2 - x1 - options.borderWidth * 2, 0) + 'px',
                height: Math.max(y2 - y1 - options.borderWidth * 2, 0) + 'px'
            });
            $outLeft.css({ width: selection.x1 + 'px' });
            $outTop.css({ left: x1 + 'px', width: selection.width + 'px', height: selection.y1 + 'px' });
            $outRight.css({ left: x2 + 'px', width: (imgWidth - selection.x2) + 'px' });
            $outBottom.css({ left: x1 + 'px', top: y2 + 'px', width: selection.width + 'px', height: (imgHeight - selection.y2) + 'px' });
            $a.add($o).show();

            options.onSelectChange(img, selection);
        }

        if (newOptions.hide) {
            $a.hide();
	    $outLeft.hide();
	    $outRight.hide();
	    $outTop.hide();
	    $outBottom.hide();
        } else if (newOptions.show) {
            $a.show();
	    $outLeft.hide();
	    $outRight.hide();
	    $outTop.hide();
	    $outBottom.hide();
	}

        $a.css({ borderWidth: options.borderWidth + 'px' });
        $area.css({ backgroundColor: options.selectionColor, opacity: options.selectionOpacity });       
        $border1.css({ borderStyle: 'solid', borderColor: options.borderColor1 });
        $border2.css({ borderStyle: 'dashed', borderColor: options.borderColor2 });
        $o.css({ opacity: options.outerOpacity, backgroundColor: options.outerColor });

        aspectRatio = options.aspectRatio && (d = options.aspectRatio.split(/:/)) ?
            d[0] / d[1] : null;

        if (options.disable || options.enable === false) {
            $a.unbind('mousemove', areaMouseMove).unbind('mousedown', areaMouseDown);
            jQuery(img).add($o).unbind('mousedown', imgMouseDown);
        }
        else if (options.enable || options.disable === false) {
            if (options.resizable || options.movable)
                $a.mousemove(areaMouseMove).mousedown(areaMouseDown);

            jQuery(img).add($o).mousedown(imgMouseDown);
        }

        options.enable = options.disable = undefined;
    };

    imgWidth = jQuery(img).width();
    imgHeight = jQuery(img).height();
    imgOfs = jQuery(img).offset();

    if (jQuery.browser.msie)
        jQuery(img).attr('unselectable', 'on');

    getZIndex();

    $a.add($o).css({ display: 'none', position: fixed ? 'fixed' : 'absolute', overflow: 'hidden', zIndex: zIndex });
    $area.css({ borderStyle: 'solid' });
    $outLeft.css({ left: imgOfs.left + 'px', top: imgOfs.top + 'px', height: imgHeight + 'px' });
    $outTop.css({ top: imgOfs.top + 'px' });
    $outRight.css({ top: imgOfs.top + 'px', height: imgHeight + 'px' });

    jQuery('body').append($o);
    jQuery('body').append($a);

    initOptions = {
        borderColor1: '#000',
        borderColor2: '#fff',
        borderWidth: 1,
        movable: true,
        resizable: true,
        selectionColor: '#fff',
        selectionOpacity: 0.2,
        outerColor: '#000',
        outerOpacity: 0.2,
        onSelectStart: function () {},
        onSelectChange: function () {},
        onSelectEnd: function () {}
    };

    options = jQuery.extend(initOptions, options);
    this.setOptions(options);
};

jQuery.fn.imgAreaSelect = function (options) {
    options = options || {};

    this.each(function () {
        if (jQuery(this).data('imgAreaSelect')){
            jQuery(this).data('imgAreaSelect').setOptions(options);
        } else {
            if (options.enable === undefined && options.disable === undefined)
                options.enable = true;
            jQuery(this).data('imgAreaSelect', new jQuery.imgAreaSelect(this, options));
		
        }
    });
    return this;
};
