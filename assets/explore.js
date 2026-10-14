(function(){
  'use strict';
  var root='https://cybertect2023.github.io/BIA-Directory/';
  var widgets=document.querySelectorAll('[data-bia-event]');
  if(!widgets.length)return;
  fetch(root+'explore/events.json',{cache:'no-cache'})
    .then(function(response){if(!response.ok)throw new Error('Event data unavailable');return response.json();})
    .then(function(data){
      (data.featuredEvents||[]).forEach(function(event){
        var card=document.querySelector('[data-bia-event="'+CSS.escape(event.id)+'"]');
        if(!card)return;
        var title=card.querySelector('[data-event-title]');
        var description=card.querySelector('[data-event-description]');
        var date=card.querySelector('[data-event-date-label]');
        var link=card.querySelector('[data-event-link]');
        if(title)title.textContent=event.title;
        if(description)description.textContent=event.description;
        if(date){date.textContent=event.dateLabel;if(event.startDate)date.setAttribute('datetime',event.startDate);}
        if(link){link.href=event.url;link.textContent=event.linkLabel||'Event details';}
      });
    })
    .catch(function(){/* Static, crawlable Code Block content remains as the fallback. */});
})();
