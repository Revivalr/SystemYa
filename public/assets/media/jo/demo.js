var Jor1k = require('Jor1k');
var LinuxTerm = require('LinuxTerm');

function Fullscreen(){
	
}

function RandomString(length) {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}

window.addEventListener('DOMContentLoaded', ()=>{
	var pushState = true

	jor1kparameters = {
		path: 'openrisc-sys/',
		system: {
			kernelURL: 'kernel/vmlinux.bin.bz2', // kernel image
			memorysize: 32, // in MB, must be a power of two
			cpu: 'asm', // short name for the cpu to use
			ncores: 1,
		},
		fs: {
			basefsURL: "basefs.json", // json file with the basic filesystem configuration.
			extendedfsURL: "fs.json", // json file with extended filesystem informations. Loaded after the basic filesystem has been loaded.
			earlyload: [], // list of files which should be loaded immediately after they appear in the filesystem
			lazyloadimages: [
			] // list of automatically loaded images after the basic filesystem has been loaded
		},

		term: new LinuxTerm('tty'), // canvas id for the terminal
		fbid: 'fb', // canvas id for the framebuffer
		clipboardid: 'clipboard', // input id for the clipboard
		statsid: 'stats', // object id for the statistics test
		fps: 30, // update interval of framebuffer
		relayURL: 'wss://relay.widgetry.org/', // relay url for the network
		userid: 'systemya', // unique user id string. Empty, choosen randomly, from a url, or from a cookie.
		syncURL: '//jor1k.com/sync/upload.php' // url to sync a certain folder
	}
	
	// if(loadUserData)jor1kparameters.fs.lazyloadimages.push('sync/tarballs/'+userid+'.tar.bz2');
	
	if (jor1kparameters.system.cpu == 'smp') {
		console.log('Load smp kernel');
		jor1kparameters.system.kernelURL = 'kernel/vmlinuxsmp.bin.bz2';
	}
	
	// --------------------------------------------------------

	jor1k = new Jor1k(jor1kparameters);
});