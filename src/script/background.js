console.log('hello background!!')
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	console.log(chrome.notifications)
	chrome.notifications.create(null, {
		iconUrl: 'img/icon.jpg',
		type: 'basic',
		title: '祝福',
		message: '骚年，祝你圣诞快乐！Merry christmas!',

	});
	sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});