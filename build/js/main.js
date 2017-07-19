"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function Carousel(e){function t(e,t,n){var r=L.querySelectorAll("."+g+" > ul li")[e];r.style.marginLeft=t,L.querySelector("."+g+" > ul").removeChild(r),L.querySelector("."+g+" > ul").insertAdjacentHTML(n,r.outerHTML)}function n(){var e=document.createElement("ul");e.classList.add(T),e.addEventListener("click",a.bind(this));for(var t=0;t<W;t++){var n=document.createElement("li");n.setAttribute("data-position",t),e.appendChild(n)}L.appendChild(e),r()}function r(){switch([].forEach.call(L.querySelectorAll("."+T+" li"),function(e){e.classList.remove("is-active")}),I){case-1:I=W-1;break;case W:I=0;break;default:I=I}L.querySelectorAll("."+T+" li")[I].classList.add("is-active")}function a(e){"LI"===e.target.tagName&&s(e.target.getAttribute("data-position"))}function l(){var e=document.createElement("button");e.innerHTML=q,e.classList.add(w);var t=document.createElement("button");t.innerHTML=k,t.classList.add(x),e.addEventListener("click",d),t.addEventListener("click",p),L.appendChild(e),L.appendChild(t)}function o(){var e=document.createElement("button");e.innerHTML=S,e.classList.add($),e.addEventListener("click",_);var t=document.createElement("button");t.innerHTML=A,t.classList.add(j),t.addEventListener("click",E),L.appendChild(e),L.appendChild(t)}function i(e){e.style.marginLeft=""}function c(e){e.style.marginLeft=-L.offsetWidth+"px"}function s(e){var t=I-e;t<0?u(-t,p):u(t,d)}function u(e,t){for(var n=0;n<e;n++)t()}function d(){e.infinite?m():f()}function m(){i(document.querySelectorAll("."+g+" > ul li")[0]),t(W-1,-L.offsetWidth+"px","afterBegin"),h(-1)}function f(){E(),0!==I&&(i(document.querySelectorAll("."+g+" > ul li")[I-1]),h(-1))}function p(){e.infinite?v():y()}function v(){c(document.querySelectorAll("."+g+" > ul li")[1]),t(0,"","beforeEnd"),h(1)}function y(){if(I===W-1)return void E();c(document.querySelectorAll("."+g+" > ul li")[I]),h(1)}function h(t){I+=t,e.dots&&r()}function _(){P||(P=setInterval(p.bind(this),C))}function E(){clearInterval(P),P=null}function b(){return I}var L=document.getElementById(e.elem||"carousel"),C=e.interval||3e3,S=e.btnPlayText||"Play",A=e.btnStopText||"Stop",k=e.arrNextText||"&rsaquo;",q=e.arrPrevText||"&lsaquo;",g="js-Carousel",w="js-Carousel-arrowPrev",x="js-Carousel-arrowNext",T="js-Carousel-dots",j="js-Carousel-btnStop",$="js-Carousel-btnPlay",W=L.querySelectorAll("li").length,I=0,P=null;return W>1&&function(){var r={dots:function(){return n()},arrows:function(){return l()},buttons:function(){return o()},autoplay:function(){return _()},infinite:function(){return t(W-1,-L.offsetWidth+"px","afterBegin")},initial:function(){return s(e.initial>=W?W:e.initial)}};for(var a in r)e.hasOwnProperty(a)&&e[a]&&r[a]()}(),{live:b,show:s,prev:d,next:p,play:_,stop:E}}var headerBlock=document.querySelector(".header"),headerImg=document.querySelector(".header__images");window.screen.availWidth>=1280&&window.screen.availWidth<=1920?headerImg.style.left=-(1920-headerBlock.clientWidth)/2+"px":window.screen.availWidth>=1920&&(headerImg.style.left=(headerBlock.clientWidth-1920)/2+"px");var carousel=new Carousel({elem:"carousel",autoplay:!0,infinite:!0,interval:3e3,initial:0,dots:!1,arrows:!1,buttons:!1,btnStopText:"Pause"}),avatars=[].concat(_toConsumableArray(document.querySelectorAll(".client__ava"))),layout=document.querySelector(".clients"),hoverAva=function(e){var t=e.target,n=avatars.filter(function(e){return e!==t}),r=t.parentElement,a=t.parentElement.parentElement,l=t.parentElement.parentElement.parentElement;if("client__ava"===t.classList.value){var o=(t.parentElement.parentElement.parentElement.parentElement,document.createElement("div"));o.classList="comment__overlay",t.hasAttribute("checked")||(t.setAttribute("checked",""),t.appendChild(o),l.classList.add("border__transparent"),a.classList.add("border__transparent"),r.classList.add("border__transparent"),n.map(function(e){return e.parentElement.parentElement.parentElement.parentElement.classList.add("hiddensss")}))}};avatars.map(function(e){e.addEventListener("click",hoverAva)});var disableComment=function(){document.querySelector(".comment__overlay").remove(),avatars.map(function(e){e.removeAttribute("checked"),e.parentElement.parentElement.parentElement.parentElement.classList.remove("hiddensss"),e.parentElement.parentElement.parentElement.classList.remove("border__transparent"),e.parentElement.parentElement.classList.remove("border__transparent"),e.parentElement.classList.remove("border__transparent")})};document.addEventListener("click",function(e){"comment__overlay"!==e.target.classList.value&&"comment__close"!==e.target.classList.value||disableComment()});var showCallback=function(e){var t=e.querySelector(".form__callback");t.style.display="block",e.querySelector(".form__btn").style.background="#8E0E3D",setTimeout(function(){t.style.display="none"},4e3)};$(document).ready(function(){$("#header__form").submit(function(){return $.ajax({type:"GET",url:"../mail.php",data:$("#header__form").serialize()}).done(showCallback(document.querySelector("#header__form"))),!1}),$("#start__form").submit(function(){return $.ajax({type:"GET",url:"../mail.php",data:$("#start__form").serialize()}).done(showCallback(document.querySelector("#start__form"))),!1}),$("#footer__form").submit(function(){return $.ajax({type:"GET",url:"../mail.php",data:$("#footer__form").serialize()}).done(showCallback(document.querySelector("#footer__form"))),!1})});