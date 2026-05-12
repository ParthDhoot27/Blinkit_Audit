loaded_h_0(function(_){var window=this;
_.v("abd");
var RIu=function(a){var b="",c=21;for(let d=0;d<a.length;d++)d%4!=3&&(b+=String.fromCharCode(a[d]^c),c++);return b};_.SIu=RIu([97,119,115,111,107]);_.TIu=RIu([97,119,115,111,107,123]);_.UIu=RIu([118,115,121,107,108,124,104,119,68,127,114,105,114]);_.VIu=RIu([101,126,118,102,118,125,118,109,126]);_.WIu=RIu([116,116,115,108]);_.XIu=RIu([113,115,99,107]);_.YIu=RIu([113,115,117,107]);_.ZIu=RIu([58,127,122,103,121,126,127,98,104,51,109,124,118,123,15,76,81,90,13,95,67,76,64,118]);
_.x();
_.xFr=_.y("TDFkye",[]);
_.v("TDFkye");
var $Iu=function(a){typeof a==="string"&&(a=_.qm(a));if(a)return _.Vm(a,"display")!=="none"&&_.Vm(a,"visibility")!=="hidden"&&a.offsetHeight>0},aJu=function(a){var b=0;for(let c in a)if(a[c].e)if(a[c].b)b++;else return!1;return b>0},bJu=function(a={}){var b={};b[_.XIu]={e:!!a[_.XIu],b:!$Iu(_.SIu)};b[_.YIu]={e:!!a[_.YIu],b:!$Iu(_.TIu)};return b},cJu=function(a){var b=[];for(let c in a)a[c].e&&b.push(`${c}:`+(a[c].b?"1":"0"));return b.join(",")},dJu=function(a,b){a=String(a);b&&(a+=`,${b}`);google.log(_.VIu,
a)},eJu=function(a,b,c=2){if(c<1)dJu(7,b);else{var d=new Image;d.onerror=()=>{eJu(a,b,c-1)};d.src=a}},fJu=function(a={}){if(a[_.WIu]&&$Iu(_.UIu)){a=bJu(a);var b=cJu(a);aJu(a)?dJu(1,"0,"+b):dJu(0,b);(0,_.xf)(()=>{eJu(_.ZIu,"aa")})}};_.os(_.xFr,class extends _.ms{constructor(){super();fJu(google.pmc.abd)}});
_.x();
_.oNr=_.y("Zihehd",[]);
var Pmh,Smh,Vmh,Wmh,Nmh,Omh,Qmh,Mmh;Pmh=function(){_.qn(Mmh);Nmh("kne","enabled");Mmh=_.qe(Omh,"keydown",a=>{a.keyCode!==13&&a.keyCode!==32||Nmh("kne","selected")})};Smh=function(){_.qn(Qmh);Qmh=_.on(Omh,"mousedown",()=>{_.Rmh()},{capture:!0})};Vmh=function(){_.qn(Qmh);Qmh=_.qe(Omh,"keydown",a=>{_.Tmh.indexOf(a.keyCode)!==-1&&_.Umh()})};_.Rmh=function(){_.mm.remove(Omh,Wmh);_.Xmh&&_.qn(Mmh);Vmh()};_.Umh=function(){_.mm.add(Omh,Wmh);_.Xmh&&Pmh();Smh()};_.Ymh=function(){return _.mm.contains(Omh,Wmh)};
_.Zmh=function(a){Wmh="zAoYTe";Nmh=a;Vmh()};_.Xmh=!1;_.Tmh=[9];Omh=document.documentElement;
_.v("Zihehd");
_.os(_.oNr,class extends _.ms{constructor(){super();_.Zmh(this.oa)}oa(a,b){_.Yg().Hc(a,b).log()}});
_.x();
_.YKr=_.y("mf2ifc",[]);
var LUd,NUd,PUd;LUd=function(a){var b;(b=!a.parentElement)||(a.ownerDocument&&a.ownerDocument.defaultView?(b=a.ownerDocument.defaultView.getComputedStyle(a))&&b.visibility==="hidden"?b=!1:(b=a.getBoundingClientRect(),b=b.width>0&&b.height>0):b=!0);return b?a:LUd(a.parentElement)};NUd=function(a){if(a){var b=new MUd;for(let f of Object.keys(a)){var c=document.getElementById(f)||document.documentElement.querySelector(`img[data-iid="${f}"]`);if(c){var d=b,e=a[f];d.oa.oa(c,e)||d.Aa.oa(c,e)}}}};
_.OUd=function(){NUd(google.ldi);NUd(google.pim);google.lfj?google.sx(null,()=>{NUd(google.ldilf)}):google.dclc(()=>{NUd(google.ldilf)})};PUd=class{constructor(a){this.rootMargin=a;this.jj=null}zMa(){if(this.jj)return!0;try{return this.jj=new IntersectionObserver((a,b)=>{a=a.filter(c=>c.isIntersecting);for(let c of a)a=c.target,this.Ca(a),b.unobserve(a)},{rootMargin:this.rootMargin,threshold:[0]}),!0}catch(a){return!1}}};var QUd=class extends PUd{constructor(){super("0px");this.Aa=new Map;this.Ba=new Map}oa(a,b){if(a.hasAttribute("data-atf"))return!1;if(this.zMa()){this.Ba.set(a,b);b=LUd(a);if(b===a){var c;a:{for(c=a;c;c=c.parentElement)if(c.tagName==="G-SCROLLING-CAROUSEL"||c.classList.contains("XNfAUb"))break a;c=null}c&&(b=c)}(c=this.Aa.get(b))?c.push(a):this.Aa.set(b,[a]);this.jj.observe(b);return!0}return!1}Ca(a){if(a=this.Aa.get(a))for(let b of a)a=this.Ba.get(b),_.lYb(b,a)}};var RUd=class extends PUd{constructor(){super("400px");this.Aa=new Map}oa(a,b){(google.c.timl||Number(a.getAttribute("data-atf"))&1?0:this.zMa())?(this.Aa.set(a,b),this.jj.observe(a)):_.lYb(a,b);return!0}Ca(a){var b=this.Aa.get(a);_.lYb(a,b)}};var MUd=class{constructor(){this.oa=new QUd;this.Aa=new RUd}};
_.v("mf2ifc");
_.os(_.YKr,class extends _.ms{constructor(){super();_.OUd()}});
_.x();
});
// Google Inc.
