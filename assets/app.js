const targets=document.querySelectorAll('.reveal-target,.section,.problem,.jobs,.coordinator,.faq,.final-cta');
const io=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal','is-visible');io.unobserve(entry.target);}})},{threshold:.15});
targets.forEach(el=>io.observe(el));
