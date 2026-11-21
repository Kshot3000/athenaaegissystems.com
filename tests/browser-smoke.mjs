// Browser-only smoke suite; run in GitHub Actions (not in the static site).
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const ORIGIN = "http://127.0.0.1:8874";
const pages = ["index.html","athena.html","aegis.html","experience.html","editions.html","integration.html","legal.html","terminal-preview.html","404.html"];
const failures = [];
const axeScript = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const server = spawn("python3", ["-m","http.server","8874","--bind","127.0.0.1"], {stdio:"ignore"});
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
let browser;
try {
  for (let attempt=0; attempt<30; attempt++) {
    try { const response=await fetch(ORIGIN+"/index.html"); if(response.ok) break; } catch { /* server starting */ }
    await sleep(200);
  }
  await mkdir("qa-screenshots",{recursive:true});
  browser = await chromium.launch({headless:true,channel:"chrome"});
  for (const width of [320,360,390,768,960,1024,1440]) {
    const context = await browser.newContext({
      viewport: {width,height:width>=1024?900:width>=768?1024:844},
      reducedMotion:"reduce", deviceScaleFactor:1
    });
    await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
    for(const pathname of pages) {
      const page=await context.newPage();
      const errors=[];
      page.on("pageerror", error => errors.push(error.message));
      try {
        const response = await page.goto(ORIGIN+"/"+pathname,{waitUntil:"load",timeout:18000});
        assert.equal(response.status(),200,pathname+" must load");
        const audit = await page.evaluate(() => {
          const images=[...document.images].filter(img=>img.complete && !img.naturalWidth).map(img=>img.getAttribute("src"));
          return {
            width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
            h1:document.querySelectorAll("h1").length,
            main:document.querySelectorAll("main").length,
            images
          };
        });
        assert.equal(audit.h1,1,pathname+" has one H1");
        assert.equal(audit.main,1,pathname+" has main");
        assert.equal(audit.images.length,0,pathname+" missing images "+audit.images.join(","));
        assert.ok(audit.scrollWidth<=width+5,pathname+" horizontal overflow "+audit.scrollWidth+" vs "+width);
        assert.deepEqual(errors,[],pathname+" uncaught JS");
        if(pathname === "index.html" && width <= 680) {
          const images = await page.evaluate(() => performance.getEntriesByType("resource").map(entry => new URL(entry.name).pathname));
          for (const persona of ["athena","aegis"]) {
            assert.ok(images.includes("/assets/"+persona+"-hero-mobile.webp"),"missing phone hero");
            assert.ok(!images.includes("/assets/"+persona+"-canon.jpg"),"downloaded both sizes of the hero");
          }
        }
        if((width===390||width===1440)&&["index.html","editions.html","terminal-preview.html","aegis.html"].includes(pathname)){
          await page.screenshot({path:"qa-screenshots/"+pathname.replace(".html","")+"-"+width+".png",animations:"disabled"});
        }
        if(width===390 || width===1440) {
          await page.addScriptTag({path:axeScript});
          const violations=await page.evaluate(async () => {
            const report = await window.axe.run(document, {runOnly:{type:"tag", values:["wcag2a","wcag2aa","wcag21a","wcag21aa"]}});
            return report.violations.map(rule => ({
              rule:rule.id,
              nodes:rule.nodes.map(node=>[node.target.join(" "), node.any.map(check=>check.message).join(" ")]),
            }));
          });
          for(const issue of violations) console.error("Accessibility",pathname,width,issue.rule,JSON.stringify(issue.nodes));
          assert.equal(violations.length,0,pathname+" automated accessibility findings");
        }
        console.log("PASS",pathname,width+"px");
      } catch(err) {
        failures.push(pathname+" / "+width+": "+String(err.message).slice(0,400));
        console.log("FAIL",pathname,width+"px",String(err.message).slice(0,300));
        try {await page.screenshot({path:"qa-screenshots/failed-"+pathname.replace(".html","")+"-"+width+".png",animations:"disabled"});}catch{}
      } finally {await page.close();}
    }
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  const page=await context.newPage();
  const interactionErrors=[];
  page.on("pageerror",error=>interactionErrors.push(error.message));
  try{
    await page.goto(ORIGIN+"/terminal-preview.html?device=mobile&mode=aegis",{waitUntil:"load"});
    assert.equal(await page.locator("body").getAttribute("data-preview-mode"),"aegis");
    assert.equal(await page.locator("body").getAttribute("data-preview-device"),"mobile");
    await page.locator("#mode-switch [data-mode=athena]").click();
    assert.equal(await page.locator("body").getAttribute("data-preview-mode"),"athena");
    await page.locator("#device-switch [data-device=desktop]").click();
    assert.equal(await page.locator("body").getAttribute("data-preview-device"),"desktop");
    await page.locator('#terminal-actions [data-workflow="build"]').click();
    assert.equal(await page.locator('#terminal-actions [data-workflow="build"]').getAttribute("aria-pressed"),"true","selected workflow button should be announced");
    await page.locator("#terminal-input").fill("Plan a new desktop AI app");
    await page.locator("#terminal-compose-form button[type=submit]").click();
    const answer=await page.locator("#terminal-response-text").innerText();
    assert.ok(answer.includes("model runner")||answer.includes("Architecture"),"plan should route to build: "+answer);
    await page.locator("#mode-switch [data-mode=aegis]").click();
    await page.locator("#terminal-input").fill("Which actions need human approval?");
    await page.locator("#terminal-compose-form button[type=submit]").click();
    const caution=await page.locator("#terminal-response-text").innerText();
    assert.match(caution,/human approves/);
    assert.match(await page.locator("#terminal-demo-note").innerText(),/scripted local preview/i);
    await page.locator("#terminal-input").fill("A private draft");
    await page.locator("#device-switch [data-device=mobile]").click();
    assert.equal(await page.locator("#terminal-response-text").innerText(),caution);
    assert.equal(await page.locator("#terminal-input").inputValue(),"A private draft");
    assert.equal(await page.locator(".preview-matrix-card[aria-pressed=true]").count(),1);
    const shared=new URL(page.url());
    assert.equal(shared.searchParams.get("mode"),"aegis");
    assert.equal(shared.searchParams.get("device"),"mobile");
    assert.ok(!shared.href.includes("draft"));
    assert.match(await page.locator("#preview-access").getAttribute("href"),/interest=android#contact$/);
    await page.locator("#mode-switch [data-mode=athena]").click();
    assert.equal(await page.locator("#terminal-response-text").innerText(),answer);
    await page.goBack();
    assert.equal(await page.locator("#terminal-input").inputValue(),"A private draft");
    const fresh=await context.newPage();
    await fresh.goto(shared.href);
    assert.equal(await fresh.locator("body").getAttribute("data-preview-mode"),"aegis");
    assert.equal(await fresh.locator("#terminal-input").inputValue(),"");
    await fresh.close();
    await page.locator(".preview-matrix-card[data-mode=athena][data-device=desktop]").click();
    assert.ok(await page.locator("#preview-lab-title").evaluate(el=>el===document.activeElement));
    await page.locator("#terminal-input").fill("Hello, how much is the subscription?");
    await page.locator("#terminal-compose-form button[type=submit]").click();
    assert.match(await page.locator("#terminal-response-text").innerText(),/\$19\.99/);
    assert.match(await page.locator("#preview-access").getAttribute("href"),/interest=windows#contact$/);
    for (const mode of ["athena","aegis"]) {
      await page.locator("#mode-switch [data-mode="+mode+"]").click();
      await page.locator("#terminal-voice").click();
      await page.getByText("Playing prerecorded voice sample").waitFor({timeout:5000});
      assert.equal(await page.locator("#terminal-voice").getAttribute("aria-pressed"),"true");
      await page.locator("#terminal-voice").click();
      await page.getByText("Voice sample stopped").waitFor();
    }
    console.log("PASS all four preview combinations, local drafts, history, shared URL, keyboard focus, pricing and both recorded voices");
  }catch(err){failures.push("terminal interactions: "+err.message);console.log("FAIL terminal interactions",err.message.slice(0,400));}
  try{
    await page.goto(ORIGIN+"/index.html",{waitUntil:"load"});
    await page.locator(".nav-toggle").click();
    assert.equal(await page.locator(".nav-toggle").getAttribute("aria-expanded"),"true");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".nav-toggle").getAttribute("aria-expanded"),"false");
    assert.ok(await page.locator(".nav-toggle").evaluate(el=>el===document.activeElement));
    await page.locator(".nav-toggle").click();
    await page.locator(".primary-nav a").last().focus();
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(".nav-toggle").getAttribute("aria-expanded"),"false");
    console.log("PASS mobile navigation toggle/Escape");
  }catch(err){failures.push("mobile navigation: "+err.message);console.log("FAIL mobile navigation",err.message.slice(0,400));}
  try {
    for (const [card, interest, value] of [["desktop","windows","Desktop Edition"],["mobile","android","Android Edition"]]) {
      await page.goto(ORIGIN+"/editions.html#"+card);
      await page.locator("#"+card+" a.button").click();
      await page.waitForURL(url => url.searchParams.get("interest")===interest && url.hash==="#contact");
      await page.locator("#inquiry-form").waitFor({state:"visible"});
      assert.equal(await page.locator("#inquiry-plan").inputValue(),value);
    }
    await page.locator("#inquiry-name").fill("Browser QA");
    await page.locator("#inquiry-email").fill("qa@example.invalid");
    await page.locator("#inquiry-message").fill("Android & Windows + accessibility");
    await page.locator("#inquiry-form button[type=submit]").click();
    const mail=new URL(await page.locator("#inquiry-mailto").getAttribute("href"));
    assert.equal(mail.protocol,"mailto:");
    assert.match(mail.searchParams.get("subject"),/Android edition/);
    assert.match(mail.searchParams.get("body"),/Android & Windows \+ accessibility/);
    assert.ok(!page.url().includes("example.invalid"));
    const draft=page.locator("#inquiry-draft-text");
    await context.grantPermissions(["clipboard-read","clipboard-write"]);
    await page.locator("#inquiry-copy").click();
    await page.getByText("Email copied, including the recipient and subject.").waitFor();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),await draft.inputValue());
    await page.evaluate(()=>Object.defineProperty(navigator,"clipboard",{value:undefined,configurable:true}));
    await page.locator("#inquiry-copy").click();
    assert.ok(await draft.evaluate(el=>el.selectionStart===0 && el.selectionEnd===el.value.length));
    await page.locator("#inquiry-message").fill("Revised draft");
    assert.ok(await page.locator("#inquiry-draft").isHidden());
    assert.equal(await page.locator("#inquiry-mailto").getAttribute("href"),null);
    const faq=page.locator("#faq details").last();
    await faq.locator("summary").click();
    assert.match(await faq.locator("p").innerText(),/signed Windows installer/);
    assert.equal(await page.locator("#pricing a[href*='stripe.com']").count(),0);
    assert.equal(await page.locator("#pricing .purchase-card a").getAttribute("href"),"#contact");
    console.log("PASS both edition inquiries, prepared email, clipboard and manual copy, FAQ and sales-paused pricing (no checkout link)");
  } catch(err) {
    failures.push("visitor access: "+err.message);
    console.log("FAIL visitor access",err.message);
    await page.screenshot({path:"qa-screenshots/failed-inquiry.png",animations:"disabled"});
    const samples=await page.evaluate(async ()=>{
      const target=document.getElementById("inquiry-copy");
      if (!target) return {url:location.href};
      const samples=[];
      for (let i=0;i<3;i++) {
        await new Promise(resolve=>requestAnimationFrame(resolve));
        const bounds=target.getBoundingClientRect();
        samples.push({top:bounds.top,height:bounds.height,width:bounds.width,scrollY,
          pageHeight:document.documentElement.scrollHeight,transform:getComputedStyle(target).transform,
          focus:document.activeElement.id,status:document.getElementById("inquiry-feedback").textContent});
      }
      return samples;
    });
    console.log("Inquiry layout at failure",JSON.stringify(samples));
  }
  try {
    await page.goto(ORIGIN+"/integration.html");
    const block=page.getByRole("region",{name:"Installation commands"});
    await block.focus();
    assert.ok(await block.evaluate(el=>el===document.activeElement));
    await context.grantPermissions(["clipboard-read","clipboard-write"]);
    const copy=page.getByRole("button",{name:"Copy installation commands"});
    await copy.click();
    await page.getByRole("button",{name:"Copied ✓"}).waitFor();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),await block.locator("code").textContent());
    await page.evaluate(()=>Object.defineProperty(navigator,"clipboard",{value:undefined,configurable:true}));
    await page.getByRole("button",{name:"Copy verification commands"}).click();
    assert.equal(await page.evaluate(()=>getSelection().toString()),await page.locator("#code-verify").textContent());
    console.log("PASS keyboard access to commands, clipboard copy and manual selection");
  } catch(err) {failures.push("developer guide: "+err.message);console.log("FAIL developer guide",err.message.slice(0,400));}
  try {
    await page.goto(ORIGIN+"/aegis.html");
    await page.locator("[data-gate-example=safe]").click();
    assert.equal(await page.locator("#gate-verdict").innerText(),"NO PATTERN FLAGGED");
    assert.equal(await page.locator("[data-gate-example=safe]").getAttribute("aria-pressed"),"true");
    await page.getByRole("link",{name:"Request an Aegis pilot"}).click();
    await page.locator("#inquiry-form").waitFor({state:"visible"});
    assert.equal(await page.locator("#inquiry-plan").inputValue(),"Aegis Security");
    await page.goto(ORIGIN+"/experience.html");
    await page.locator("[data-topic=integrations]").click();
    assert.match(await page.locator("#script-body").innerText(),/Subscriptions are available through Stripe/);
    await page.locator("[data-topic=trust]").click();
    assert.equal(await page.locator("#script-title").innerText(),"Trust must be earned.");
    console.log("PASS Aegis example and pilot destination, Athena transcripts and pricing");
  } catch(err) {failures.push("persona pages: "+err.message);console.log("FAIL persona pages",err.message);}
  try {
    const offline=await browser.newContext({viewport:{width:360,height:800},javaScriptEnabled:false});
    const plain=await offline.newPage();
    await plain.route(/^https:\/\/fonts\./,route=>route.abort());
    await plain.goto(ORIGIN+"/index.html#contact");
    assert.ok(await plain.locator("#primary-nav a[href='./editions.html']").isVisible());
    assert.ok(await plain.locator("#inquiry-direct a[href^='mailto:']").isVisible());
    assert.ok(await plain.locator("#inquiry-form").isHidden());
    const notFound=await readFile("404.html","utf8");
    await plain.route("**/missing/nested/page",route=>route.fulfill({status:404,contentType:"text/html",body:notFound}));
    const response=await plain.goto(ORIGIN+"/missing/nested/page");
    assert.equal(response.status(),404);
    assert.equal(await plain.locator("header img").evaluate(el=>el.naturalWidth>0),true);
    await plain.getByRole("link",{name:"Return home"}).click();
    assert.equal(new URL(plain.url()).pathname,"/");
    await offline.close();
    console.log("PASS no-JavaScript navigation, direct inquiry and nested 404 recovery");
  } catch(err) {failures.push("static fallback: "+err.message);console.log("FAIL static fallback",err.message.slice(0,400));}
  if(interactionErrors.length) failures.push("browser exceptions: "+interactionErrors.join(", "));
  await context.close();
} finally {
  if(browser)await browser.close();
  server.kill("SIGTERM");
}
if(failures.length){
  console.error("\nBROWSER QA FAILURES ("+failures.length+"): \n"+failures.join("\n"));
  process.exitCode=1;
}
