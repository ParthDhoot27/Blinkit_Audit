loaded_h_0(function(_){var window=this;
_.v("lOO0Vd");
_.$ob=new _.dQa(_.PTa);
_.x();
var bpb;bpb=function(a){if(a.w9c){let b=Date.now()-a.lPe;return a.w9c(a.NXb+1,b)}return Math.random()*Math.min(a.Fne*Math.pow(a.Kvc,a.NXb),a.nwe)};_.cpb=function(a){if(!a.H5a())throw Error("Ve`"+a.fAb);++a.NXb;a.Jvc=bpb(a)};_.dpb=class{constructor(a,b,c,d,e,f){this.fAb=a;this.Fne=b;this.Kvc=c;this.nwe=d;this.yHe=e;this.w9c=f||null;this.lPe=Date.now();this.NXb=0;this.Jvc=bpb(this)}wkd(){return this.NXb}H5a(a){return this.NXb>=this.fAb?!1:a!=null?!!this.yHe[a]:!0}};
_.v("P6sQOc");
var epb=function(a){var b={};_.Ja(a.Da(),e=>{b[e]=!0});var c=a.Ea(),d=a.Ha();return new _.dpb(a.Ca(),_.Ae(c.getSeconds())*1E3,a.Ba(),_.Ae(d.getSeconds())*1E3,b)},fpb=new _.Cq("retryConfigOverrides"),gpb=function(a,b,c,d){return c.then(e=>e,e=>{if(e instanceof _.ei){if(!e.status||!d.H5a(e.status.Vq()))throw e;}else if("function"==typeof _.flb&&e instanceof _.flb)switch(e.oa){case 103:case 7:case 10:case 101:case 105:case 408:case 425:case 429:case 502:case 503:case 504:break;default:throw e;}if(d&&
!d.H5a())return _.yh(e);var f=d.Jvc;return(new _.Mg(g=>{setTimeout(g,f)})).then(()=>{_.cpb(d);var g=d.wkd();b=b.Bz(_.TYa,g);return gpb(a,b,a.fetch(b),d)})})};
_.Zf(class{constructor(){this.oa=_.Kf(_.Zob);this.Aa=_.Kf(_.$ob);this.logger=null;var a=_.Kf(_.Tjb);this.fetch=a.fetch.bind(a)}Hhb(a,b){if(this.Aa.getType(a.Qt())!==1)return new _.Yjb(a,null,0);var c=this.oa.policy,d=_.Dq(a,fpb),e=null;if(d){e={};if(d.PXb)for(var f of d.PXb)e[f]=!0;else if(c)for(var g of c.Da())e[g]=!0;let n=1,q=0;f=Infinity;g=2;if(c){n=c.Ca()||n;let t,A=(t=c.Ma())==null?void 0:t.getSeconds();q=_.Ae(c.Na().getSeconds())*1E3;f=A!=null?_.Ae(A)*1E3:f;g=c.Ba()||g}var h,k,l;let r;c=(h=
d.maxAttempts)!=null?h:n;h=(k=d.KJc)!=null?k:q;k=(l=d.trb)!=null?l:g;l=(r=d.ePc)!=null?r:f;e=new _.dpb(c,h,k,l,e,d.U1d)}else c&&(e=epb(c));e&&e.H5a()?(b=gpb(this,a,b,e),a=new _.Yjb(a,b,2)):a=new _.Yjb(a,null,0);return a}},_.apb);
_.x();
});
// Google Inc.
