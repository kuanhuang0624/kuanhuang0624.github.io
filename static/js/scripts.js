/* ==========================================================================
   Kuan Huang — academic homepage
   ---------------------------------------------------------------------------
   Loading model inherited from the academic-homepage-template by Sen Li
   (MIT License): `contents/config.yml` drives the page metadata, the
   navigation and the section list; each section's body is a Markdown file in
   `contents/` that is fetched, parsed and sanitised in the browser.

   Differences from the upstream template:
     - no rotating background slideshow (the title area is static)
     - no Bootstrap (navigation and section highlighting are implemented here)
     - no MathJax (the content contains no mathematical expressions)
   ========================================================================== */

(function () {
    'use strict';

    var CONTENT_DIR = 'contents/';
    var CONFIG_FILE = 'config.yml';

    /* Keys in config.yml that configure behaviour rather than fill an element. */
    var CONFIG_ONLY_KEYS = ['sections', 'nav'];

    /* Protocols permitted on href/src attributes inside Markdown content. */
    var ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

    /* ----------------------------------------------------------------------
       Helpers
       ---------------------------------------------------------------------- */

    function decodeEntities(value) {
        var textarea = document.createElement('textarea');
        textarea.innerHTML = String(value == null ? '' : value);
        return textarea.value;
    }

    function setElementValue(element, value) {
        if (value && typeof value === 'object') {
            if ('text' in value) {
                element.textContent = decodeEntities(value.text);
            }
            if ('href' in value && element instanceof HTMLAnchorElement) {
                element.href = value.href;
            }
            return;
        }
        element.textContent = decodeEntities(value);
    }

    /* ----------------------------------------------------------------------
       Configuration
       ---------------------------------------------------------------------- */

    function loadConfig() {
        return fetch(CONTENT_DIR + CONFIG_FILE)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Could not load ' + CONFIG_FILE + ' (' + response.status + ')');
                }
                return response.text();
            })
            .then(function (text) {
                return jsyaml.load(text) || {};
            })
            .catch(function (error) {
                console.warn(error);
                return {};
            });
    }

    function applyConfig(config) {
        Object.keys(config).forEach(function (key) {
            if (CONFIG_ONLY_KEYS.indexOf(key) !== -1) {
                return;
            }
            var element = document.getElementById(key);
            if (!element) {
                console.warn('config.yml: no element with id "' + key + '"');
                return;
            }
            setElementValue(element, config[key]);
        });
    }

    function normalizeSections(sections) {
        if (!Array.isArray(sections)) {
            return [];
        }
        return sections
            .map(function (section) {
                if (typeof section === 'string' && section.trim() !== '') {
                    return {
                        id: section,
                        nav: section.toUpperCase(),
                        title: section.toUpperCase(),
                        href: '#' + section
                    };
                }
                if (!section || typeof section !== 'object' || !section.id) {
                    return null;
                }
                return {
                    id: section.id,
                    nav: section.nav || section.id.toUpperCase(),
                    title: section.title || section.nav || section.id.toUpperCase(),
                    href: section.href || '#' + section.id
                };
            })
            .filter(Boolean);
    }

    /* ----------------------------------------------------------------------
       Rendering
       ---------------------------------------------------------------------- */

    function renderNavigation(sections) {
        var list = document.getElementById('nav-list');
        if (!list) {
            return;
        }
        list.replaceChildren();

        sections.forEach(function (section) {
            var item = document.createElement('li');
            var link = document.createElement('a');
            link.href = section.href;
            link.textContent = decodeEntities(section.nav);
            link.dataset.section = section.id;
            item.appendChild(link);
            list.appendChild(item);
        });
    }

    function renderSections(sections) {
        var container = document.getElementById('sections');
        if (!container) {
            return;
        }
        container.replaceChildren();

        sections.forEach(function (section) {
            var element = document.createElement('section');
            var wrap = document.createElement('div');
            var heading = document.createElement('h2');
            var body = document.createElement('div');

            element.id = section.id;
            element.className = 'section';
            element.setAttribute('aria-labelledby', section.id + '-title');

            wrap.className = 'wrap';

            heading.className = 'section-title';
            heading.id = section.id + '-title';
            heading.textContent = decodeEntities(section.title);

            body.className = 'section-body';
            body.id = section.id + '-md';

            wrap.appendChild(heading);
            wrap.appendChild(body);
            element.appendChild(wrap);
            container.appendChild(element);
        });
    }

    /* ----------------------------------------------------------------------
       Markdown
       ---------------------------------------------------------------------- */

    function sanitizeMarkdownHtml(html) {
        var template = document.createElement('template');
        template.innerHTML = html;

        template.content
            .querySelectorAll('script, style, iframe, object, embed, link, meta, base, form, input, button')
            .forEach(function (node) {
                node.remove();
            });

        template.content.querySelectorAll('*').forEach(function (node) {
            Array.prototype.slice.call(node.attributes).forEach(function (attribute) {
                var name = attribute.name.toLowerCase();
                var value = attribute.value.trim();

                if (name.indexOf('on') === 0) {
                    node.removeAttribute(attribute.name);
                    return;
                }

                if (name === 'href' || name === 'src') {
                    try {
                        var url = new URL(value, window.location.href);
                        if (ALLOWED_PROTOCOLS.indexOf(url.protocol) === -1) {
                            node.removeAttribute(attribute.name);
                        }
                    } catch (error) {
                        node.removeAttribute(attribute.name);
                    }
                }
            });
        });

        return template.innerHTML;
    }

    function loadMarkdownSection(id) {
        return fetch(CONTENT_DIR + id + '.md')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Could not load ' + id + '.md (' + response.status + ')');
                }
                return response.text();
            })
            .then(function (markdown) {
                var target = document.getElementById(id + '-md');
                if (!target) {
                    return;
                }
                target.innerHTML = sanitizeMarkdownHtml(marked.parse(markdown));
            })
            .catch(function (error) {
                console.warn(error);
            });
    }

    /* ----------------------------------------------------------------------
       Navigation behaviour
       ---------------------------------------------------------------------- */

    function bindMobileNavigation() {
        var toggle = document.getElementById('nav-toggle');
        var list = document.getElementById('nav-list');
        if (!toggle || !list) {
            return;
        }

        function close() {
            list.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.addEventListener('click', function () {
            var open = list.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        list.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                close();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && list.classList.contains('is-open')) {
                close();
                toggle.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 768) {
                close();
            }
        });
    }

    /* Marks the navigation link of the section currently under the header. */
    function bindSectionHighlighting(sections) {
        var links = {};
        document.querySelectorAll('#nav-list a[data-section]').forEach(function (link) {
            links[link.dataset.section] = link;
        });

        var ids = sections.map(function (section) {
            return section.id;
        });
        if (ids.length === 0) {
            return;
        }

        var scheduled = false;
        var current = null;

        function update() {
            scheduled = false;
            var nav = document.getElementById('sitenav');
            var offset = (nav ? nav.getBoundingClientRect().height : 0) + 16;
            var active = ids[0];

            ids.forEach(function (id) {
                var element = document.getElementById(id);
                if (element && element.getBoundingClientRect().top <= offset) {
                    active = id;
                }
            });

            /* At the very bottom of the page the last section is the active one. */
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
                active = ids[ids.length - 1];
            }

            if (active === current) {
                return;
            }
            if (current && links[current]) {
                links[current].removeAttribute('aria-current');
            }
            if (links[active]) {
                links[active].setAttribute('aria-current', 'true');
            }
            current = active;
        }

        function schedule() {
            if (!scheduled) {
                scheduled = true;
                window.requestAnimationFrame(update);
            }
        }

        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        update();
    }

    /* The sections do not exist until the Markdown has loaded, so an initial
       #hash in the address bar has to be honoured after rendering. */
    function scrollToInitialHash() {
        var hash = window.location.hash;
        if (!hash || hash === '#page-top') {
            return;
        }
        var target = document.querySelector(hash);
        if (target) {
            target.scrollIntoView();
        }
    }

    /* ----------------------------------------------------------------------
       Start-up
       ---------------------------------------------------------------------- */

    document.addEventListener('DOMContentLoaded', function () {
        marked.use({ mangle: false, headerIds: false });
        bindMobileNavigation();

        loadConfig()
            .then(function (config) {
                applyConfig(config);
                var sections = normalizeSections(config.sections);
                renderNavigation(sections);
                renderSections(sections);

                return Promise.all(
                    sections.map(function (section) {
                        return loadMarkdownSection(section.id);
                    })
                ).then(function () {
                    bindSectionHighlighting(sections);
                    scrollToInitialHash();
                });
            })
            .catch(function (error) {
                console.warn(error);
            });
    });
})();
