import { defineCustomElement } from '../../packages/taro-components/dist/components/taro-swiper-core.js'

defineCustomElement()

let host, instance, events=0;
const stage=document.getElementById('stage'), output=document.getElementById('log');
const log=s=>{output.textContent+=s+'\n'};
window.addEventListener('error',e=>log('ERROR: '+e.message+'\n'+(e.error?.stack||'')));
window.addEventListener('unhandledrejection',e=>log('REJECTION: '+(e.reason?.stack||e.reason)));
const originalError=console.error;console.error=(...args)=>{log('CONSOLE ERROR: '+args.map(x=>x?.stack||String(x)).join(' '));originalError(...args)};
const slide=n=>{const item=document.createElement('taro-swiper-item-core');item.className='swiper-slide';item.setAttribute('item-id',String(n));item.textContent='图片 '+n;return item};
const action=(id,fn)=>document.getElementById(id).onclick=()=>{try{fn()}catch(e){log('ERROR: '+e.stack)}};
action('mount',()=>{if(host){log('已有节点，请刷新页面重做');return}host=document.createElement('taro-swiper-core');host.circular=true;host.autoplay=true;host.interval=400;host.duration=100;for(let n=1;n<=3;n++)host.appendChild(slide(n));host.addEventListener('change',()=>events++);stage.appendChild(host);log('挂载三图 circular=true autoplay=true')});
action('detach',()=>{host.remove();log('卸载，保留节点引用')});
action('circular',()=>{host.circular=!host.circular;log('circular='+host.circular)});
action('autoplay',()=>{host.autoplay=!host.autoplay;log('autoplay='+host.autoplay)});
action('add',()=>{host.appendChild(slide(4));log('追加一图')});
action('reconnect',()=>{stage.appendChild(host);log('重新挂载同一节点')});
setInterval(()=>{if(!host)return;const current=host.querySelector('.swiper-container')?.swiper;if(current)instance=current;document.getElementById('state').textContent=JSON.stringify({connected:host.isConnected,circular:host.circular,autoplay:host.autoplay,initialized:instance?.initialized,destroyed:instance?.destroyed,running:instance?.autoplay?.running,realIndex:instance?.realIndex,events})},500);
