(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');

  // Header: shadow on scroll
  var header = d.getElementById('header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 12); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  var burger = d.getElementById('burger'), nav = d.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Scroll reveal
  var items = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  var yr = d.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---- Analytics: pushes to dataLayer (wire GA4/GTM later) ----
  window.dataLayer = window.dataLayer || [];
  function track(name, params) { window.dataLayer.push(Object.assign({ event: name }, params || {})); }
  d.addEventListener('click', function (e) {
    var el = e.target.closest('a[href*="wa.me"], [data-track]');
    if (el) track('whatsapp_click', { label: el.getAttribute('data-track') || el.textContent.trim().slice(0, 40) });
  });

  var WA = 'https://wa.me/966509198739?text=';

  // ---- Product demo modal ----
  var DEMOS = {
    gov: { img: 'assets/product-governance.webp', title: 'نظام الحوكمة والامتثال',
      desc: 'حل رقمي يساعد المنشآت على إدارة الحوكمة والامتثال والسياسات والمسؤوليات وعمليات المتابعة بكفاءة ووضوح أكبر.',
      feats: ['إدارة الحوكمة والامتثال', 'تنظيم السياسات والإجراءات', 'متابعة المسؤوليات', 'تعزيز الرقابة والشفافية'] },
    emp: { img: 'assets/product-employees.webp', title: 'نظام إدارة الموظفين والمهام',
      desc: 'حل يساعد الشركات على تنظيم الموظفين وتوزيع المهام ومتابعة الإنجاز وإدارة الأولويات ورفع إنتاجية الفريق.',
      feats: ['إدارة الموظفين', 'توزيع المهام', 'متابعة الإنجاز', 'تنظيم الأقسام والأولويات'] },
    prj: { img: 'assets/product-projects.webp', title: 'نظام إدارة المهام والاجتماعات والمشاريع',
      desc: 'حل إداري يجمع المهام والاجتماعات والمشاريع في منصة واحدة منظمة، لمتابعة التنفيذ والتقدم بسهولة.',
      feats: ['إدارة المهام', 'تنظيم الاجتماعات', 'إدارة المشاريع', 'متابعة التنفيذ والتقدم'] }
  };
  var modal = d.getElementById('modal'), lastFocus = null;
  function openModal(key, trigger) {
    var m = DEMOS[key]; if (!m) return;
    lastFocus = trigger;
    d.getElementById('mImg').src = m.img;
    d.getElementById('mImg').alt = m.title;
    d.getElementById('mTitle').textContent = m.title;
    d.getElementById('mDesc').textContent = m.desc;
    d.getElementById('mFeats').innerHTML = m.feats.map(function (f) {
      return '<li><svg class="ic"><use href="#i-check"/></svg>' + f + '</li>';
    }).join('');
    d.getElementById('mCta').href = WA + encodeURIComponent('أريد عرضًا لـ' + m.title);
    modal.hidden = false; d.body.style.overflow = 'hidden';
    modal.querySelector('.modal__x').focus();
    track('demo_open', { product: key });
  }
  function closeModal() {
    modal.hidden = true; d.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  d.querySelectorAll('[data-demo]').forEach(function (b) {
    b.addEventListener('click', function () { openModal(b.getAttribute('data-demo'), b); });
  });
  modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeModal(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // ---- Lead form -> WhatsApp ----
  var form = d.getElementById('leadForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, err = d.getElementById('formErr');
    if (!f.name.value.trim()) { err.hidden = false; f.name.focus(); return; }
    err.hidden = true;
    var lines = ['السلام عليكم، أرغب بالاستفسار:',
      'الاسم: ' + f.name.value.trim(),
      f.company.value.trim() ? 'المنشأة: ' + f.company.value.trim() : '',
      'النظام: ' + f.system.value,
      'الباقة: ' + f.plan.value,
      f.note.value.trim() ? 'ملاحظات: ' + f.note.value.trim() : ''
    ].filter(Boolean);
    track('lead_form_submit', { system: f.system.value, plan: f.plan.value });
    window.open(WA + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
})();
