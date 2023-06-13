function guiinit(){
	var dialwidth = parseInt($('.col-sm-1').css('width')) - ( parseInt($('.col-sm-1').css('width')) / 6);
	
	var settings = {
		'min':0,
		'max':100,
		'width' : dialwidth,
		"displayInput" :  false,
		"angleArc" : 180,
		"angleOffset" : -90
	};

	var bg = '#E4E4E4';
	var fg = '#2a6496';
	$("#loudness").knob({
		'min':1,
		'max':100,
		'width' : dialwidth,
		"displayInput" :  false,
		"val": 50,
		"angleArc" : 180,
		"angleOffset" : -90,
		'bgColor': bg,
		'fgColor': fg,
		"change": function(v){
			loudness = v / 100;
			
		}
	});
	$("#attack").knob({
		'min':1,
		'max':100,
		'width' : dialwidth,
		"displayInput" :  false,
		"val": 50,
		"angleArc" : 180,
		"angleOffset" : -90,
		'bgColor': bg,
		'fgColor': fg,
		"change": function(v){
			attack = v / 100;
			
		}
	});
	
	$("#release").knob({
		'min':1,
		'max':100,
		'width' : dialwidth,
		"displayInput" :  false,
		"val": 50,
		"angleArc" : 180,
		"angleOffset" : -90,
		'bgColor': bg,
		'fgColor': fg,
		"change": function(v){
			release = v / 100;
			
		}
	});
	$('#density').knob({
		'min':0,
		'max':100,
		'width' : dialwidth,
		"displayInput" :  false,
		"val": 50,
		"angleArc" : 180,
		"angleOffset" : -90,
		'bgColor': bg,
		'fgColor': fg,
		"change": function(v){
			density = v / 100;
			
		}
	});
	$('#spread').knob({
		'min':0,
		'max':200,
		'width' : dialwidth,
		"displayInput" :  false,
		"val": 50,
		"angleArc" : 180,
		"angleOffset" : -90,
		'bgColor': bg,
		'fgColor': fg,
		"change": function(v){
			spread = v / 1000;
			//spread = v / 100;

			
		}
	});
	$('#pan').knob({
		'min':0,
		'max':200,
		'width' : dialwidth,
		"displayInput" :  false,
		"val": 50,
		"angleArc" : 180,
		"angleOffset" : -90,
		'bgColor': bg,
		'fgColor': fg,
		"change": function(v){
			pan = v / 100;

			
		}
	});
	
	$('#minus').click(function(){
		trans = trans * 0.5;
		$('#minus').css('opacity',0.3);
		setTimeout(function(){
			$('#minus').css('opacity',1);
		},200);
	});

	$('#plus').click(function(){
		trans = trans * 2;
		$('#plus').css('opacity',0.3);
		setTimeout(function(){
			$('#plus').css('opacity',1);
		},200);
	});

	var minus = document.getElementById('minus');
	minus.addEventListener('touchstart',function(e){
		e.preventDefault();
		$('#minus').css('opacity',0.3);
		trans = trans * 0.5;
	});
	minus.addEventListener('touchend',function(e){
		e.preventDefault();
		$('#minus').css('opacity',1);
	});

	var plus = document.getElementById('plus');
	plus.addEventListener('touchstart',function(e){
		e.preventDefault();
		$('#plus').css('opacity',0.3);
		trans = trans * 2;
	});
	plus.addEventListener('touchend',function(e){
		e.preventDefault();
		$('#plus').css('opacity',1);
	});


	function load(){
		$('#canvas').show();
		$('#canvas2').show();

		$('#canvas').animate({
			opacity : 1
		},1000);

		$('#canvas2').animate({
			opacity : 1
		},1000);

		$('#help').animate({
			opacity : 0
		},1000,function(){
			$('#help').hide();
			helpvisible = false;
		});
	}

	$('#canvas2').hide();
	$('#canvas').hide();
	$('#helpbutton').click(function(){
		if(helpvisible){
			load();
			helpvisible = false;

		}else{
			//$('#help').css('opacity','0');
			$('#canvas2').animate({
				opacity:0.1
			},1000,function(){
				$('#help').css('opacity',0);
				
				$('#canvas2').hide();
				$('#help').animate({
					opacity : 1
				},1000);

				$('#help').show();
				
			});

			$('#canvas').animate({
				opacity:0.0
			},1000,function(){
				$('#help').show();
				$('#canvas').hide();
			});
			
			helpvisible = true;
		}
		
	});
	
	$('.sample').hover(function(){
		$(this).css('opacity','0.5');
	},function(){
		$(this).css('opacity','1');
	});


	$('#sample1').click(function(){
		load();
	});

	$('#sample2').click(function(){
		//loading the sound with XML HTTP REQUEST

		var request = new XMLHttpRequest();
			request.open('GET','audio/synth.mp3',true);
			request.responseType = "arraybuffer";
			request.onload = function(){
				context.decodeAudioData(request.response,function(b){
					buffer = b; //set the buffer
					data = buffer.getChannelData(0);
					getDensity();
					isloaded = true;
					var canvas1 = document.getElementById('canvas');
					//initialize the processing draw when the buffer is ready
					var processing = new Processing(canvas1,waveformdisplay);
					load();

				},function(){
					console.log('loading failed');
					alert('loading failed');
					
				});
			};
		request.send();
		

	});

	//drop
	var drop = document.getElementById('waveform');

	drop.addEventListener("dragover",function(e){
    //prevents from loading the file in a new page
   	 e.preventDefault();
	},false);
	drop.addEventListener('drop',function(e){
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		var reader = new FileReader();
    	reader.onload = function(e){
    		var array = e.target.result;
    		context.decodeAudioData(array,function(b){
    			
    			buffer = b
    			data = buffer.getChannelData(0);
                getDensity();
    			var canvas1 = document.getElementById('canvas');
    			var processing = new Processing(canvas1,waveformdisplay);
    			load();

    		},function(){
    			console.log('loading failed');
    			alert('loading failed');
    		});
    	}
    	reader.readAsArrayBuffer(file);
	},false);

}
function getDensity() {
	let sum = 0;
	for (let i = 0; i < Math.floor(data.length / testDuration); i ++) {
		//console.log(data[i * testDuration]);
		//console.log(RMS(data, testDuration * i,testDuration)+ " rms");

		densitySum.push(RMS(data, testDuration * i,testDuration) + ((i !=0) ? densitySum[i-1] : 0));
		//console.log(densitySum[i]);
	}
	sum = densitySum[Math.floor(data.length / testDuration) -1];
	//console.log(sum + " what we think sum is");
	for (let i = 0; i < Math.floor(data.length / testDuration); i ++) {
		//console.log(densitySum[i]);
		densitySum[i] /= sum;
		//console.log(densitySum[i]);
	}
}
function RMS(samples, offset, granuleDuration) {
	let sum = 0;
	for (let j = offset; j < offset + granuleDuration; j++) {
		sum += Math.pow(samples[j], 2);
	}
	sum /= granuleDuration;
	sum = Math.sqrt(sum);
	//console.log(sum + " sum");
	return sum;
  }