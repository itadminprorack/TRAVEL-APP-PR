import {esc,formatTime,timeParts,timeFromParts,pad} from './logic.js';

// A native modal supplies focus containment, Escape handling and inert background content.
export function initTimePicker(){
 document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-open-time]');if(!trigger)return;
  const field=trigger.closest('[data-time-field]'),stored=field.querySelector('input[name]');
  let {hour,minute,period}=timeParts(stored.value||'08:00'),part='hour';
  const dialog=document.createElement('dialog');dialog.className='clock-picker';
  dialog.setAttribute('aria-labelledby','clock-picker-title');
  dialog.innerHTML=`<form method="dialog" class="clock-picker-body"><p class="clock-eyebrow">SELECT TIME</p><h2 id="clock-picker-title">${esc(field.dataset.timeLabel)}</h2><div class="clock-digital"><label><input aria-label="Hour" data-clock-part="hour" type="number" min="1" max="12" inputmode="numeric" required value="${hour}"/><small>Hour</small></label><span class="clock-colon" aria-hidden="true">:</span><label><input aria-label="Minute" data-clock-part="minute" type="number" min="0" max="59" inputmode="numeric" required value="${minute}"/><small>Minute</small></label><div class="clock-period" role="group" aria-label="AM or PM"><button type="button" data-period="AM">AM</button><button type="button" data-period="PM">PM</button></div></div><p class="clock-instruction" aria-live="polite"></p><div class="clock-face" role="group" aria-label="Clock dial"><span class="clock-hand" aria-hidden="true"></span><span class="clock-center" aria-hidden="true"></span><div class="clock-numbers"></div></div><div class="clock-actions">${field.dataset.timeRequired==='true'?'':'<button type="button" data-clock-clear>Clear</button>'}<span></span><button type="button" data-clock-cancel>Cancel</button><button type="submit" class="clock-confirm">OK</button></div></form>`;
  const inputs={hour:dialog.querySelector('[data-clock-part="hour"]'),minute:dialog.querySelector('[data-clock-part="minute"]')};
  function paint(){
   for(const [name,input] of Object.entries(inputs))input.classList.toggle('active',part===name);
   for(const button of dialog.querySelectorAll('[data-period]'))button.setAttribute('aria-pressed',String(button.dataset.period===period));
   dialog.querySelector('.clock-instruction').textContent=part==='hour'?'Choose an hour':'Choose minutes · type for an exact minute';
   const selected=Number(inputs[part].value),count=part==='hour'?12:60;
   dialog.querySelector('.clock-hand').style.transform=`rotate(${selected/count*360}deg)`;
   dialog.querySelector('.clock-numbers').innerHTML=Array.from({length:12},(_,i)=>{
    const number=part==='hour'?(i||12):i*5,angle=i*Math.PI/6;
    return `<button type="button" class="clock-number ${selected===number?'selected':''}" style="--x:${Math.sin(angle)*40}%;--y:${-Math.cos(angle)*40}%" data-clock-value="${number}" aria-label="${number} ${part==='hour'?'hours':'minutes'}" aria-pressed="${selected===number}">${part==='minute'?pad(number):number}</button>`;
   }).join('');
  }
  function close(){dialog.close();dialog.remove();trigger.focus();}
  function save(value){
   stored.value=value;const parts=timeParts(value);
   for(const name of ['hour','minute','period'])field.querySelector(`[data-time-part="${name}"]`).value=parts[name];
   trigger.querySelector('[data-time-display]').textContent=value?formatTime(value):'Choose time';
   trigger.classList.toggle('has-time',Boolean(value));trigger.setAttribute('aria-label',`${field.dataset.timeLabel}: ${value?formatTime(value):'Choose time'}`);
   stored.dispatchEvent(new Event('change',{bubbles:true}));close();
  }
  dialog.addEventListener('click',event=>{
   event.stopPropagation();const target=event.target;
   if(target.closest('[data-clock-cancel]'))return close();
   if(target.closest('[data-clock-clear]'))return save('');
   if(target.dataset.period){period=target.dataset.period;paint();return;}
   if(target.dataset.clockPart){part=target.dataset.clockPart;paint();return;}
   if(target.dataset.clockValue!==undefined){inputs[part].value=pad(Number(target.dataset.clockValue));if(part==='hour')part='minute';paint();inputs.minute.focus();return;}
   if(target===dialog)close();
  });
  dialog.addEventListener('focusin',event=>{if(event.target.dataset.clockPart){part=event.target.dataset.clockPart;paint();}});
  dialog.addEventListener('input',()=>paint());
  dialog.querySelector('form').addEventListener('submit',event=>{event.preventDefault();event.stopPropagation();save(timeFromParts(inputs.hour.value,pad(Number(inputs.minute.value)),period));});
  dialog.addEventListener('keydown',event=>{event.stopPropagation();});
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  document.body.append(dialog);paint();dialog.showModal();inputs.hour.focus();inputs.hour.select();
 });
}
