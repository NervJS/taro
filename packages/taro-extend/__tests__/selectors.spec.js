import { document, options } from '@tarojs/runtime'
import { Sizzle } from '../src/jquery/sizzle'

describe('selector', () => {
  /**
   * The render DOM
   * @type {HTMLElement}
   */
  const dom = document.createElement('main')
  options.html.renderHTMLTag = true
  dom.setAttribute('id', 'test')
  dom.setAttribute('class', 'test')
  document.body.appendChild(dom)

  it('should work with ID', () => {
    const $dom = Sizzle('#test')
    expect($dom[0]).toBe(dom)
  })

  it('should work with tagName', () => {
    const $dom = Sizzle('main')
    expect($dom[0]).toBe(dom)
  })

  it('should work with className', () => {
    const $dom = Sizzle('.test')
    expect($dom[0]).toBe(dom)
  })

  it('should work with >', () => {
    // console.log(dom)
    dom.innerHTML = '<view class="t1" id="t1"></view>'
    // console.log(dom.childNodes)
    const $dom = Sizzle('main > .t1')
    expect($dom[0]).toBe(dom.firstChild)
  })

  describe('css3', () => {
    dom.innerHTML = `
    <h1 id="header">jQuery Test Suite</h1>
    <h2 id="banner"></h2>
    <h2 id="userAgent"></h2>
    
    <div id="nothiddendiv" style="height:1px;background:white;" class="nothiddendiv">
      <div id="nothiddendivchild"></div>
    </div>
    <dl id="dl" style="display:none;">
    <div id="main" style="display: none;">
      <p id="firstp">See <a id="simon1" href="http://simon.incutio.com/archive/2003/03/25/#getElementsBySelector" rel="bookmark">this blog entry</a> for more information.</p>
      <p id="ap">
        Here are some links in a normal paragraph: <a id="google" href="http://www.google.com/" title="Google!">Google</a>, 
        <a id="groups" href="http://groups.google.com/" class="GROUPS">Google Groups (Link)</a>. 
        This link has <code><a href="http://smin" id="anchor1">class="blog"</a></code>: 
        <a href="http://diveintomark.org/" class="blog" hreflang="en" id="mark">diveintomark</a>
  
      </p>
      <div id="foo">
        <p id="sndp">Everything inside the red border is inside a div with <code>id="foo"</code>.</p>
        <p lang="en" id="en">This is a normal link: <a id="yahoo" href="http://www.yahoo.com/" class="blogTest">Yahoo</a></p>
        <p id="sap">This link has <code><a href="#2" id="anchor2">class="blog"</a></code>: <a href="http://simon.incutio.com/" class="blog link" id="simon">Simon Willison's Weblog</a></p>
  
      </div>
      <span id="name+value"></span>
      <p id="first">Try them out:</p>
      <ul id="firstUL"></ul>
      <ol id="empty"></ol>
      <form id="form" action="formaction">
        <label for="action" id="label-for">Action:</label>
        <input type="text" name="action" value="Test" id="text1" maxlength="30"/>
        <input type="text" name="text2" value="Test" id="text2" disabled="disabled"/>
        <input type="radio" name="radio1" id="radio1" value="on"/>
  
        <input type="radio" name="radio2" id="radio2" checked="checked"/>
        <input type="checkbox" name="check" id="check1" checked="checked"/>
        <input type="checkbox" id="check2" value="on"/>
  
        <input type="hidden" name="hidden" id="hidden1"/>
        <input type="text" style="display:none;" name="foo[bar]" id="hidden2"/>
        
        <input type="text" id="name" name="name" value="name" />
        <input type="search" id="search" name="search" value="search" />
        
        <button id="button" name="button" type="button">Button</button>
        
        <textarea id="area1" maxlength="30">foobar</textarea>
        
        <select name="select1" id="select1">
          <option id="option1a" class="emptyopt" value="">Nothing</option>
          <option id="option1b" value="1">1</option>
          <option id="option1c" value="2">2</option>
          <option id="option1d" value="3">3</option>
        </select>
        <select name="select2" id="select2">
          <option id="option2a" class="emptyopt" value="">Nothing</option>
          <option id="option2b" value="1">1</option>
          <option id="option2c" value="2">2</option>
          <option id="option2d" selected="selected" value="3">3</option>
        </select>
        <select name="select3" id="select3" multiple="multiple">
          <option id="option3a" class="emptyopt" value="">Nothing</option>
          <option id="option3b" selected="selected" value="1">1</option>
          <option id="option3c" selected="selected" value="2">2</option>
          <option id="option3d" value="3">3</option>
          <option id="option3e">no value</option>
        </select>
        
        <object id="object1" codebase="stupid">
          <param name="p1" value="x1" />
          <param name="p2" value="x2" />
        </object>
        
        <span id="台北Táiběi"></span>
        <span id="台北" lang="中文"></span>
        <span id="utf8class1" class="台北Táiběi 台北"></span>
        <span id="utf8class2" class="台北"></span>
        <span id="foo:bar" class="foo:bar"></span>
        <span id="test.foo[5]bar" class="test.foo[5]bar"></span>
        
        <foo_bar id="foobar">test element</foo_bar>
      </form>
      <b id="floatTest">Float test.</b>
      <iframe id="iframe" name="iframe"></iframe>
      <form id="lengthtest">
        <input type="text" id="length" name="test"/>
        <input type="text" id="idTest" name="id"/>
      </form>
      <table id="table"></table>
  
      <form id="name-tests">
        <!-- Inputs with a grouped name attribute. -->
        <input name="types[]" id="types_all" type="checkbox" value="all" />
        <input name="types[]" id="types_anime" type="checkbox" value="anime" />
        <input name="types[]" id="types_movie" type="checkbox" value="movie" />
      </form>
      
      <form id="testForm" action="#" method="get">
        <textarea name="T3" rows="2" cols="15">?
  Z</textarea>
        <input type="hidden" name="H1" value="x" />
        <input type="hidden" name="H2" />
        <input name="PWD" type="password" value="" />
        <input name="T1" type="text" />
        <input name="T2" type="text" value="YES" readonly="readonly" />
        <input type="checkbox" name="C1" value="1" />
        <input type="checkbox" name="C2" />
        <input type="radio" name="R1" value="1" />
        <input type="radio" name="R1" value="2" />
        <input type="text" name="My Name" value="me" />
        <input type="reset" name="reset" value="NO" />
        <select name="S1">
          <option value="abc">ABC</option>
          <option value="abc">ABC</option>
          <option value="abc">ABC</option>
        </select>
        <select name="S2" multiple="multiple" size="3">
          <option value="abc">ABC</option>
          <option value="abc">ABC</option>
          <option value="abc">ABC</option>
        </select>
        <select name="S3">
          <option selected="selected">YES</option>
        </select>
        <select name="S4">
          <option value="" selected="selected">NO</option>
        </select>
        <input type="submit" name="sub1" value="NO" />
        <input type="submit" name="sub2" value="NO" />
        <input type="image" name="sub3" value="NO" />
        <button name="sub4" type="submit" value="NO">NO</button>
        <input name="D1" type="text" value="NO" disabled="disabled" />
        <input type="checkbox" checked="checked" disabled="disabled" name="D2" value="NO" />
        <input type="radio" name="D3" value="NO" checked="checked" disabled="disabled" />
        <select name="D4" disabled="disabled">
          <option selected="selected" value="NO">NO</option>
        </select>
      </form>
      <div id="moretests">
        <form>
          <div id="checkedtest" style="display:none;">
            <input type="radio" name="checkedtestradios" checked="checked"/>
            <input type="radio" name="checkedtestradios" value="on"/>
            <input type="checkbox" name="checkedtestcheckboxes" checked="checked"/>
            <input type="checkbox" name="checkedtestcheckboxes" />
          </div>
        </form>
        <div id="nonnodes"><span>hi</span> there <!-- mon ami --></div>
        <div id="t2037">
          <div><div class="hidden">hidden</div></div>
        </div>
      </div>
      
      <div id="tabindex-tests">
        <ol id="listWithTabIndex" tabindex="5">
          <li id="foodWithNegativeTabIndex" tabindex="-1">Rice</li>
          <li id="foodNoTabIndex">Beans</li>
          <li>Blinis</li>
          <li>Tofu</li>
        </ol>
      
        <div id="divWithNoTabIndex">I'm hungry. I should...</div>
        <span>...</span><a href="#" id="linkWithNoTabIndex">Eat lots of food</a><span>...</span> |
        <span>...</span><a href="#" id="linkWithTabIndex" tabindex="2">Eat a little food</a><span>...</span> |
        <span>...</span><a href="#" id="linkWithNegativeTabIndex" tabindex="-1">Eat no food</a><span>...</span>
        <span>...</span><a id="linkWithNoHrefWithNoTabIndex">Eat a burger</a><span>...</span>
        <span>...</span><a id="linkWithNoHrefWithTabIndex" tabindex="1">Eat some funyuns</a><span>...</span>
        <span>...</span><a id="linkWithNoHrefWithNegativeTabIndex" tabindex="-1">Eat some funyuns</a><span>...</span>
      </div>
      
      <div id="liveHandlerOrder">
        <span id="liveSpan1"><a href="#" id="liveLink1"></a></span>
        <span id="liveSpan2"><a href="#" id="liveLink2"></a></span>
      </div>
    </div>
    </dl>
    <div id="fx-test-group" style="position:absolute;width:1px;height:1px;overflow:hidden;">
      <div id="fx-queue" name="test">
        <div id="fadein" class='chain test' name='div'>fadeIn<div>fadeIn</div></div>
        <div id="fadeout" class='chain test out'>fadeOut<div>fadeOut</div></div>
        
        <div id="show" class='chain test'>show<div>show</div></div>
        <div id="hide" class='chain test out'>hide<div>hide</div></div>
        
        <div id="togglein" class='chain test'>togglein<div>togglein</div></div>
        <div id="toggleout" class='chain test out'>toggleout<div>toggleout</div></div>
      
        
        <div id="slideup" class='chain test'>slideUp<div>slideUp</div></div>
        <div id="slidedown" class='chain test out'>slideDown<div>slideDown</div></div>
        
        <div id="slidetogglein" class='chain test'>slideToggleIn<div>slideToggleIn</div></div>
        <div id="slidetoggleout" class='chain test out'>slideToggleOut<div>slideToggleOut</div></div>
      </div>
      
      <div id="fx-tests"></div>
    </div>
    
    <ol id="tests"></ol>    
`
  })

  function testById (selector, ids) {
    it(selector, () => {
      const $target = Sizzle(selector)
      expect($target.length).toBeGreaterThan(0)
      expect($target.map(t => t.id)).toEqual(ids)
    })
  }

  testById('#first', ['first'])
  testById('p > a', ['simon1', 'google', 'groups', 'mark', 'yahoo', 'simon'])
  testById('p> a', ['simon1', 'google', 'groups', 'mark', 'yahoo', 'simon'])
  testById('p >a', ['simon1', 'google', 'groups', 'mark', 'yahoo', 'simon'])
  testById('p>a', ['simon1', 'google', 'groups', 'mark', 'yahoo', 'simon'])
  testById('p > a.blog', ['mark', 'simon'])
  testById('a + a', ['groups'])
  testById('a+ a', ['groups'])
  testById('a +a', ['groups'])
  testById('p + p', ['ap', 'en', 'sap'])
  testById('p#firstp + p', ['ap'])
  testById('a.GROUPS + code + a', ['mark'])
  testById('a + a, code > a', ['groups', 'anchor1', 'anchor2'])
})
