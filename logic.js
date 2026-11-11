(function(root){
const days=['Понедельник','Вторник','Среда','Четверг','Пятница'];
const minutes=s=>/^\d{2}:\d{2}$/.test(s)&&+s.slice(0,2)<24&&+s.slice(3)<60?+s.slice(0,2)*60 + +s.slice(3):NaN;
const time=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
const duration=d=>d.off?0:Math.max(0,minutes(d.end)-minutes(d.start)-Number(d.break||0));
const defaults=()=>days.map(()=>({start:'09:00',end:'13:00',break:0,off:false,note:'',done:false}));
function validateDay(d,i){
 if(!d||typeof d.off!=='boolean'||typeof d.done!=='boolean'||typeof d.note!=='string'||d.note.length>500)return 'Некорректные данные дня';
 const a=minutes(d.start),b=minutes(d.end),p=Number(d.break);
 if(!Number.isFinite(a)||!Number.isFinite(b)||!Number.isInteger(p)||p<0)return 'Проверьте время и перерыв';
 if(d.off)return '';
 if(a<540||b>(i===4?1005:1080))return `Рабочее окно: 09:00–${i===4?'16:45':'18:00'}`;
 if(b<=a)return 'Конец должен быть позже начала';
 if(p>=b-a)return 'Перерыв должен быть короче смены';
 return '';
}
function monday(date){let d=new Date(date);d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function validState(s){return s&&s.version===1&&Number.isInteger(s.target)&&s.target>0&&s.target<=2580&&Array.isArray(s.template)&&s.template.length===5&&s.template.every((d,i)=>!validateDay(d,i))&&s.weeks&&typeof s.weeks==='object'&&!Array.isArray(s.weeks)&&Object.entries(s.weeks).every(([k,v])=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&Array.isArray(v)&&v.length===5&&v.every((d,i)=>!validateDay(d,i)));}
const api={days,minutes,time,duration,defaults,validateDay,monday,key,validState};
if(typeof module!=='undefined')module.exports=api;else root.Schedule=api;
})(typeof window!=='undefined'?window:globalThis);
