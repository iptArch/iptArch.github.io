var PARAMS=getParams();


var colors=["#23c1e3","#f58240","#ed028c","#c4d830","#fff101","#ff382d"];

sd = new showdown.Converter(),
renderPortfolio();
console.log("v1.0");


async function renderPortfolio(){
  fetch("https://api.github.com/repos/iptArch/iptArch.github.io/issues")
    .then(x=>x.json())
    .then(async function(data){
      out=[];
      for(var i=0;i<data.length;i++){
        if(PARAMS.id){
          if(PARAMS.id==data[i].id){
            var temp=await renderPortfolioItem(data[i],i);
            out.push(temp);
          }
        }else{
          var temp=await renderPortfolioItem(data[i],i);
          out.push(temp);
        }
      }
      html=out.reduce((acc,cur)=>acc+cur,"");
      document.getElementById("portfolioBody").innerHTML=html;
    })
}


async function renderPortfolioItem(data,i){
  var num=i+1;
  if(num<10){
    num="0"+num;
  }
  //console.log(data)
  if(data.state!="open"){
    return "";
  }
  html=sd.makeHtml(data.body);
  let response = await fetch(data.comments_url).then(x=>x.json());
  //console.log(data.comments_url,response);
  comments=response.map(x=>sd.makeHtml(x.body));
  var commentsHTML=comments.reduce((acc,cur)=>acc+cur,"");
  if(PARAMS.id){
    return `
              <div class="portfolioItem">
                <h2>${data.title||""}</h2>
                <span class="numberHeader" style="color:${colors[i%colors.length]}"><b><i>${num}</i></b></span>
                ${html}
                <div class="comments">${commentsHTML}</div>
              </div>
            `;
  }else{
    return `<a href="./project.html?id=${data.id}">
              <div class="portfolioItem">
                <h2>${data.title||""}</h2>
                <span class="numberHeader" style="color:${colors[i%colors.length]}"><b><i>${num}</i></b></span>
                ${html}
                <div class="comments">${commentsHTML}</div>
              </div>
            </a>`;
  }

}


function getParams(){
  var data=window.location.search.substring(1).split("&").map(x=>x.split("="));
  var out={};
  data.map(function(x){
    out[x[0]]=x[1];
  })
  return out;
}



function mobileMenu(){
  if(document.getElementById("menuButton").innerHTML=="close"){//Opened
    document.getElementById("menuButton").innerHTML="menu";
    document.getElementById("mobileMenu").style.display="none";
  }else{//Closed
    document.getElementById("menuButton").innerHTML="close";
    document.getElementById("mobileMenu").style.display="block";
  }
}
