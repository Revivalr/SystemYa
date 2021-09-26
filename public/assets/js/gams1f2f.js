var ifr = document.querySelector('#ifr'),
	obj = document.querySelector('#fla');
 
ifr.setAttribute('src', 'about:blank');

document.querySelectorAll('.place').forEach(node => {
	var data = node.getAttribute('data').split('&&'),
		type = data[0],
		path = atob(data[1]);
	
	node.addEventListener('click', () => {
		obj.style.display = ifr.style.display = 'none';
		document.querySelectorAll('.container').forEach(node => node.style.display = 'none');
		
		type == 'flash' ? (obj.style.display = 'block', obj.innerHTML = '<param name="movie" value="' + path + '"><embed src="' + path + '" width="100%" height="100%"></embed>') : (ifr.style.display = 'block', ifr.src = path);
	});
});