$(document).ready(function(){

	function KeybordTrack(){

		var MaxWidth = parseInt( $("#canvas").css("width") );

		$(document).keydown(function(e){

			
			var PersonagemLeft 	= parseInt( $("#personagem").css("margin-left") );


			switch(e.which){
				case 38://CIMA

					e.preventDefault();
					
				break;
				case 40://BAIXO
				
					e.preventDefault();
				
				break;
				case 37://ESQUERDA
					
					e.preventDefault();
			
					if( (PersonagemLeft-150) < 7)
						$("#personagem").css("margin-left", '7px');
					else
						$("#personagem").css("margin-left", (PersonagemLeft-150) );

				break;
				case 39://DIRETA
					
					e.preventDefault();
					
					if( (PersonagemLeft+150) >= (MaxWidth-100))
						$("#personagem").css("margin-left", (MaxWidth-100));
					else
						$("#personagem").css("margin-left", (PersonagemLeft+150) );


				break;
			}


		});

	}

	function Dev(){


		var statusbar 			= $("<div>");
		var statusbarMouse 		= $("<div>");
		var statusbarKeybord 	= $("<div>");

		var linhaX 		= $("<hr>");
		var linhaY 		= $("<hr>");
		
		$(statusbar).attr('id', "statusbar");

		$(linhaX).attr('id', "linhaX");
		$(linhaY).attr('id', "linhaY");
		

		$(statusbar).css({
			'top': '0',
			'width': '100%',
			'height': '50px',
			'background-color': '#535252',
			'position': 'fixed',
			'color': 'white',
			'text-align': 'center',
			'line-height': '50px'
		});

		$(statusbarMouse).css({
			'width': '50%',
			'float': 'left'
		});

		$(statusbarKeybord).css({
			'width': '50%',
			'float': 'right',
			'text-align': 'left'
		});

		$(linhaX).css({
			'color': 'red',
			'position': 'absolute',
			'width': '100%',
			'border': '0',	
			'border-bottom': '1px solid'
		});
		
		$(linhaY).css({
			'color': 'blue',
			'position': 'absolute',
			'width': '0',
			'height': '100%',
			'border': '0px',
			'border-right': '1px solid'
		});


		$("body").append(statusbar);
		$("#statusbar").append(statusbarMouse);
		$("#statusbar").append(statusbarKeybord);
		

		$("body").append(linhaX);
		$("body").append(linhaY);

		$(document).mousemove(function(e){

			var MouseX = e.pageX;
			var MouseY = e.pageY;

			$("#linhaX").css("height", MouseY);//VERMELHA
			$("#linhaY").css("width", MouseX); //AZUL

			$(statusbarMouse).html("Mouse ->  X: "+MouseX+" Y: "+MouseY);

		});

		$(document).keydown(function(e){

			switch(e.which){
				case 38://CIMA
					var tecla = "Cima";
				break;
				case 40://BAIXO
					var tecla = "Baixo";
				break;
				case 37://ESQUERDA
					var tecla = "Esquerda";
				break;
				case 39://DIRETA
					var tecla = "Direita";
				break;
				default:
					var tecla = String.fromCharCode(e.which)+" ("+e.which+")";
				break;
			}

			$(statusbarKeybord).html("Teclado -> "+tecla);

		});

	}

	function MouseTrack(){

		$(document).mousemove(function(element){

			
			var MouseX = element.pageX;
			var MouseY = element.pageY;

			$("#personagem").css({
				'margin-top': MouseY,
				'margin-left': MouseX-50,
			})


		});

	}

	function RastreiaVillain(element, Duracao){
		
		var villainx= parseInt( $(element).css("margin-left") );
		var villainy= parseInt( $(element).css("top") );

		var left 	= parseInt( $("#personagem").css("margin-left") );
		var largura = parseInt( $("#personagem").css("width") );
		var altura 	= parseInt( $("#canvas").css("height") );

		altura -= parseInt( $("#personagem").css("height") );
		altura -= parseInt( $(".villain").css("height") );

		if( (villainx >= left-45 && villainx <= (left+largura) ) && villainy >= altura){
			
			HomeScreen();

		}else{
			
			$(element).remove();
	        MakeVillain(Duracao);

		}
		
	}


	function AnimeVillain(element, Duracao){
		
		Loop++; //Quantos personagem apareceram
		console.log("Lopp: "+Loop);

		$("#statusbox h1").text(Loop);

		if( (Loop/Duracao)%1 === 0 && Loop != 0){

			Nivel++;

			//$("#statusbox h1").text(Nivel);
			
			if(Velocidade >= 1000){
				Velocidade = Velocidade-200;
			}

			else if(Velocidade >= 500){
				Velocidade = Velocidade-50;
			}

			else if(Velocidade <= 500 && Velocidade >= 300){
				Velocidade = Velocidade-5;

				$("#canvas").css("background-color", "#464343");
				$("#chao").css("background-color", "rgb(49, 78, 47)");
			}

			console.log("Aumenta Velocidade: "+Velocidade);
		}

		Final = parseInt( $("#canvas").css('height') ) + parseInt( $("#chao").css('height') ) + 50 + "px";
		

		$(element).animate(
			{ 
	    		opacity: 1,
	    		top: Final,
	    	},
	    	{
	            duration: Velocidade, // how fast we are animating
	            easing: 'linear', // the type of easing
	            complete: function() { // the callback
	                RastreiaVillain(element, Duracao);
	        	}
	     	}
	     );

	}


	function MakeVillain(Duracao){

		function PegaLocalizacaoDoPersonagem(){

			var Left = parseInt( $("#personagem").css("margin-left") ) ;

			//ALEATÓRIO EM CIMA DO PERSONAGEM
			min = Math.ceil(Left-150);//de
			max = Math.floor(Left+200);//até

			//ALEATÓRIO EM QUALQUER LUGAR
			/*min = Math.ceil(10);//de
			max = Math.floor( parseInt( $("#canvas").css("width") ) );//até*/

			if(max >= parseInt( $("#canvas").css("width") )-10 ) //se maior que a janela
				max = parseInt( $("#canvas").css("width") ); //limita até o tamanho da jenela pra não ultrapasar

			if(min < 0)
				min = 0;

			return Math.floor(Math.random() * (max - min)) + min;

		}

		var aleatorio = PegaLocalizacaoDoPersonagem();

		var Villain = $('<div>');

		$(Villain).css({
			'width': '4vh',
			'height': '14vh',
			'background-color': '#fffe00',
			'border-radius': '4px',
			'margin-left': aleatorio,
			'top': '0vh',
			'position': 'absolute',
		});
		$(Villain).attr("class", "villain")

		$(canvas).append(Villain);

		AnimeVillain(Villain, Duracao);

		return 0;

	}


	function Start(){

		var personagem 	= $("<div>");
		var statusbox 	= $("<div>");
		var statusboxh1 = $("<h1>");
		var mensagem	= $("<h1>");

		Nivel 		= 1;
		Loop 		= 0;
		Velocidade 	= 1000;


		$(personagem).css({
			'width': '10vh',
			'height': '15vh',
			'background-color': '#ff003f',
			'position': 'absolute',
			'border-radius': '4px',
			'bottom': '10vh',
			'margin-left': '45%',
		});

		$(statusbox).css({
			'width': '15vh',
			'height': '5vh',
			'background-color': 'white',
			'float': 'right',
			'padding': '2em',
			'margin': '1em',
			'opacity': '0.5',
			'color': 'black',
			'border-radius': '8px',
			'text-align': 'center',
		});



		$(mensagem).css({
			'text-align': 'center',
			'top': '0px',
			'position': 'absolute',
			'left': '0px',
			'right': '0px',
			'bottom': '0px',
			'margin-top': '45vh',
			'text-transform': 'uppercase',
			'font-size': '2.5vh',
			'color': 'white',
			'text-shadow': '0px 0px 7px #CCC',
			'font-family': 'Comic Sans MS, Arial',
		});
		
		$(mensagem).text("Devie dos bloquinhos");
		

		$(personagem).attr("id", "personagem");
		
		$(statusbox).attr("id", "statusbox");

		$(canvas).html(personagem);
		
		$(canvas).append(statusbox);
			$(statusbox).html(statusboxh1);
			$(statusboxh1).text(Nivel);

		$(canvas).append(mensagem);

		$("#canvas").css('cursor', 'ew-resize');

		MouseTrack();
		KeybordTrack();

		$(mensagem).animate(
		{ 
    		opacity: 0.8,
    	},
    	{
            duration: 1800, // how fast we are animating
            easing: 'linear', // the type of easing
            complete: function() { // the callback
                
                $(mensagem).remove();
				MakeVillain(10);

        	}
     	}
     );

	}

	function HomeScreen(){

		var tela 		= $("<div>");
		var startbutton = $("<button>");
		
		
		$("#canvas").css({
			'cursor': 'default',
			'background-color': 'rgb(75, 181, 217)',
		});

		$("#chao").css("background-color", "rgb(58, 130, 51)");

		$(tela).attr("id", "homescreen");
		
		$(tela).css({
			'width': '75vh',
			"height": "45vh",
			"background-color": "#47d2e5",
			"margin": "23vh auto auto auto",
			"border-radius": "10px",
			"box-shadow": "0px 0px 3px 1px #FFF",
			"text-align": "center"
		});

		

		$(startbutton).text("Iniciar Jogo");

		$(startbutton).css({
			'padding': '3vh 4vh',
			'font-size': '2.4vh',
			'text-transform': 'uppercase',
			'border': '0px solid green',
			'background-color': 'white',
			'border-radius': '4px',
			'margin-top': '25%',
			'color': 'rgb(71, 210, 229)',
			'cursor': 'pointer',
			'margin-left': 'auto',
			'margin-right': 'auto',
			'font-family': 'Comic Sans MS, Arial',
		})

		$(startbutton).attr("id", "startbutton");

		$("#canvas").html(tela);

		$(tela).append(startbutton);

	}

	function Main(){

		//Dev();

		var canvas 	= $("<div>");
		var chao	= $("<div>");
		var logo	= $("<img>");

		var nuvem1	= $("<div>");
		var nuvem2	= $("<div>");
		var nuvem3	= $("<div>");

		$(canvas).css({
			'width': '100%',
			'height': '90vh',
			'background-color': '#4bb5d9',
			'overflow': 'hidden'
		});

		$(chao).css({
			'width': '100%',
			'height': '10vh',
			'background-color': 'rgb(58, 130, 51)',
			'position': 'absolute',
		});

		$(logo).css({
		    'width': '9vh',
			'padding': '2.5vh',
			'float': 'right',
		})

		$(logo).attr({
			"src": "https://localhost/ufg/Minha_logo_trasparente_cortata_branca.png",
			"title":"Make by DANBD",
		});

		$(nuvem1).css({
			'margin': '7vh 0vh 0vh 17%',
		});

		$(nuvem2).css({
			'margin': '13vh 0vh 0vh 50%',
		});

		$(nuvem3).css({
			'margin': '7vh 0vh 0vh 86%',
		});

		$(canvas).attr("id", "canvas");
		$(chao).attr("id", "chao");
		
		$(nuvem1).attr("class", "nuvem");
		$(nuvem2).attr("class", "nuvem");
		$(nuvem3).attr("class", "nuvem");

		$("body").append(canvas);
		$("body").append(chao);
		$(chao).append(logo);
		
		$("body").append(nuvem1);
		$("body").append(nuvem2);
		$("body").append(nuvem3);

		HomeScreen();

		//INICIA PELO BOTÃO 'ENTER'
		$(document).keydown(function(e){

			if(e.which === 13)
				Start();

		});

		//INICIA AO CLICAR NO BOTÃO 'INICIAR JOGO'
		$("#startbutton").on("click", function(){

			Start();

		});

	}

	Main();

});