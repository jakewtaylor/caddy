window.CADDY_INSTANCE_COUNT=window.CADDY_INSTANCE_COUNT||0;var t=function(t){this.options=this.buildOptions(t),this.key=this.options.key||"caddy"+ ++window.CADDY_INSTANCE_COUNT;var s=this.options.driver.getItem(this.key);this.store=s?JSON.parse(s):{},this.subscribers=[],this.listeners={}};t.prototype.buildOptions=function(t){return Object.assign({},{key:null,driver:window.localStorage},t)},t.prototype.persistStore=function(){var t=this.options.driver;this.prevStore=JSON.parse(t.getItem(this.key))||{},t.setItem(this.key,JSON.stringify(this.store)),this.notifySubscribers(),this.notifyListeners()},t.prototype.notifySubscribers=function(){var t=this;this.subscribers.forEach(function(s){s(t.store)})},t.prototype.notifyListeners=function(){var t=this,s=Object.keys(this.prevStore);Object.keys(this.store).forEach(function(r){s.includes(r)&&t.prevStore[r]===t.store[r]||(t.listeners[r]||[]).forEach(function(s){s(t.store[r])})})},t.prototype.set=function(t,s){return this.store[t]=s,this.persistStore(),this},t.prototype.get=function(t){return this.store[t]},t.prototype.has=function(t){return Object.prototype.hasOwnProperty.call(this.store,t)},t.prototype.flush=function(){return this.store={},this.persistStore(),this},t.prototype.push=function(t,s){if(!this.has(t))return this.set(t,[s]);if(!Array.isArray(this.get(t)))throw new Error("Failed trying to push to non-array.");return this.store[t].push(s),this.persistStore(),this},t.prototype.subscribe=function(t){return this.subscribers.push(t),this},t.prototype.listen=function(t,s){return this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push(s),this};export{t as Caddy};
//# sourceMappingURL=caddy.mjs.map
