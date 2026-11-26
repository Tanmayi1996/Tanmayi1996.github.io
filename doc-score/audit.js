document.addEventListener("DOMContentLoaded", function () {
  var $ = function (id) { return document.getElementById(id); };
  var paths = [
    "/docs/mini-projects/release-note-composer.html",
    "/docs/mini-projects/api-response-explorer.html",
    "/docs/mini-projects/documentation-health-analyzer.html",
    "/docs/mini-projects/markdown-table-builder.html",
    "/docs/mini-projects/implementation-notes.html",
    "/docs/mini-projects/validation-plan.html",
    "/docs/portfolio-projects/ai-release-notes-generator.html",
    "/docs/portfolio-projects/api-documentation-toolkit.html",
    "/docs/portfolio-projects/documentation-quality-checker.html"
  ];
  var weights = [
    ["Structure & navigation",20],["Task readiness",20],["Technical completeness",20],
    ["Clarity & readability",15],["Links & references",15],["Machine readability",10]
  ];
  var chosenFiles = [];
  var fetchedDocument = null;
  var report = "";

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function wc(value) {
    return (value.match(/\b[\w'-]+\b/g) || []).length;
  }
  function parseDoc(raw, name) {
    var isHtml = /^\s*<!doctype html|^\s*<html|<body[\s>]/i.test(raw);
    var text = raw, title = "", headings = [], links = [], images = [], lists = 0, tables = 0, code = 0;
    if (isHtml) {
      var d = new DOMParser().parseFromString(raw, "text/html");
      title = d.title || "";
      d.querySelectorAll("script,style,nav,header,footer,aside,button,input,svg").forEach(function (n) { n.remove(); });
      var root = d.querySelector("main,article,.content,.article") || d.body;
      text = (root.innerText || root.textContent || "").replace(/\s+/g, " ").trim();
      headings = Array.from(root.querySelectorAll("h1,h2,h3,h4,h5,h6")).map(function (n) { return Number(n.tagName.slice(1)); });
      links = Array.from(root.querySelectorAll("a")).map(function (n) { return {text:n.textContent.trim(),href:n.getAttribute("href") || ""}; });
      images = Array.from(root.querySelectorAll("img")).map(function (n) { return n.getAttribute("alt"); });
      lists = root.querySelectorAll("ul,ol").length;
      tables = root.querySelectorAll("table").length;
      code = root.querySelectorAll("pre,code").length;
    } else {
      headings = Array.from(raw.matchAll(/^(#{1,6})\s+(.+)$/gm)).map(function (m) { return m[1].length; });
      title = (raw.match(/^#\s+(.+)$/m) || [])[1] || "";
      links = Array.from(raw.matchAll(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g)).map(function (m) { return {text:m[1],href:m[2]}; });
      images = Array.from(raw.matchAll(/!\[([^\]]*)\]\([^)]+\)/g)).map(function (m) { return m[1]; });
      lists = (raw.match(/^\s*[-*+]\s|^\s*\d+\.\s/gm) || []).length;
      tables = /^\s*\|.*\|\s*$/m.test(raw) ? 1 : 0;
      code = (raw.match(/^\x60\x60\x60/gm) || []).length / 2;
    }
    return {name:name,raw:raw,text:text,title:title,headings:headings,links:links,images:images,lists:lists,tables:tables,code:code,isHtml:isHtml};
  }

  function audit(doc) {
    var t=doc.text, words=wc(t);
    var sentences=t.split(/[.!?]+(?:\s+|$)/).filter(function (s) { return wc(s)>0; });
    var avg=sentences.length ? words/sentences.length : 0;
    var h1=doc.headings.filter(function (n) { return n===1; }).length;
    var h2=doc.headings.filter(function (n) { return n===2; }).length;
    var skipped=doc.headings.some(function (n,i) { return i>0 && n>doc.headings[i-1]+1; });
    var generic=doc.links.filter(function (x) { return /^(here|click here|read more|more|link|learn more)$/i.test(x.text); }).length;
    var paras=doc.raw.split(/\n\s*\n/).filter(function (x) { return wc(x)>0 && !/^\x60\x60\x60/.test(x); });
    var longP=paras.some(function (x) { return wc(x)>100; });
    var passive=(t.match(/\b(?:is|are|was|were|be|been|being)\s+(?:\w+ed|\w+en)\b/gi)||[]).length;
    var prereq=/\b(before you begin|prerequisite|requirements?|you need|requires? python|installation|supported versions?)\b/i.test(t);
    var steps=/\b(step\s+\d+|first,|next,|then,|select\s|enter\s|click\s|choose\s|run\s|open\s|configure\s|install\s)\b/i.test(t);
    var expected=/\b(expected result|you should see|successfully|returns?\s+\d{3}|the output|verify that)\b/i.test(t);
    var recovery=/\b(troubleshoot|error|failure|retry|does not work|known limitations|limitations)\b/i.test(t);
    var version=/\b(v?\d+\.\d+(?:\.\d+)?|python\s+\d|version\s+\d|supported versions?)\b/i.test(t);
    var fields=/\b(field|parameter|property|request body|response body|schema|type)\b/i.test(t)&&(doc.tables>0||/\b(required|optional|string|integer|boolean|array)\b/i.test(t));
    var examples=/\b(example|sample|request|response|output)\b/i.test(t)||doc.code>0;
    var limits=/\b(limitations?|does not|cannot|not supported|known constraints?)\b/i.test(t);
    var purpose=t.length>180&&/you can|use this|this guide|intended for|helps you|allows you/i.test(t.slice(0,650));
    var checks=[];
    function add(cat,label,points,pass,suggestion){checks.push({category:cat,label:label,points:points,pass:!!pass,suggestion:suggestion});}
    add("Structure & navigation","Clear page title",4,!!doc.title&&doc.title.length>5,"Give the page a specific title.");
    add("Structure & navigation","One main heading",4,h1===1,"Use one H1 heading for the page title.");
    add("Structure & navigation","Section headings",4,h2>=2,"Break the page into meaningful H2 sections.");
    add("Structure & navigation","Heading hierarchy",4,!skipped,"Do not skip heading levels.");
    add("Structure & navigation","Scannable content",4,doc.lists+doc.tables+doc.code>0,"Use lists, tables, or code examples where they help scanning.");
    add("Task readiness","Purpose and audience",4,purpose,"State who the page is for and what the reader can do.");
    add("Task readiness","Actionable procedure",5,steps&&doc.lists>=2,"Write numbered steps with clear action verbs.");
    add("Task readiness","Prerequisites",3,prereq,"List required access, permissions, software, and setup.");
    add("Task readiness","Expected result",4,expected,"Explain what success looks like or how to verify it.");
    add("Task readiness","Recovery guidance",4,recovery,"Add troubleshooting guidance for common errors and failures.");
    add("Technical completeness","Examples or code",4,examples,"Include realistic request, response, command, configuration, or output examples.");
    add("Technical completeness","Field definitions",4,fields,"Define parameters, data types, and required or optional fields.");
    add("Technical completeness","Version context",4,version,"State supported versions or environment details.");
    add("Technical completeness","Errors and constraints",4,limits||/\b(400|401|403|404|409|422|500)\b/.test(t),"Document errors, edge cases, limits, and unsupported behavior.");
    add("Technical completeness","Output description",4,expected||/\b(returns?|displays?|creates?|generates?|saves?|updates?)\b/i.test(t),"Describe the result of each important operation.");
    add("Clarity & readability","Sentence length",5,avg<=25,"Aim for an average sentence length of 25 words or fewer.");
    add("Clarity & readability","Paragraph focus",3,!longP,"Split paragraphs longer than about 100 words.");
    add("Clarity & readability","Active voice signals",3,sentences.length===0||passive/Math.max(1,sentences.length)<=0.12,"Use active voice when it makes the actor and action clearer.");
    add("Clarity & readability","Useful content depth",4,words>=120&&words<=6500,"Provide enough detail; split unrelated topics into separate pages.");
    add("Links & references","Reference links",4,doc.links.length>0,"Link to related procedures, concepts, and authoritative references.");
    add("Links & references","Descriptive link text",4,doc.links.length===0||generic===0,"Replace vague labels such as click here with descriptive link text.");
    add("Links & references","Image alternatives",3,doc.images.length===0||doc.images.every(function (a) { return a!==null&&a.trim().length>0; }),"Add meaningful alt text to informative images.");
    add("Links & references","Reference context",4,doc.links.length===0||doc.links.some(function (x) { return /^https?:/.test(x.href); })||/see also|related|reference|documentation|guide/i.test(t),"Explain why readers should open a linked resource.");
    add("Machine readability","Readable text volume",3,words>=120,"Provide enough text for search and retrieval systems.");
    add("Machine readability","Structured sections",3,h2>=2,"Use logical section headings so readers and parsers can find topics.");
    add("Machine readability","Lists or tables",2,doc.lists>=2||doc.tables>0,"Use semantic lists or tables for procedures and field definitions.");
    add("Machine readability","Labeled code blocks",2,doc.code===0||doc.isHtml||/\x60\x60\x60[a-z0-9_-]+/i.test(doc.raw),"Add language identifiers to fenced code blocks.");

    var categoryScores={};
    checks.forEach(function (check) {
      if (!categoryScores[check.category]) categoryScores[check.category]={got:0,max:0};
      categoryScores[check.category].max+=check.points;
      if (check.pass) categoryScores[check.category].got+=check.points;
    });
    Object.keys(categoryScores).forEach(function (key) {
      categoryScores[key]=Math.round(categoryScores[key].got/categoryScores[key].max*100);
    });
    var total=0;
    weights.forEach(function (entry) { total+=categoryScores[entry[0]]*entry[1]/100; });
    return {name:doc.name,words:words,score:Math.round(total),categories:categoryScores,checks:checks};
  }

  function render(documents) {
    var results=documents.map(audit);
    var overall=Math.round(results.reduce(function (s,x) { return s+x.score; },0)/results.length);
    var averages={};
    weights.forEach(function (entry) {
      averages[entry[0]]=Math.round(results.reduce(function (s,x) { return s+x.categories[entry[0]]; },0)/results.length);
    });
    $("score").textContent=overall;
    $("grade").textContent=overall>=90?"Excellent":overall>=80?"Strong":overall>=70?"Good foundation":overall>=60?"Needs focus":"Needs revision";
    $("summary").textContent="Average score across "+documents.length+" document(s). Use the category breakdown to prioritize revision.";
    $("stats").textContent=documents.length+" documents · "+results.reduce(function (s,x) { return s+x.words; },0).toLocaleString()+" words";
    $("categories").innerHTML=weights.map(function (entry) {
      var v=averages[entry[0]];
      return '<div class="cat"><b>'+v+'</b>'+esc(entry[0])+'<div class="bar"><i style="width:'+v+'%"></i></div><small>Weight '+entry[1]+'%</small></div>';
    }).join("");
    var aggregated={};
    results.forEach(function (result) {
      result.checks.filter(function (c) { return !c.pass; }).forEach(function (c) {
        var key=c.category+"|"+c.label;
        if (!aggregated[key]) aggregated[key]={category:c.category,label:c.label,suggestion:c.suggestion,count:0};
        aggregated[key].count++;
      });
    });
    var suggestions=Object.values(aggregated).sort(function (a,b) { return b.count-a.count; }).slice(0,9);
    $("suggestions").innerHTML=suggestions.length?suggestions.map(function (x,i) {
      return '<div class="finding"><b><span class="tag">REVIEW</span> '+(i+1)+'. '+esc(x.label)+'</b><p><b>'+esc(x.category)+':</b> '+esc(x.suggestion)+' Found in '+x.count+' document(s).</p></div>';
    }).join(""):"<p>No rule-based suggestions. Review technical accuracy and reader feedback too.</p>";
    $("documents").innerHTML=results.map(function (x) {
      return '<div class="finding"><b>'+esc(x.name)+' — '+x.score+'/100</b><p>'+x.words+' words</p></div>';
    }).join("");
    $("checks").innerHTML=results.map(function (x) {
      return '<h4>'+esc(x.name)+' · '+x.score+'/100</h4>'+x.checks.map(function (c) {
        return '<p><span class="tag '+(c.pass?"pass":"")+'">'+(c.pass?"PASS":"REVIEW")+'</span> <b>'+esc(c.label)+'</b> · '+esc(c.category)+(c.pass?"":" — "+esc(c.suggestion))+'</p>';
      }).join("");
    }).join("");
    report="DOC SCORE LAB REPORT\nOverall score: "+overall+"/100\nDocuments: "+documents.length+"\n"+
      weights.map(function (x) { return x[0]+": "+averages[x[0]]+"/100"; }).join("\n")+
      "\n\nSuggestions:\n"+suggestions.map(function (x) { return x.label+": "+x.suggestion; }).join("\n")+
      "\n\nMethod: deterministic content heuristics. This report does not verify factual accuracy, live links, security, accessibility, or infrastructure.";
    $("results").classList.add("show");
    $("results").scrollIntoView({behavior:"smooth"});
  }

  document.querySelectorAll(".tab").forEach(function (button) {
    button.addEventListener("click",function () {
      document.querySelectorAll(".tab").forEach(function (tab) { tab.classList.toggle("active",tab===button); });
      document.querySelectorAll(".mode").forEach(function (mode) { mode.classList.toggle("active",mode.id===button.dataset.mode); });
    });
  });
  $("upload").addEventListener("change",function (event) {
    chosenFiles=Array.from(event.target.files);
    $("filenames").textContent=chosenFiles.map(function (file) { return file.name; }).join(" · ")||"No files selected.";
  });
  $("fetch").addEventListener("click",async function () {
    $("urlstatus").textContent="Fetching the page in your browser...";
    $("urlstatus").classList.remove("error");
    fetchedDocument=null;
    try {
      var address=new URL($("urlinput").value.trim());
      if(address.protocol!=="http:"&&address.protocol!=="https:")throw new Error("Enter an HTTP or HTTPS URL.");
      var response=await fetch(address.href,{mode:"cors",credentials:"omit"});
      if(!response.ok)throw new Error("The website returned HTTP "+response.status+".");
      var contentType=response.headers.get("content-type")||"";
      if(!/(text\/html|text\/plain|application\/xhtml\+xml)/i.test(contentType))throw new Error("The URL must return HTML or plain text.");
      var content=await response.text();
      fetchedDocument=parseDoc(content,address.hostname+address.pathname);
      $("urlstatus").textContent="Page loaded. Select Analyze documentation to run the audit.";
    } catch(error) {
      $("urlstatus").textContent=error instanceof TypeError?"The website blocked browser access (often a CORS restriction). Paste or upload the content instead.":error.message;
      $("urlstatus").classList.add("error");
    }
  });

  $("portfolio").addEventListener("click",async function () {
    var button=$("portfolio");button.disabled=true;$("status").textContent="Loading portfolio documentation...";$("status").classList.remove("error");
    try {
      var docs=await Promise.all(paths.map(async function (path) {
        var response=await fetch(path);
        if (!response.ok) throw new Error("Could not load "+path+" (HTTP "+response.status+").");
        return parseDoc(await response.text(),path.split("/").pop());
      }));
      render(docs);$("status").textContent="Portfolio documentation audit complete.";
    } catch (error) {
      $("status").textContent=error.message;$("status").classList.add("error");
    } finally { button.disabled=false; }
  });
  $("analyze").addEventListener("click",async function () {
    $("status").textContent="";$("status").classList.remove("error");
    try {
      var mode=document.querySelector(".tab.active").dataset.mode,docs=[];
      if (mode==="paste") {
        var text=$("doctext").value.trim();
        if (!text) throw new Error("Paste documentation content first.");
        docs.push(parseDoc(text,$("docname").value.trim()||"Pasted document"));
      } else if (mode==="files") {
        if (!chosenFiles.length) throw new Error("Select one or more files first.");
        for (var i=0;i<chosenFiles.length;i++) {
          var file=chosenFiles[i];
          if (file.size>3145728) throw new Error(file.name+" exceeds the 3 MB file limit.");
          docs.push(parseDoc(await file.text(),file.name));
        }
      } else {
        if (!fetchedDocument) throw new Error("Fetch a public URL before running the audit.");
        docs.push(fetchedDocument);
      }
      render(docs);$("status").textContent="Analysis complete. Review the suggestions and check-by-check results.";
    } catch (error) {
      $("status").textContent=error.message;$("status").classList.add("error");
    }
  });
  $("copy").addEventListener("click",async function () {
    if (!report) return;
    try { await navigator.clipboard.writeText(report);$("status").textContent="Audit report copied to clipboard."; }
    catch (error) { $("status").textContent="Clipboard access is unavailable in this browser.";$("status").classList.add("error"); }
  });
  $("reset").addEventListener("click",function () {
    chosenFiles=[];fetchedDocument=null;report="";$("doctext").value="";$("docname").value="My documentation sample";
    $("upload").value="";$("filenames").textContent="No files selected.";$("urlinput").value="";$("urlstatus").textContent="";
    $("status").textContent="Inputs cleared.";$("status").classList.remove("error");$("results").classList.remove("show");
    document.querySelector('.tab[data-mode="paste"]').click();
  });
});