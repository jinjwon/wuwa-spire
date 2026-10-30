const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:820}});
    const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('Page error:',e.message)});
    await page.route('https://**/*',r=>r.abort());
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    await page.waitForFunction(()=>Object.keys(ARTS).length===37);
    const coverage=await page.evaluate(()=>({
      heroes:[...ALL,'rovM','aemMecha'].map(id=>({id,idle:ARTS[id].idle?.frames,states:['attack','guard','hit','cast','ultimate'].map(s=>ARTS[id][s]?.frames)})),
      enemies:Object.keys(EN).map(id=>({id,idle:ARTS[id].idle?.frames,states:['attack','cast','hit'].map(s=>ARTS[id][s]?.frames)})),
      male:ARTS.rovM.attack?.frames,
      invalid:stripOf({naturalWidth:150,naturalHeight:128,src:'invalid'})
    }));
    assert.equal(coverage.heroes.length,9);assert.equal(coverage.enemies.length,28);
    coverage.heroes.forEach(a=>{assert.equal(a.idle,1,a.id);assert(a.states.every(n=>n===4),a.id)});
    coverage.enemies.forEach(a=>{assert.equal(a.idle,1,a.id);assert(a.states.every(n=>n===4),a.id)});assert.equal(coverage.male,4);assert.equal(coverage.invalid,null);
    await page.evaluate(()=>{newGame('rov',0);S.vari=0;S.modal=null;startCombat(['levia'],'boss');render()});
    await page.waitForSelector('#u-rov .sprite img');
    assert.match(await page.locator('#u-rov .sprite img').getAttribute('src'),/rov_idle.png$/);
    await page.evaluate(()=>{ROVER_SKIN='M';S.c.rebuild=true;render()});
    assert.match(await page.locator('#u-rov .sprite img').getAttribute('src'),/rovM_idle.png$/);
    await page.evaluate(()=>{anim('u-rov','atk',0);flushFx()});
    await page.waitForFunction(()=>document.querySelector('#u-rov .sprite img').src.endsWith('rovM_attack.png'));
    const frame=await page.evaluate(()=>{
      const img=document.querySelector('#u-rov .sprite img');
      const animation=img.getAnimations()[0];animation.pause();animation.currentTime=490;
      return {shift:new DOMMatrix(getComputedStyle(img).transform).m41,width:img.getBoundingClientRect().width};
    });
    assert(Math.abs(frame.shift+frame.width*.75)<1,'last frame must remain visible');
    await page.waitForFunction(()=>document.querySelector('#u-rov .sprite img').src.endsWith('rovM_idle.png'));
    for(const [action,state]of [['block','guard'],['hit','hit'],['cast','cast'],['ult','ultimate'],['enter','cast']]){
      await page.evaluate(action=>{anim('u-rov',action,0);flushFx()},action);
      await page.waitForFunction(state=>document.querySelector('#u-rov .sprite').dataset.motion===state,state);
      assert.match(await page.locator('#u-rov .sprite img').getAttribute('src'),new RegExp(`rovM_${state}.png$`));
    }
    await page.waitForFunction(()=>!document.querySelector('#u-rov .sprite').dataset.motion);
    await page.evaluate(()=>{const key='e'+S.c.enemies[0].uid;anim(key,'atk',0);flushFx()});
    await page.waitForFunction(()=>document.querySelector('.enemy .sprite').dataset.motion==='attack');
    assert.match(await page.locator('.enemy .sprite img').getAttribute('src'),/enemy_levia_attack.png$/);
    await page.waitForFunction(()=>!document.querySelector('.enemy .sprite').dataset.motion);
    await page.evaluate(()=>{ROVER_SKIN='F';S.c.rebuild=true;render()});
    await page.waitForTimeout(1300);
    await page.screenshot({path:path.join(root,'art/combat-preview-v2.png')});
    const cards=await page.evaluate(async()=>{
      const results=await Promise.all(Object.keys(CD).map(async id=>{const image=await loadImg(cardArt(id));return{id,loaded:!!image}}));
      return results;
    });
    assert.equal(cards.length,70);assert(cards.every(c=>c.loaded),'all card illustrations load offline');
    await page.evaluate(()=>{newGame('aem',0);S.modal=null;startCombat(['scout'],'battle');render();toggleMecha(6);render()});
    assert.match(await page.locator('#u-aem .sprite img').getAttribute('src'),/aemMecha_idle.png$/);
    await page.evaluate(()=>{anim('u-aem','ult',0);flushFx()});
    await page.waitForFunction(()=>document.querySelector('#u-aem .sprite').dataset.motion==='ultimate');
    assert.match(await page.locator('#u-aem .sprite img').getAttribute('src'),/aemMecha_ultimate.png$/);
    await page.evaluate(()=>{toggleMecha(6);render()});
    await page.waitForTimeout(550);
    assert.match(await page.locator('#u-aem .sprite img').getAttribute('src'),/aem_idle.png$/);
    await page.evaluate(()=>{S.c.hand=[mk('aem_b')];S.c.energy=99;render();playCard(S.c.hand[0].uid,S.c.enemies[0])});
    await page.waitForFunction(()=>document.querySelector('#u-aem .sprite').dataset.motion==='guard');
    for(let act=0;act<2;act++)for(let vari=0;vari<2;vari++){
      const loaded=await page.evaluate(async({act,vari})=>{S.act=act;S.vari=vari;const key=regionArt();return{key,battle:!!await loadImg(`assets/maps/${key}-battle.png`),route:!!await loadImg(`assets/maps/${key}-route.png`)}},{act,vari});
      assert(loaded.battle&&loaded.route,loaded.key);
    }
    await page.evaluate(()=>{S.act=0;S.vari=0;S.screen='map';S.pos=null;S._scrolled=true;render()});
    await page.locator('.route-art').evaluate(img=>img.decode());
    await page.waitForFunction(()=>!document.querySelector('.turnban'));
    await page.screenshot({path:path.join(root,'art/map-preview-v2.png'),fullPage:true});
    assert(await page.locator('.mnode.avail').count()>0);
    assert.equal(await page.locator('.mnode:disabled').count()>0,true);
    const before=await page.evaluate(()=>JSON.stringify(S.map));
    await page.locator('.mnode.avail').first().click();
    assert.equal(await page.evaluate(()=>JSON.stringify(S.map)),before,'art must not mutate route topology');
    await page.evaluate(()=>{startCombat(['levia'],'boss');render()});
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('#u-aem .fig').evaluate(e=>getComputedStyle(e).animationName),'none');
    assert.deepEqual(errors,[]);
    console.log('PASS: 37 appearances, hero/enemy action states, 70 offline card images, 4 region pairs, Rover skins, mecha switching during animation, guard card action, route interaction, last-frame visibility, idle restoration, reduced motion, no page errors.');
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
