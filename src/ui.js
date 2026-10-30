import {illustration} from './art.js';
import {icon} from './icons.js';
import {esc,initials,niceDate,shortDate,formatTime,timeParts,timeFromParts,pad} from './logic.js';
export const formatSchedule=(date,time)=>date?`${niceDate(date)}${time?' · '+formatTime(time):''}`:time?formatTime(time):'Not specified';
export const arrivalSummary=request=>formatSchedule(request.requiredArrivalDate||(request.requiredArrival?request.departDate:''),request.requiredArrival);
export function timeField(label,name,value='',opts={}) {
 const parts=timeParts(value);
 return `<fieldset class="time-fieldset form-field" data-time-field="${esc(name)}" data-time-label="${esc(label)}" data-time-required="${Boolean(opts.required)}"><legend class="field-label">${esc(label)} ${opts.required?'<i>*</i>':'<span class="field-optional">(optional)</span>'}</legend><input type="hidden" name="${esc(name)}" value="${esc(value)}"/><button type="button" class="time-picker-trigger ${value?'has-time':''}" data-open-time aria-haspopup="dialog" aria-label="${esc(label)}: ${value?esc(formatTime(value)):'Choose time'}"><span data-time-display>${value?esc(formatTime(value)):'Choose time'}</span>${icon('clock',19)}</button>${['hour','minute','period'].map(part=>`<input type="hidden" data-time-part="${part}" value="${parts[part]}"/>`).join('')}${opts.hint?`<small class="field-hint">${esc(opts.hint)}</small>`:''}</fieldset>`;
}
export function dateTimeField(label,name,value='',opts={}) {
 const [date='',time='']=String(value).split('T');
 return `<div class="datetime-field field-span" data-datetime-field="${esc(name)}"><label class="form-field"><span class="field-label">${esc(label)} date ${opts.required?'<i>*</i>':''}</span><input type="date" data-date-part value="${esc(date)}" ${opts.required?'required':''}/></label>${timeField(`${label} time`,`${name}Time`,time,opts)}<input type="hidden" name="${esc(name)}" value="${esc(value)}"/></div>`;
}
export function syncTimeControls(form,validate=false) {
 if(!form?.querySelectorAll)return;
 for(const group of form.querySelectorAll('[data-time-field]')){
  const values=['hour','minute','period'].map(part=>group.querySelector(`[data-time-part="${part}"]`).value);
  if(validate&&values.some(Boolean)&&!values.every(Boolean))throw Error(`Complete ${group.dataset.timeLabel.toLowerCase()} with an hour, minutes and AM/PM, or clear all three optional selections.`);
  group.querySelector('input[type="hidden"]').value=values.every(Boolean)?timeFromParts(...values):'';
 }
 for(const group of form.querySelectorAll('[data-datetime-field]')){
  const date=group.querySelector('[data-date-part]').value,time=group.querySelector('[data-time-field] input[type="hidden"]').value;
  group.querySelector(':scope > input[type="hidden"]').value=date&&time?`${date}T${time}`:'';
 }
}
export const badge=(status)=>{
 const names={draft:'Draft',submitted:'Pending review',under_review:'In review',approved:'Approved',allocated:'Travel allocated',completed:'Completed',rejected:'Rejected',cancelled:'Cancelled',needs_info:'More info needed'};
 return `<span class="badge badge-${status}"><i aria-hidden="true"></i>${names[status]||esc(status)}</span>`;
};
export const priorityBadge=(priority)=>priority==='emergency'?`<span class="badge badge-urgent">${icon('alert',13)} Emergency</span>`:'';
export const avatar=(user,size='normal')=>`<span class="avatar avatar-${esc(user?.tone||'blue')} avatar-${size}" title="${esc(user?.name||'User')}">${esc(initials(user?.name||'U'))}</span>`;
export const emptyState=(title,detail,ic='clipboard',cta='')=>`<div class="empty-state">${illustration(({bell:'notifications',calendar:'planning',checkCircle:'success',route:'location-pin',bus:'bus',users:'team'})[ic]||'empty-requests','empty-art')}<strong>${esc(title)}</strong><p>${esc(detail)}</p>${cta}</div>`;
export const button=(label,action,opts={})=>`<button type="button" class="btn ${opts.variant||'btn-primary'} ${opts.class||''}" data-action="${esc(action)}" ${opts.data||''} ${opts.disabled?'disabled':''}>${opts.icon?icon(opts.icon,17):''}${esc(label)}${opts.arrow?icon('arrowRight',17):''}</button>`;
export const topSection=(eyebrow,title,subtitle,action='')=>`<div class="page-heading"><div><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p class="lead">${esc(subtitle)}</p></div>${action?`<div class="page-heading-action">${action}</div>`:''}</div>`;
export const timeline=(request,events=[])=>{
 if(['rejected','cancelled','needs_info','draft'].includes(request.status))return `<div class="timeline-exception">${badge(request.status)}<p>${({rejected:'Admin has declined this request. Read the latest update for the reason.',cancelled:'This request was cancelled. Its history is kept below.',needs_info:'Admin needs more details. Update and resubmit this request.',draft:'This draft is saved locally. Complete it when you are ready.'})[request.status]}</p></div>`;
 const steps=['submitted','under_review','approved','allocated','completed'];
 const progress=steps.indexOf(request.status);
 return `<div class="timeline">${steps.map((s,i)=>`<div class="timeline-step ${progress>=i?'reached':''} ${progress===i?'current':''}"><span class="timeline-node">${progress>=i?icon('check',12):''}</span><div><strong>${['Request sent','Admin review','Approved','Transport allocated','Trip completed'][i]}</strong>${progress===i?'<small>Current stage</small>':''}</div></div>`).join('')}</div>`;
};
export const profileLine = (label,value) => `<div class="detail-item"><span>${esc(label)}</span><strong>${esc(value||'—')}</strong></div>`;
export const formatDateTime=v=>{
 if(!v)return '—';
 const [date,time]=String(v).split('T');return formatSchedule(date,time);
};
export const sectionCard=(title,content,extra='',iconName='')=>`<section class="surface-card"><div class="card-heading"><h2>${iconName?icon(iconName,19):''}${esc(title)}</h2>${extra}</div>${content}</section>`;
export const countNote=(count,singular,plural=singular+'s')=>`${count} ${count===1?singular:plural}`;
export const routeText=(r)=>`${esc(r.origin)} <span class="inline-route-arrow">${icon('arrowRight',14)}</span> ${esc(r.destination)}`;
export const dateLine=r=>`${shortDate(r.departDate)} · ${esc(formatTime(r.departTime))}`;
