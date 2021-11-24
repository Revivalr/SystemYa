var add_proto = url => encodeURI(!/^(?:f|ht)tps?\:\/\//.test(url) ? 'https://' + url : url),
	ifr = document.querySelector('#ifr'),
	floating_button = document.querySelector('.floating-button'),
	url_input = document.querySelector('.url-input'),
	url_invalid_feedback = document.querySelector('.invalid-feedback'),
	form = document.querySelector('.form'),
	button_container = document.querySelector('.button-container'),
	visit = type =>{
		if(!url_input.value){
			url_input.setAttribute('class', url_input.getAttribute('class') + ' invalid');
			url_invalid_feedback.style.display = 'block'
			url_invalid_feedback.style.margin = '0.6rem 0.25rem'
			url_invalid_feedback.style['font-size'] = '0.9rem'
			
			return
		}else{
			url_input.setAttribute('class', url_input.getAttribute('class').replace(/ invalid/g, ''));
			url_invalid_feedback.setAttribute('style', '');
		}
		
		var url_value = add_proto(url_input.value),
			new_cookie = '',
			new_src = '';
		
		floating_button.style['background-image']='url("/assets/src/' + type.toLowerCase() + '.webp?")';
		switch(type){
			case'PD':
				new_cookie = 'oldsmobile=badcar; max-age=259200; sameSite=lax; domain=' + purl + '; path=/; secure;';
				new_src = 'https://c.' + purl + '/' + url_value
				
				break
			case'PP':
				new_src = '/sci/?prou=' + url_value
				
				break
			case'NU':
				new_src = '/;/' + url_value
				
				break
			case'PM':
				new_cookie = 'oldsmobile=1; expires=' + (Date.now() + 259200) + '; sameSite=lax; domain=.' + purl + '; path=/; secure;'
				new_src = 'https://c.' + purl + '/prox1?url=' + url_value
				
				break
			case'AP':
				new_cookie = '__alloy_client=human; expires=' + (Date.now() + 259200) + '; sameSite=lax; domain=.' + purl + '; path=/; secure;';
				
				document.cookie = 'oldsmobile=2; expires=' + (Date.now() + 259200) + '; sameSite=lax; domain=.' + purl + '; path=/; secure;';
				
				new_src = 'https://c.' + purl + '/get/' + btoa(add_proto(url_value));
				
				break
		}
		
		document.cookie = new_cookie
		
		setTimeout(() => ifr.setAttribute('src', new_src), 250);
		
		floating_button.style.display = 'block'
		ifr.style.display = 'block'
		floating_button.style.opacity = '0'
		ifr.style.opacity = '0'
		setTimeout(()=>{
			floating_button.style.opacity = '0.7'
			ifr.style.opacity = '1'
		},20);
		document.body.style['overflow-y'] = 'hidden'
	};

// add buttons to visit URL
Array.from(document.querySelectorAll('button.btn')).forEach(button=>{
	button.addEventListener('click',()=>{
		visit(atob(button.getAttribute('data')));
	});
});

// recommended sites
Array.from(document.querySelectorAll('.link-box')).forEach(element=>{
	var URL = atob(element.firstChild.getAttribute('data'));
	
	element.addEventListener('click', e=>{
		url_input.value = URL
	});
});

// hide feedback when user begins typing
url_input.addEventListener('keydown', ()=>{
	url_input.setAttribute('class', url_input.getAttribute('class').replace(/ invalid/g, ''));
	url_invalid_feedback.setAttribute('style', '');
});

// floating icon to get back to input page
floating_button.addEventListener('click',()=>{
	document.body.style['overflow-y']='initial'
	ifr.style.opacity = '0'
	floating_button.style.opacity = '0'
	
	// animation stuff
	setTimeout(()=>{
		ifr.style.display = 'none'
		floating_button.style.display = 'none'
		ifr.setAttribute('src', 'about:blank');
	},200);
});