(async () => {
	var dropdowns, vmToolbar, profile_data, clickables, main_obj, main_obj_close, main_v86_filePicker, main_v86_screen_container, main_v86_text_display, main_v86_vga_display, emulator, fullScr, srcshot, saveState, loadStateFile, loadingInterval, loadingMsg, loadVM;
	
	
	dropdowns = Array.from(document.getElementsByClassName('dropdown-button'));
	vmToolbar = document.getElementById('vm-toolbar');
	profile_data = await fetch('/utils/v86/profile_data.json').then(res => res.json());

	window.addEventListener('click', (e)=>{
		activeEle = e.target;
		
		dropdowns.forEach((element, index)=>{
			var attrs = element.getAttribute('data').split(' '),
				menuEle = document.getElementById(attrs[0]);
			
			
			if(activeEle != element){
				menuEle.style.display = 'none'
				element.setAttribute('open', false);
			}
		});
	});

	dropdowns.forEach((element, index)=>{
		var attrs = element.getAttribute('data').split(' '),
			menuEle = document.getElementById(attrs[0]);
		
		menuEle.style.display = 'none'
		
		element.addEventListener('click', ()=>{
			element.setAttribute('open', !(element.getAttribute('open') == 'true') );
			
			if(element.getAttribute('open') == 'true'){
				menuEle.style.display = 'block'
			}else{
				menuEle.style.display = 'none'
			}
		});
	});

	clickables = Array.from(document.getElementsByClassName('clickable'))
	main_obj = document.querySelector('.wrapper').appendChild(document.createElement('iframe'))
	main_obj_close = document.querySelector('.wrapper').appendChild(document.createElement('div'))
	main_v86_filePicker = document.querySelector('.wrapper').appendChild(document.createElement('input'))
	main_v86_screen_container = document.querySelector('.wrapper').appendChild(document.createElement('div'))
	main_v86_text_display = main_v86_screen_container.appendChild(document.createElement('div'))
	main_v86_vga_display = main_v86_screen_container.appendChild(document.createElement('canvas'))
	emulator = null
	
	main_v86_filePicker.style.display = 'none'
	main_v86_filePicker.setAttribute('type', 'file');

	main_v86_filePicker.addEventListener('change', ()=>{
		if(main_v86_filePicker.files.length && emulator != null){
			var filereader = new FileReader();
			
			emulator.stop();
			
			filereader.addEventListener('load', (e)=>{
				emulator.restore_state(e.target.result);
				emulator.run();
			});
			
			filereader.readAsArrayBuffer(main_v86_filePicker.files[0]);
		}
	});

	main_obj.setAttribute('type', 'text/html');
	main_obj.setAttribute('class', 'util');
	
	main_obj_close.setAttribute('class', 'util_close material-icons');
	main_obj_close.innerHTML = 'close'

	main_v86_screen_container.setAttribute('class', 'util-v86-screen');
	profile_data.base_profile.screen_container = main_v86_screen_container

	main_v86_text_display.setAttribute('class', 'util-v86-text ns');
	main_v86_vga_display.setAttribute('class', 'util-v86-vga');

	main_obj_close.addEventListener('click', ()=>{
		main_obj.setAttribute('src', 'about:blank');
		main_obj.style.display = 'none'
		main_obj_close.style.display = 'none'
		vmToolbar.style.display = 'none';
		
		if(emulator != null){
			emulator.stop();
			emulator.destroy();
			emulator = null;
			
			main_v86_screen_container.style.display = 'none'
		}
		
		Array.from(document.getElementsByClassName('container')).forEach(e=>{
			e.style.display = null // remove this attribute
		});
	});

	main_v86_vga_display.addEventListener('click', ()=>{
		if(main_v86_vga_display.getAttribute('width') != 0){
			emulator.lock_mouse();
		}
	});
	
	fullScr = ()=>{ // fullscreen
		var a=main_v86_vga_display,
			b=a.requestFullScreen||a.webkitRequestFullscreen||a.mozRequestFullScreen||a.msRequestFullScreen;
		
		b.call(a);
		emulator.Jf();
	}
	srcshot = ()=>{ // screenshot
		var url = main_v86_vga_display.toDataURL('image/jpg'),
			a = document.createElement('a');
		document.body.appendChild(a);
		
		a.download = encodeURI('v86-'+Date.now() + '.jpg');
		a.href = url;
		a.dataset.downloadurl = 'application/octet-stream:' + a.download + ':' + a.href;
		a.click();
		
		a.parentNode.removeChild(a); // remove element
	}
	saveState = ()=>{
		emulator.save_state((error, new_state)=>{
			if(error){
				return
			}
			
			var a = document.createElement("a");
			document.body.appendChild(a);
			
			a.download = 'v86state.bin';
			a.href = window.URL.createObjectURL(new Blob([new_state]));
			a.dataset.downloadurl = 'application/octet-stream:' + a.download + ':' + a.href;
			a.click();
			
			a.parentNode.removeChild(a);
		});
	}
	loadStateFile = ()=>{
		main_v86_filePicker.click();
	}
	loadingInterval = null
	loadingMsg = ()=>{
		if(emulator == null)clearInterval(loadingInterval);
		
		if(typeof emulator.is_running == 'function'){
			if(emulator.is_running()){
				// emulator is running
				clearInterval(loadingInterval);
			}else{
				main_v86_text_display.getElementsByTagName('div')[0].innerHTML = 'Your VM will load shortly..'
			}
		}
	}
	loadVM = (profileName)=>{
		vmToolbar.style.display = 'flex';
		
		// main_v86_text_display
		main_v86_screen_container.style.display = 'flex'
		emulator = new V86Starter(Object.assign(profile_data.base_profile, profile_data.profiles[profileName] ));
		main_obj_close.style.display = 'block'
		
		loadingInterval = setInterval(loadingMsg, 100);
		
		emulator.add_listener('screen-set-size-graphical', (e)=>{
			main_v86_text_display.style.width = e[0];
			main_v86_text_display.style.height = e[1];
			
			main_v86_vga_display.style.width = e[0];
			main_v86_vga_display.style.height = e[1];
			
			
			
		});
		emulator.add_listener('screen-set-size-text', (e)=>{
			// console.log(e);
		});
	}
	
	
	clickables.forEach(element => {
		element.addEventListener('click', ()=>{
			Array.from(document.getElementsByClassName('container')).forEach(e=>{
				e.style.display = 'none' // hide all containers
			});
		});
		
		if(element.getAttribute('data').startsWith('vm_')){
			element.addEventListener('click', ()=>{
				loadVM(element.getAttribute('data').replace(/^vm_/gi, ''));
			});
		}else{
			var id = Number(element.getAttribute('data'));
			
			element.addEventListener('click', ()=>{
				switch(id){
					case 01:
						
						main_obj.setAttribute('src', '/utils/eval.html');
						main_obj.style.display = 'block'
						main_obj_close.style.display = 'block'
						
						break
					case 02:
						
						main_obj.setAttribute('src', 'utils/jor1k/');
						main_obj.style.display = 'block'
						main_obj_close.style.display = 'block'
						
						break
				}
			});
		}
	});

})();