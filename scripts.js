/*
*		FUNÇÕES PARA O FUNCIONAMENTO DO JOGO

*		NECESSÁRIO A INCLUSÃO DA BIBLIOTECA JQUERY
*		https://github.com/danilobd/bloquinhos-js
*/

$(document).ready(function(){


	/*
	*	FUNÇÃO DE CAPTURAR TECLAS
	*/
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

	/*
	*	FUNÇÃO DE REASTREAR O MOUSE
	*/
	function MouseTrack(){

		$(document).mousemove(function(element){

			//PEGA A POSIÇÃO DO MOUSE NA HORIZONTAL
			var MouseX = element.pageX;

			//MOVIMENTA O PERSONAGEM NA HORIZONTAL DE ACORDO COM O MOUSE
			$("#personagem").css('margin-left', (MouseX-50) );


		});

	}


	/*
	*	FUNÇÃO DE RESTREAR O VILÃO
	*/
	function RastreiaVillain(element, Duracao){
		
		//CAPTURA A POSIÇÃO DO VILÃO
		var villainx 	= parseInt( $(element).css("margin-left") );
		var villainy 	= parseInt( $(element).css("top") );

		//CAPTURA A POSIÇÃO DO PERSONAGEM
		var left 		= parseInt( $("#personagem").css("margin-left") );
		var largura 	= parseInt( $("#personagem").css("width") );
		
		var altura 		= parseInt( $("#canvas").css("height") );
		altura 			-= parseInt( $("#personagem").css("height") );
		altura 			-= parseInt( $(".villain").css("height") );

		//VERIFICA SE O VILÃO CAIU QUANDO ESTAVA NA MESMA ÁREA DO PERSONAGEM
		if( (villainx >= left-45 && villainx <= (left+largura) ) && villainy >= altura){
			
			//SE ESTAVA, FINALIZA O JOGO CHAMANDO A TELA INICIAL
			HomeScreen();

		}else{
			
			//SE NÃO, REVEMO O BLOQUINHO
			$(element).remove();

			//E CHAMA A FUNÇÃO PARA FAZER OUTRO
	        MakeVillain(Duracao);

		}
		
	}

	/*
	*	FUNÇÃO DE ANIMAR O VILÃO
	*/
	function AnimeVillain(element, Duracao){
		
		Loop++; //QUANTOS PERSONAGEM APARECERAM
		console.log("Lopp: "+Loop);

		//ADICIONA +1 NO CONTADOR DE BLOQUINHOS
		$("#statusbox h1").text(Loop);

		//ALMENTA VELOCIDADE NOS MULTIPLOS DE 10
		if( (Loop/Duracao)%1 == 0 && Loop != 0){//SE O RESTO DA DIVISÃO, DA QUANTIDADE DE BLOQUINHOS DIVIDIDOS POR 10(Duracao) FOR 0 = NÚMERO MULTIPLO DE DEZ

			Nivel++;
	
			//DIMINUE A VELÔCIDADE DE ACORDO COM A VELÔCIDADE ATUAL

			if(Velocidade >= 1000){
				Velocidade = Velocidade-200;
			}

			else if(Velocidade >= 500){
				Velocidade = Velocidade-50;
			}

			else if(Velocidade <= 500 && Velocidade >= 300){
				Velocidade = Velocidade-5;

				//VELOCIDADE BEM RÁPIDA, ATERAR AS CORES
				$("#canvas").css("background-color", "#464343");
				$("#chao").css("background-color", "rgb(49, 78, 47)");
			}

			console.log("Aumenta Velocidade: "+Velocidade);
		}

		//RETORNA O TAMANHO DO COMEÇO DE 'CANVAS' ATÉ O VINAL DE 'CHÃO'
		FinalDaPagina = parseInt( $("#canvas").css('height') ) + parseInt( $("#chao").css('height') ) + 50 + "px";

		//ANIMA A QUEDA DO BLOQUINHO DO COMEÇO DÁ PÁGINA ATÉ O FINAL
		$(element).animate(
			{ 
	    		opacity: 1,
	    		top: FinalDaPagina,
	    	},
	    	{
	            duration: Velocidade, // how fast we are animating
	            easing: 'linear', // the type of easing
	            complete: function() { // the callback

	            	//QUANDO TERMINAR, CHAMA A FUNÇÃO PARA COMPARAR AS LOCALIZAÇÕES DOS BLOQUINHOS
	                RastreiaVillain(element, Duracao);

	        	}
	     	}
	     );

	}

	/*
	*	FUNÇÃO DE CRIAR O VILÃO
	*/
	function MakeVillain(Duracao){

		function PegaLocalizacaoDoPersonagem(){

			//PEGA A MARGIN-LEFT DO BLOQUINHO DO JOGADOR 
			var Left = parseInt( $("#personagem").css("margin-left") ) ;

			//ESTABELECE PERIMETRO DE QUEDA DE -150px ATÉ +200px SOBRE APOSIÇÃO DO PERSONAGEM
			min = Math.ceil(Left-150);//de
			max = Math.floor(Left+200);//até

			//VERIFICA SE A POSIÇÃO DO BLOQUINHO VILÃO VAI NASCER NÃO É MAIOR DO QUE A TELA
			if(max >= parseInt( $("#canvas").css("width") )-10 ) // se maior que a janela
				max = parseInt( $("#canvas").css("width") ); //limita até o tamanho da jenela pra não ultrapasar

			if(min < 0)
				min = 0;

			//RETORNA UM NÚMERO ALEATÓRIO ENTRE A PERIMETRO DE QUEDA EM CIMA DO PERSONAGEM
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

		//CHAMA A FUNCÃO DE ANIMAÇÃO DO VILÃO
		AnimeVillain(Villain, Duracao);

		return 0;

	}

	/*
	*	FUNÇÃO DE INICIAR O JOGO
	*/
	function Start(){

		Nivel 		= 1;
		Loop 		= 0;
		Velocidade 	= 1000; //VELOCIDADE DE QUEDA DOS BLOQUINHOS INICIAL

		//MUDA O PONTEIRO DO MOUSE
		$("#canvas").css('cursor', 'ew-resize');
		

		//CRIA O BLOQUINHO DO JOGADOR
		var personagem 	= $("<div>");
		$(personagem).css({
			'width': '10vh',
			'height': '15vh',
			'background-color': '#ff003f',
			'position': 'absolute',
			'border-radius': '4px',
			'bottom': '10vh',
			'margin-left': '45%',
		});
		$(personagem).attr("id", "personagem");
		$(canvas).html(personagem);
		
		//CRIA A CAIXA QUE MOSTRA OS PONTOS
		var statusbox 	= $("<div>");
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
		$(statusbox).attr("id", "statusbox");
		$(statusbox).html("<h1>1</h1>");
		$(canvas).append(statusbox);


		//CHAMA A FUNÇÃO DE RASTREAR O MOUSE
		MouseTrack();

		//CHAMA A FUNÇÃO DE CAPTURAR AS TECLAS
		KeybordTrack();

		//MENSAGEM DE INSTRUÇÃO NO COMEÇO
		var mensagem	= $("<h1>");
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
		$(canvas).append(mensagem);
		
		//ANIMA A MENSAGEM
		$(mensagem).animate({ opacity: 0.8,},{

            duration: 1800, // how fast we are animating
            easing: 'linear', // the type of easing
            complete: function() { // the callback
                
                //QUANDO A ANIMAÇÃO TERMINAR
            	$(mensagem).remove(); //REMOVE A MENSAGEM
				
				//CHAMA A FUNÇÃO DE CRIAÇÃO DO VILÃO
				MakeVillain(10);

        	}
	    });

	}

	/*
	*	FUNÇÃO DE TELA INICIAL
	*/
	function HomeScreen(){


		//DIV DE INICIO DO JOGO
		var tela = $("<div>");
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
		$("#canvas").html(tela);


		//BOTÃO DE INICIAR JOGO
		var startbutton = $("<button>");
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
		$(tela).append(startbutton);
		

		//VOLTA PARA AS CORES NORMAIS CASO TENHA MUDADO
		$("#canvas").css({
			'cursor': 'default',
			'background-color': 'rgb(75, 181, 217)',
		});
		$("#chao").css("background-color", "rgb(58, 130, 51)");
		
		

	}

	function Main(){

		//CRIA A DIV DO JOGO
		var canvas = $("<div>");
		$(canvas).css({
			'width': '100%',
			'height': '90vh',
			'background-color': '#4bb5d9',
			'overflow': 'hidden'
		});
		$(canvas).attr("id", "canvas");
		$("body").append(canvas);


		//CRIA A DIV DO CHÃO
		var chao = $("<div>");
		$(chao).css({
			'width': '100%',
			'height': '10vh',
			'background-color': 'rgb(58, 130, 51)',
			'position': 'absolute',
		});
		$(chao).attr("id", "chao");
		$("body").append(chao);
		

		//MINHA LOGO
		var mylogo = $("<a>");
		$(mylogo).attr({
			"href": "https://danbd.me",
			"target": "_blank",
			"title": "Make by DANBD",
		});
		$(mylogo).html('<img style="width: 9vh; padding: 2.5vh; float: right;" src="https://danbd.me/images/Minha_logo_trasparente_cortata_branca.png">');
		$(chao).append(mylogo);


		//CRIA AS NUVENS
		var nuvem1	= $("<div>");
		var nuvem2	= $("<div>");
		var nuvem3	= $("<div>");
		$(nuvem1).css('margin', '7vh 0vh 0vh 17%');
		$(nuvem2).css('margin', '13vh 0vh 0vh 50%');
		$(nuvem3).css('margin', '7vh 0vh 0vh 86%');
		$(nuvem1).attr("class", "nuvem");
		$(nuvem2).attr("class", "nuvem");
		$(nuvem3).attr("class", "nuvem");
		$("body").append(nuvem1);
		$("body").append(nuvem2);
		$("body").append(nuvem3);



		//CHAMA A FUNÇÃO DE TELA INICIAL
		HomeScreen();


		//INICIA O JOGO PELO BOTÃO 'ENTER'
		$(document).keydown(function(e){

			if(e.which === 13)
				Start();

		});

		//INICIA AO CLICAR NO BOTÃO 'INICIAR JOGO'
		$("#startbutton").on("click", function(){

			Start();

		});

	}

	//CHAMA A FUNÇÃO 'MAIN'
	Main();

});