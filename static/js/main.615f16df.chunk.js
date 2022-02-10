(this["webpackJsonpreact-realm-provider-example"]=this["webpackJsonpreact-realm-provider-example"]||[]).push([[0],{134:function(e,n,t){e.exports=t(242)},135:function(e,n,t){},146:function(e,n){},148:function(e,n){},158:function(e,n){},160:function(e,n){},187:function(e,n){},189:function(e,n){},190:function(e,n){},195:function(e,n){},197:function(e,n){},203:function(e,n){},205:function(e,n){},224:function(e,n){},236:function(e,n){},239:function(e,n){},242:function(e,n,t){"use strict";t.r(n);t(135);var r,o=t(2),u=t.n(o),a=t(131),c=t.n(a),i=t(0),l=t.n(i),s=t(4),f=t(15),m=t(72),d=Object(o.createContext)({}),g=function(e){var n=e.id,t=e.render,r=void 0===t?null:t,a=e.remember,c=void 0===a||a,i=e.children,l=void 0===i?null:i,s=Object(o.useRef)(new m.a({id:n})).current,f=Object(o.useState)(c&&s.currentUser),g=f[0],h=f[1],v=Object(o.useState)(g&&g.customData),p=v[0],b=v[1],E=Object(o.useState)(Boolean(g)),j=E[0],O=E[1],P=Object(o.useMemo)((function(){return g&&g.mongoClient("mongodb-atlas")}),[g]),w=Object(o.useCallback)((function(e,n,t){void 0===t&&(t=null);try{return Promise.resolve(s.emailPasswordAuth.registerUser(e,n)).then((function(e){var n=function(){if(t)return Promise.resolve(t(e)).then((function(){}))}();return n&&n.then?n.then((function(){return e})):e}))}catch(r){return Promise.reject(r)}}),[]),y=Object(o.useCallback)((function(e,n,t,r){void 0===r&&(r=null);try{return Promise.resolve(s.emailPasswordAuth.resetPassword(e,n,t)).then((function(e){var n=function(){if(r)return Promise.resolve(r(e)).then((function(){}))}();return n&&n.then?n.then((function(){return e})):e}))}catch(o){return Promise.reject(o)}}),[]),C=Object(o.useCallback)((function(e,n,t){void 0===t&&(t=null);try{return Promise.resolve(s.emailPasswordAuth.confirmUser(e,n)).then((function(e){var n=function(){if(t)return Promise.resolve(t(e)).then((function(){}))}();return n&&n.then?n.then((function(){return e})):e}))}catch(r){return Promise.reject(r)}}),[]),k=Object(o.useCallback)((function(e){try{var n;O(!0);for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];var u="function"===typeof r[r.length-1]&&r.pop();return Promise.resolve(s.logIn((n=m.b)[e].apply(n,r)).catch((function(e){throw O(!1),e}))).then((function(e){function n(){return Promise.resolve(e.refreshCustomData().then((function(){return b(e.customData),h(e),O(!1),e})).catch((function(e){throw O(!1),e})))}var t=function(){if(u)return Promise.resolve(u(e).catch((function(e){throw O(!1),e}))).then((function(){}))}();return t&&t.then?t.then(n):n()}))}catch(a){return Promise.reject(a)}}),[]),x=Object(o.useCallback)((function(e){void 0===e&&(e=null);try{return Promise.resolve(s.currentUser&&s.currentUser.logOut().then((function(){return h(),e&&e()})))}catch(n){return Promise.reject(n)}}),[]),I=Object(o.useCallback)((function(){return g.refreshCustomData().then((function(){return b(g.customData)}))}),[g]),L=Object(o.useCallback)((function(e){for(var n,t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];return(n=g.functions)[e].apply(n,r)}),[g]),D={app:s,loading:j,user:g,customData:p,mongo:P,isLoggedIn:Boolean(g),login:k,logout:x,register:w,confirm:C,resetPassword:y,callFunction:L,refreshCustomData:I};return u.a.createElement(d.Provider,{value:D},r?r(D):l)},h="react-realm-provider-sandbox-wzhse",v=function(){return u.a.createElement(u.a.Fragment,null,u.a.createElement(g,{id:h},u.a.createElement(p,null)),u.a.createElement("hr",null),u.a.createElement(g,{id:h,render:function(e){return u.a.createElement(b,{realm:e})}}),u.a.createElement("hr",null),u.a.createElement(E,{id:h}))},p=function(){var e=Object(o.useContext)(d),n=e.isLoggedIn,t=e.loading,r=e.login,a=e.logout,c=e.user,i=e.mongo;return u.a.createElement(j,{isLoggedIn:n,loading:t,login:r,logout:a,user:c,mongo:i})},b=function(e){e.realm;var n=Object(o.useContext)(d),t=n.isLoggedIn,r=n.loading,a=n.login,c=n.logout,i=n.user,l=n.mongo;return u.a.createElement(j,{isLoggedIn:t,loading:r,login:a,logout:c,user:i,mongo:l})},E=(r=b,function(e){var n=e.id;return u.a.createElement(g,{id:n,render:function(e){return u.a.createElement(r,{realm:e})}})}),j=function(e){var n=e.isLoggedIn,t=e.loading,r=e.login,a=e.logout,c=e.user,i=e.mongo,m=Object(o.useState)([]),d=Object(f.a)(m,2),g=d[0],h=d[1];return Object(o.useEffect)((function(){n&&fetch("https://api.ipify.org/").then((function(e){return e.text()})).then(function(){var e=Object(s.a)(l.a.mark((function e(n){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.db("react_realm_provider").collection("sample").insertOne({realmId:c.id,ts:new Date,ip:n.replace(/\d+$/,"0/24")});case 2:return e.next=4,i.db("react_realm_provider").collection("sample").aggregate([{$sort:{ts:-1}},{$group:{_id:"$ip",ts:{$first:"$ts"}}}]).then((function(e){return h(e.map((function(e){return{ip:e._id,ts:e.ts}})))}));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}())}),[n,i]),u.a.createElement("div",null,n?u.a.createElement("div",null,u.a.createElement("button",{onClick:function(){return a()}},"Log Out of Realm")):u.a.createElement("div",null,u.a.createElement("button",{onClick:function(){return r("anonymous")}},"Log In to Realm")),t&&u.a.createElement("div",null,"Logging in..."),n&&u.a.createElement("div",null,u.a.createElement("div",null,"Thank you for logging in, user!"),u.a.createElement("div",null,g&&g.map((function(e,n){var t=e.ts,r=e.ip;return u.a.createElement("div",{key:n},t.toString()," \u2014 ",r)})))))};c.a.render(u.a.createElement(v,null),document.getElementById("root"))}},[[134,1,2]]]);
//# sourceMappingURL=main.615f16df.chunk.js.map