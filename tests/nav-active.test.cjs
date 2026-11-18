const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const source = readFileSync(join(__dirname, '..', 'assets', 'nav-active.js'), 'utf8');

function loadNavigation(pathname, hasPresentations = false) {
    const nav = { style: {} };
    const links = [];
    function anchor(href, textContent) {
        return {
            href, textContent, style: { cssText: 'font-size:0.875rem' },
            attributes: {},
            getAttribute(name) { return name === 'href' ? this.href : this.attributes[name]; },
            setAttribute(name, value) { this.attributes[name] = value; },
            remove() { links.splice(links.indexOf(this), 1); },
            insertAdjacentElement(position, link) {
                assert.equal(position, 'afterend');
                links.splice(links.indexOf(this) + 1, 0, link);
            }
        };
    }
    links.push(anchor('/posts/', 'Writing'), anchor('/series/', 'Series'));
    if (hasPresentations) links.push(anchor('/talks/', 'Presentations'));
    links.push(anchor('/about/', 'About'));
    const navLinks = {
        style: {},
        querySelector(selector) {
            return links.find(link => selector === `a[href="${link.href}"]`) || null;
        },
        closest(selector) {
            assert.equal(selector, 'nav');
            return nav;
        }
    };
    const document = {
        readyState: 'complete',
        querySelectorAll(selector) {
            return selector === 'nav .nav-links' ? [navLinks] : links;
        },
        createElement(tag) {
            assert.equal(tag, 'a');
            return anchor('', '');
        }
    };
    function run() {
        runInNewContext(source, { window: { location: { pathname } }, document });
    }
    run();
    return { links, nav, navLinks, run };
}

test('homepage navigation gains Presentations after Series and can wrap', () => {
    const state = loadNavigation('/');
    assert.deepEqual(state.links.map(link => link.textContent), [
        'Series', 'Presentations', 'About'
    ]);
    assert.equal(state.links[1].href, '/talks/');
    assert.equal(state.links[1].style.cssText, state.links[0].style.cssText);
    assert.equal(state.nav.style.flexWrap, 'wrap');
    assert.equal(state.navLinks.style.flexWrap, 'wrap');
});

test('static presentation links are not duplicated, including on repeated initialization', () => {
    const state = loadNavigation('/talks/', true);
    state.run();
    assert.equal(state.links.filter(link => link.href === '/talks/').length, 1);
    assert.equal(state.links[1].attributes['aria-current'], 'page');
    assert.equal(state.links[1].style.fontWeight, '600');
});

test('deck paths select Presentations while existing sections keep their selection', () => {
    for (const [pathname, href] of [
        ['/talks/ai-agents-incident-response/', '/talks/'],
        ['/series/ai-kitchen/', '/series/'],
        ['/about/', '/about/']
    ]) {
        const state = loadNavigation(pathname);
        const active = state.links.filter(link => link.attributes['aria-current'] === 'page');
        assert.deepEqual(active.map(link => link.href), [href]);
    }
});

test('writing headers lose the archive link without highlighting another section', () => {
    const state = loadNavigation('/posts/example/');
    state.run();
    assert.ok(!state.links.some(link => link.href === '/posts/'));
    assert.ok(!state.links.some(link => link.attributes['aria-current']));
});
