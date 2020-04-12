function t(){}t.prototype={on:function(t,e,r){var i=this.e||(this.e={});return(i[t]||(i[t]=[])).push({fn:e,ctx:r}),this},once:function(t,e,r){var i=this;function n(){i.off(t,n),e.apply(r,arguments)}return n._=e,this.on(t,n,r)},emit:function(t){for(var e=[].slice.call(arguments,1),r=((this.e||(this.e={}))[t]||[]).slice(),i=0,n=r.length;i<n;i++)r[i].fn.apply(r[i].ctx,e);return this},off:function(t,e){var r=this.e||(this.e={}),i=r[t],n=[];if(i&&e)for(var o=0,s=i.length;o<s;o++)i[o].fn!==e&&i[o].fn._!==e&&n.push(i[o]);return n.length?r[t]=n:delete r[t],this}};var e=t;e.TinyEmitter=t;var r=function(t){this.wrap=document.querySelector("[data-router-wrapper]"),this.properties=t,this.Transition=t.transition?new t.transition.class(this.wrap,t.transition.name):null};r.prototype.setup=function(){this.onEnter&&this.onEnter(),this.onEnterCompleted&&this.onEnterCompleted()},r.prototype.add=function(){this.wrap.insertAdjacentHTML("beforeend",this.properties.view.outerHTML)},r.prototype.update=function(){document.title=this.properties.page.title},r.prototype.show=function(t){var e=this;return new Promise(function(r){try{function i(t){e.onEnterCompleted&&e.onEnterCompleted(),r()}return e.update(),e.onEnter&&e.onEnter(),Promise.resolve(e.Transition?Promise.resolve(e.Transition.show(t)).then(i):i())}catch(t){return Promise.reject(t)}})},r.prototype.hide=function(t){var e=this;return new Promise(function(r){try{function i(t){e.onLeaveCompleted&&e.onLeaveCompleted(),r()}return e.onLeave&&e.onLeave(),Promise.resolve(e.Transition?Promise.resolve(e.Transition.hide(t)).then(i):i())}catch(t){return Promise.reject(t)}})};var i=new window.DOMParser,n=function(t,e){this.renderers=t,this.transitions=e};n.prototype.getOrigin=function(t){var e=t.match(/(https?:\/\/[\w\-.]+)/);return e?e[1].replace(/https?:\/\//,""):null},n.prototype.getPathname=function(t){var e=t.match(/https?:\/\/.*?(\/[\w_\-./]+)/);return e?e[1]:"/"},n.prototype.getAnchor=function(t){var e=t.match(/(#.*)$/);return e?e[1]:null},n.prototype.getParams=function(t){var e=t.match(/\?([\w_\-.=&]+)/);if(!e)return null;for(var r=e[1].split("&"),i={},n=0;n<r.length;n++){var o=r[n].split("=");i[o[0]]=o[1]}return i},n.prototype.getDOM=function(t){return"string"==typeof t?i.parseFromString(t,"text/html"):t},n.prototype.getView=function(t){return t.querySelector("[data-router-view]")},n.prototype.getSlug=function(t){return t.getAttribute("data-router-view")},n.prototype.getRenderer=function(t){if(!this.renderers)return Promise.resolve(r);if(t in this.renderers){var e=this.renderers[t];return"function"!=typeof e||r.isPrototypeOf(e)?"function"==typeof e.then?Promise.resolve(e).then(function(t){return t.default}):Promise.resolve(e):Promise.resolve(e()).then(function(t){return t.default})}return Promise.resolve(r)},n.prototype.getTransition=function(t){return this.transitions?t in this.transitions?{class:this.transitions[t],name:t}:"default"in this.transitions?{class:this.transitions.default,name:"default"}:null:null},n.prototype.getProperties=function(t){var e=this.getDOM(t),r=this.getView(e),i=this.getSlug(r);return{page:e,view:r,slug:i,renderer:this.getRenderer(i,this.renderers),transition:this.getTransition(i,this.transitions)}},n.prototype.getLocation=function(t){return{href:t,anchor:this.getAnchor(t),origin:this.getOrigin(t),params:this.getParams(t),pathname:this.getPathname(t)}};var o=function(t){function e(e){var r=this;void 0===e&&(e={});var i=e.renderers,o=e.transitions;t.call(this),this.Helpers=new n(i,o),this.Transitions=o,this.Contextual=!1,this.location=this.Helpers.getLocation(window.location.href),this.properties=this.Helpers.getProperties(document.cloneNode(!0)),this.popping=!1,this.running=!1,this.trigger=null,this.cache=new Map,this.cache.set(this.location.href,this.properties),this.properties.renderer.then(function(t){r.From=new t(r.properties),r.From.setup()}),this._navigate=this.navigate.bind(this),window.addEventListener("popstate",this.popState.bind(this)),this.links=document.querySelectorAll("a:not([target]):not([data-router-disabled])"),this.attach(this.links)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.attach=function(t){for(var e=0,r=t;e<r.length;e+=1)r[e].addEventListener("click",this._navigate)},e.prototype.detach=function(t){for(var e=0,r=t;e<r.length;e+=1)r[e].removeEventListener("click",this._navigate)},e.prototype.navigate=function(t){if(!t.metaKey&&!t.ctrlKey){t.preventDefault();var e=!!t.currentTarget.hasAttribute("data-transition")&&t.currentTarget.dataset.transition;this.redirect(t.currentTarget.href,e,t.currentTarget)}},e.prototype.redirect=function(t,e,r){if(void 0===e&&(e=!1),void 0===r&&(r="script"),this.trigger=r,!this.running&&t!==this.location.href){var i=this.Helpers.getLocation(t);this.Contextual=!1,e&&(this.Contextual=this.Transitions.contextual[e].prototype,this.Contextual.name=e),i.origin!==this.location.origin||i.anchor&&i.pathname===this.location.pathname?window.location.href=t:(this.location=i,this.beforeFetch())}},e.prototype.popState=function(){this.trigger="popstate",this.Contextual=!1;var t=this.Helpers.getLocation(window.location.href);this.location.pathname!==t.pathname||!this.location.anchor&&!t.anchor?(this.popping=!0,this.location=t,this.beforeFetch()):this.location=t},e.prototype.pushState=function(){this.popping||window.history.pushState(this.location,"",this.location.href)},e.prototype.fetch=function(){try{var t=this;return Promise.resolve(fetch(t.location.href,{mode:"same-origin",method:"GET",headers:{"X-Requested-With":"Highway"},credentials:"same-origin"})).then(function(e){if(e.status>=200&&e.status<300)return e.text();window.location.href=t.location.href})}catch(t){return Promise.reject(t)}},e.prototype.beforeFetch=function(){try{var t=this;function e(){t.afterFetch()}t.pushState(),t.running=!0,t.emit("NAVIGATE_OUT",{from:{page:t.From.properties.page,view:t.From.properties.view},trigger:t.trigger,location:t.location});var r={trigger:t.trigger,contextual:t.Contextual},i=t.cache.has(t.location.href)?Promise.resolve(t.From.hide(r)).then(function(){t.properties=t.cache.get(t.location.href)}):Promise.resolve(Promise.all([t.fetch(),t.From.hide(r)])).then(function(e){t.properties=t.Helpers.getProperties(e[0]),t.cache.set(t.location.href,t.properties)});return Promise.resolve(i&&i.then?i.then(e):e())}catch(t){return Promise.reject(t)}},e.prototype.afterFetch=function(){try{var t=this;return Promise.resolve(t.properties.renderer).then(function(e){return t.To=new e(t.properties),t.To.add(),t.emit("NAVIGATE_IN",{to:{page:t.To.properties.page,view:t.To.wrap.lastElementChild},trigger:t.trigger,location:t.location}),Promise.resolve(t.To.show({trigger:t.trigger,contextual:t.Contextual})).then(function(){t.popping=!1,t.running=!1,t.detach(t.links),t.links=document.querySelectorAll("a:not([target]):not([data-router-disabled])"),t.attach(t.links),t.emit("NAVIGATE_END",{to:{page:t.To.properties.page,view:t.To.wrap.lastElementChild},from:{page:t.From.properties.page,view:t.From.properties.view},trigger:t.trigger,location:t.location}),t.From=t.To,t.trigger=null})})}catch(t){return Promise.reject(t)}},e}(e),s=function(t,e){this.wrap=t,this.name=e};s.prototype.show=function(t){var e=this,r=t.trigger,i=t.contextual,n=this.wrap.lastElementChild,o=this.wrap.firstElementChild;return new Promise(function(t){i?(n.setAttribute("data-transition-in",i.name),n.removeAttribute("data-transition-out",i.name),i.in&&i.in({to:n,from:o,trigger:r,done:t})):(n.setAttribute("data-transition-in",e.name),n.removeAttribute("data-transition-out",e.name),e.in&&e.in({to:n,from:o,trigger:r,done:t}))})},s.prototype.hide=function(t){var e=this,r=t.trigger,i=t.contextual,n=this.wrap.firstElementChild;return new Promise(function(t){i?(n.setAttribute("data-transition-out",i.name),n.removeAttribute("data-transition-in",i.name),i.out&&i.out({from:n,trigger:r,done:t})):(n.setAttribute("data-transition-out",e.name),n.removeAttribute("data-transition-in",e.name),e.out&&e.out({from:n,trigger:r,done:t}))})},console.log("Highway v2.1.3");export default{Core:o,Helpers:n,Renderer:r,Transition:s};
//# sourceMappingURL=highway.module.js.map
