const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const source = readFileSync(join(__dirname, '..', 'assets', 'analytics.js'), 'utf8');

function loadAnalytics(pathname, referrer = '', trackers = true) {
    const clarity = [], ga4 = [], listeners = {};
    const window = { addEventListener() {} };
    if (trackers) {
        window.clarity = (...args) => clarity.push(args);
        window.gtag = (...args) => ga4.push(args);
    }
    const document = {
        referrer,
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null,
        documentElement: { getAttribute: () => null },
        body: { getAttribute: () => null },
        addEventListener(type, callback) {
            (listeners[type] ||= []).push(callback);
        }
    };
    runInNewContext(source, {
        window, document, URL,
        location: { pathname, origin: 'https://blog.arunmalik.dev', hostname: 'blog.arunmalik.dev', href: `https://blog.arunmalik.dev${pathname}` }
    });
    function click(action, type = 'click', button = 0) {
        const anchor = {
            getAttribute(name) {
                if (name === 'data-resume-action') return action;
                if (name === 'href') return action === 'open' ? '/resume/' : '/resume.pdf';
                return null;
            }
        };
        const target = {
            closest(selector) {
                return selector === 'a' || selector === 'a[data-resume-action]' ? anchor : null;
            }
        };
        for (const callback of listeners[type] || []) callback({ target, type, button });
    }
    return { clarity, ga4, click };
}

test('viewer visits fire once for both trackers, with coarse entry tags', () => {
    for (const [referrer, entry] of [
        ['', 'direct_or_unknown'],
        ['https://blog.arunmalik.dev/about/', 'about'],
        ['https://blog.arunmalik.dev/posts/', 'site'],
        ['https://example.com/profile', 'external']
    ]) {
        const state = loadAnalytics('/resume/', referrer);
        assert.deepEqual(state.clarity.filter(args => args[0] === 'event'), [['event', 'resume_view']]);
        assert.ok(state.clarity.some(args => args[0] === 'set' && args[1] === 'page_type' && args[2] === 'resume'));
        assert.ok(state.clarity.some(args => args[1] === 'resume_entry' && args[2] === entry));
        assert.equal(state.ga4.length, 1);
        assert.equal(state.ga4[0][1], 'resume_view');
        assert.equal(state.ga4[0][2].entry, entry);
    }
});

test('About open and download clicks do not generate viewer visits', () => {
    const state = loadAnalytics('/about/');
    state.click('open');
    state.click('download');
    assert.deepEqual(state.clarity.filter(args => args[0] === 'event'), [
        ['event', 'resume_open'], ['event', 'resume_download']
    ]);
    assert.deepEqual(state.ga4.map(args => [args[1], args[2].from]), [
        ['resume_open', 'about'], ['resume_download', 'about']
    ]);
});

test('viewer download, PDF fallback and middle clicks remain distinct', () => {
    const state = loadAnalytics('/resume/');
    state.click('download');
    state.click('pdf_open');
    state.click('pdf_open', 'auxclick', 1);
    state.click('pdf_open', 'auxclick', 2);
    state.click('unexpected');
    assert.deepEqual(state.clarity.filter(args => args[0] === 'event').map(args => args[1]), [
        'resume_view', 'resume_download', 'resume_pdf_open', 'resume_pdf_open'
    ]);
    assert.equal(state.ga4[1][2].from, 'resume');
});

test('unrelated pages have no resume views and absent trackers do not break links', () => {
    assert.equal(loadAnalytics('/about/').ga4.length, 0);
    assert.equal(loadAnalytics('/resume.pdf').ga4.length, 0);
    const state = loadAnalytics('/resume/', '', false);
    assert.doesNotThrow(() => state.click('download'));
});
