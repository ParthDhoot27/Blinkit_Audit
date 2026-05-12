loaded_h_0(function(_){var window=this;
_.v("G6wU6e");
_.rwG=new _.Sf(_.W2a);
_.x();
_.OT=class extends _.m{constructor(a){super(a)}jOb(){return _.Ke(this,_.tK,2)}};_.OT.prototype.kb="X2sNs";
_.xSh=_.y("Wn3aEc",[]);
_.v("Wn3aEc");
var zSh;zSh=function(a){if((0,_.Lte)(a))return a;if((0,_.Syd)(a)){let c,d;a=(c=a.Da())==null?void 0:(d=c.Aa())==null?void 0:d.getExtension(_.uK);if(!a)return null}var b;return a.getType()===1?(b=a.getImage())!=null?b:null:null};
_.ASh=class extends _.ri{static Sa(){return{Cf:{WFb:_.OT}}}constructor(a){super();this.oa=a.Cf.WFb;this.Aa=_.wf();this.Ba=_.wf();this.results=new Map;a:{if(this.getData("vnora").Nb()){a=_.um("WA6vPb",this.haa());if(a.length===1){a=Number(_.eg(a[0],"count"));break a}a=_.um("LgL7He",this.haa());if(a.length===1){a=Number(_.eg(a[0],"count"));break a}}a=_.qd(this.getData("count"),-1)}this.Ca=a}bda(){if(this.Ca<0){let a=this.oa?_.p(this.oa,_.tK,2):null;return a?_.Ag(a.zD()):_.Ag([])}return this.Aa.promise}zD(){return this.bda().then(a=>
a.map(zSh).filter(b=>b!=null))}eGc(){return this.Ba.promise}Qfe(){return this.eGc().then(a=>{var b=new Map;for(let [c,d]of a){a=c;let e=zSh(d);e&&b.set(a,e)}return b})}kD(a,b){b&&_.ySh(b)&&this.results.set(a,b);if(--this.Ca===0){this.Aa.resolve(Array.from(this.results.entries()).sort((c,d)=>_.DJa(c[0],d[0])).map(c=>c[1]));a=new Map;for(let [c,d]of this.results.entries()){b=c;let e=d;e&&a.set(b,e)}this.Ba.resolve(a)}}};_.Wr(_.xSh,_.ASh);
_.x();
_.X7r=_.y("Um3BXb",[_.xSh]);
_.jx=function(a,b=!1,c){var d=a.getRoot().el();_.Sg(d,"EormBc",new t6b(a,b,c))};var t6b=class{constructor(a,b,c){this.logVisibility=b;this.QI=c;this.Uga=a}};
_.v("Um3BXb");
var vwG,twG,wwG;_.uwG=function({construct:a}){twG.push({construct:a})};vwG=_.Pb(_.sK);twG=[];
wwG=class extends _.ms{static Sa(){return{model:{Baa:_.ASh},Cf:{pVc:_.sK}}}constructor(a){super();this.Aa=!this.getData("ni").Nb();this.Vs=a.Cf.pVc;if((this.Ca=this.getData("au").Nb())&&this.Vs){var b=(b=this.getRoot().closest(_.ho("jsname","uK8Ylc")).el())?_.eg(b,"ved"):null;let e=vwG(this.Vs.serialize());if(b&&e&&e.nk()){var c;(c=e.getImage())!=null&&_.$g(c,5,b)}this.Vs=e}a.model.Baa.kD(this.getRoot().el(),this.Vs);_.jx(this);var d;(c=(d=this.Vs)==null?void 0:d.getImage())&&this.trigger("cEfxe",
c==null?void 0:c.getUniqueId());this.E2(a)}Da(a){var b=a.targetElement.parent();a=_.vm("srrRv",this.getRoot().el());b=_.rs(this,b.eq(0),"YsWoif").el();_.aw([new _.On(b,"show")],{triggerElement:b,userAction:9});_.Vg(b,"BUYwVb");a==null&&_.Tm(b,"display","inline-block")}Ea(a){var b=a.targetElement;a=a.targetElement.parent();a=_.rs(this,a.eq(0),"YsWoif").el();_.aw([new _.On(a,"hide")],{triggerElement:b.eq(0).el(),userAction:9});_.Tm(a,"display","none")}Sc(a){if(this.Vs&&this.Vs.getId()){var b,c;(c=(b=
a.event).preventDefault)==null||c.call(b);var d,e;(e=(d=a.event).stopPropagation)==null||e.call(d);this.trigger("PdWSXe",{Kt:a.event});var f;(a=(f=this.Vs)==null?void 0:f.getImage())&&this.trigger("Kc2lDe",a==null?void 0:a.getUniqueId())}}Wf(){this.notify("BUYwVb")}Ff(){this.Aa||(_.aw([new _.On(this.getRoot().el(),"show")]),this.Aa=!0)}hidden(){}E2(a){for(let b of twG)b.construct(this,a)}Ba(){this.notify("BUYwVb");var a=!_.EKu;this.getRoot().setStyle("display",a?"inline-flex":"unset");this.getRoot().removeAttr("aria-hidden");
this.Ff()}};wwG.prototype.$wa$bNsLWe=function(){return this.Ba};wwG.prototype.$wa$L6cTce=function(){return this.hidden};wwG.prototype.$wa$TSZdd=function(){return this.Ff};wwG.prototype.$wa$AwdEqd=function(){return this.Wf};wwG.prototype.$wa$h5M12e=function(){return this.Sc};wwG.prototype.$wa$XEuVS=function(){return this.Ea};wwG.prototype.$wa$RrAr1=function(){return this.Da};_.os(_.X7r,wwG);
var xwG=function(a,b,c){c=b.detail.vhid.replace("e-","")===c;var d=a.getRoot().closest("[data-id]");(d==null||d.filter(e=>e.dataset.id===b.detail.vid).isEmpty())&&b.detail.vid!=="mosaic"&&c||a.Xa("tdeeNb").toggleClass("srrRv",c)},ywG=function(a,b,c,d){var e=a.Xa("tdeeNb");e.isEmpty()||(d=new _.Ze(_.Rc(d.url)),c=d.get("imgrc")===c&&!d.get("imgdii")||d.get("vhid")===c,c||(a=a.getRoot(),e.hasClass("srrRv")&&(d=e.prev(),b.Iwe(a,d))),e.toggleClass("srrRv",c))},AwG=function(a,b){if(!a.closest(g=>zwG.some(h=>
g.classList.contains(h))).isEmpty()){var c=a.el().getBoundingClientRect();a=a.parent();a.hasClass("dECn0b")&&(a=a.closest(".T62xob"));var d=a.el().getBoundingClientRect();a=c.top===d.top;var e=Math.abs(d.bottom-c.bottom)<8,f=Math.abs(d.left-c.left)<8;c=Math.abs(d.right-c.right)<8;b.toggleClass("Xn9Tkc",a&&f);b.toggleClass("oGwWse",a&&c);b.toggleClass("y0jvId",e&&c);b.toggleClass("lM9tvf",e&&f)}},zwG=["DhGrzc","l5X1Ye","o6uAG","OXEsB","T62xob"];
_.uwG({construct(a){var b=_.pi(a.getData("docid"));b&&(_.jEb?(document.addEventListener("viewerUpdated",f=>{xwG(a,f,b)}),document.addEventListener("viewerClosed",()=>{a.Xa("tdeeNb").toggleClass("srrRv",!1)})):_.uh(a,{service:{LIc:_.yU,focus:_.rwG}}).then(f=>{var g=f.service.focus;f=f.service.LIc;f.addListener(h=>{ywG(a,g,b,h)});ywG(a,g,b,f.getState())},f=>void _.ff(f)));var c=a.getRoot();_.Og(c.el(),"qWWJ8e",()=>{AwG(c,a.Xa("tdeeNb"))});AwG(c,a.Xa("tdeeNb"));var d=null,e=a.Xa("qQjpJ").el();e&&(e.addEventListener("mouseenter",
()=>{d===null&&(d=(0,_.Wn)(()=>{c.toggleClass("dB3j8",!0);d=null},50))}),e.addEventListener("mouseleave",()=>{d&&((0,_.Xn)(d),d=null);c.toggleClass("dB3j8",!1)}))}});
_.x();
_.nNr=_.y("Z2vhDb",[]);
_.v("Z2vhDb");
var e1D=_.YF("xg558"),f1D=_.YF("wCwf3e");var g1D=class extends _.ms{static Sa(){return{St:{Kcc:e1D,inc:f1D}}}constructor(a){super();this.Kcc=a.St.Kcc;this.inc=a.St.inc}oa(a){this.Kcc&&this.Kcc(a)}Aa(a){this.inc&&this.inc(a)}};g1D.prototype.$wa$RAHB1d=function(){return this.Aa};g1D.prototype.$wa$rN5So=function(){return this.oa};_.os(_.nNr,g1D);
_.x();
_.$7r=_.y("XN4wKf",[_.lr]);
_.v("XN4wKf");
var jxG=class extends _.ms{static Sa(){return{service:{uf:_.kw}}}constructor(a){super();this.uf=a.service.uf}oa(){var a=this.getRoot().closest(_.go("Lv2Cle"));_.ai(this.getData("irtcp"),!1)&&a.find(".ZGKPYc").setStyle("max-height","unset");var b=_.no(a,"[data-ni]");_.Vg(a.el(),"XGRTMd");_.Vg(a.el(),"DdQV6c");this.getRoot().hide();_.aw([new _.On(this.getRoot().el(),"hide")]);_.bw(this.getRoot().el());a=_.no(a,".aQ9ZH");a.show();_.aw([new _.On(a.el(),"show")]);this.uf.NT(b);return!1}};
jxG.prototype.$wa$in3Ghc=function(){return this.oa};_.os(_.$7r,jxG);
_.x();
});
// Google Inc.
