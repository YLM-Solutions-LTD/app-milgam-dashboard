const copy = {
  he: { label: 'פרטי גרסה', version: 'גרסה', updated: 'עדכון אחרון', released: 'תאריך שחרור', unknown: 'לא זמין', preview: 'תצוגה מקדימה', unreleased: 'טרם פורסם' },
  en: { label: 'Release details', version: 'Version', updated: 'Last update', released: 'Release date', unknown: 'Unavailable', preview: 'Preview', unreleased: 'Not released' }
};

export function releaseFields(data, language = 'en', timeZone) {
  const text = copy[language.startsWith('he') ? 'he' : 'en'];
  const date = value => {
    if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) || !Number.isFinite(Date.parse(value))) return text.unknown;
    return new Intl.DateTimeFormat(language, { dateStyle: 'short', timeStyle: 'short', ...(timeZone ? { timeZone } : {}) }).format(new Date(value));
  };
  const version = /^[a-f0-9]{12}$/.test(data.releaseVersion || '') ? data.releaseVersion : text.unknown;
  return {
    text,
    version: data.releaseEnvironment === 'preview' ? `${version} (${text.preview})` : version,
    updated: date(data.releaseUpdatedAt),
    released: data.releaseEnvironment === 'preview' ? text.unreleased : date(data.releaseReleasedAt)
  };
}

export function renderReleaseFooters(doc = document) {
  const language = doc.documentElement.lang || 'en';
  for (const footer of doc.querySelectorAll('footer[data-simplyvibe-release]')) {
    const fields = releaseFields(footer.dataset, language);
    footer.setAttribute('aria-label', fields.text.label);
    for (const name of ['version', 'updated', 'released']) {
      const label = footer.querySelector(`[data-release-label="${name}"]`);
      const value = footer.querySelector(`[data-release-value="${name}"]`);
      if (label) label.textContent = fields.text[name];
      if (value) value.textContent = fields[name];
    }
  }
}

if (typeof document !== 'undefined') {
  renderReleaseFooters();
  new MutationObserver(() => renderReleaseFooters()).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}
